---
layout: post
title: "Flamingo Chat — Backend Architecture Deep Dive"
date: 2026-05-10
featured: true
description: "Complete backend architecture documentation for Flamingo Chat — a real-time anonymous chat app built in Go with WebSockets, including every data flow and design decision."
tags: [projects, go, websockets, architecture, backend]
excerpt: >
  Complete backend documentation for Flamingo Chat — a real-time anonymous matchmaking chat built in Go. Every data flow, call graph, and design decision explained.
---

# Flamingo Chat — Backend Documentation

This documents the complete backend architecture for Flamingo Chat — every data flow, every call graph, and every design decision. Written for someone maintaining or extending the backend.

---

## Architecture Overview

The backend is split into four distinct layers. Each layer has one job and talks only to adjacent layers.

```
┌──────────────────────────────────────────────┐
│              Browser / Client                │
└─────────────────────┬────────────────────────┘
                      │ WebSocket (JSON bytes)
┌─────────────────────▼────────────────────────┐
│         transport/websocket                  │
│  client.go — one per connection              │
│  hub.go    — registry of all clients         │
└─────────────────────┬────────────────────────┘
                      │ raw bytes + Client pointer
┌─────────────────────▼────────────────────────┐
│                  app                         │
│  handler.go — message routing                │
│  session.go — session lifecycle              │
└─────────────────────┬────────────────────────┘
                      │ domain operations
┌─────────────────────▼────────────────────────┐
│               domain/chat                   │
│  matchmaker.go — pairing logic               │
│  chat.go       — message relay              │
└──────────────────────────────────────────────┘
```

**Rule:** Each layer only imports layers below it. No upward imports.

---

## Core Events

Every action in Flamingo Chat is driven by WebSocket events:

### `init`
Client sends user identity. Creates a session, registers the user.

```json
{ "event": "init", "user_id": "abc123", "display_name": "Guest" }
```

### `join_queue`
User requests to be matched with a stranger. Added to the matchmaking queue.

```json
{ "event": "join_queue" }
```

### `send_message`
Sends a message to the matched partner.

```json
{ "event": "send_message", "text": "hello" }
```

### `leave_chat`
User exits the current chat. Partner is notified, both return to idle.

```json
{ "event": "leave_chat" }
```

### `ping`
Keepalive — resets inactivity timer.

---

## Matchmaking Logic

The matchmaker maintains a queue of waiting users. When a new user joins:

1. Check queue for a waiting user
2. If found: create a `Chat`, notify both parties, remove both from queue
3. If not found: add current user to queue, wait

```go
func (m *Matchmaker) TryMatch(user *User) *Chat {
    m.mu.Lock()
    defer m.mu.Unlock()

    if len(m.queue) == 0 {
        m.queue = append(m.queue, user)
        return nil
    }

    partner := m.queue[0]
    m.queue = m.queue[1:]
    return NewChat(user, partner)
}
```

**Why no priority queue?** The use case is anonymous random matching — order doesn't matter. A simple FIFO slice is sufficient.

---

## Concurrency Model

Go's goroutine model maps naturally to WebSocket connections:

- Each client connection gets a **readPump** goroutine (blocks on WebSocket read)
- Each client connection gets a **writePump** goroutine (blocks on channel send)
- The Hub runs a single **select loop** goroutine — no locking needed for the registry

All shared state (matchmaker queue, active chats) uses `sync.Mutex`. The Hub's register/unregister channels serialize connection lifecycle events.

---

## The Hub

```go
type Hub struct {
    clients    map[*Client]bool
    register   chan *Client
    unregister chan *Client
    broadcast  chan []byte
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.register:
            h.clients[client] = true
        case client := <-h.unregister:
            delete(h.clients, client)
            close(client.send)
        case message := <-h.broadcast:
            for client := range h.clients {
                client.send <- message
            }
        }
    }
}
```

The Hub's `Run()` loop is the single point of truth for connection state. No mutex needed because only one goroutine touches `h.clients`.

---

## Session Cleanup

Sessions expire after inactivity. A background ticker checks all sessions periodically:

```go
go func() {
    ticker := time.NewTicker(30 * time.Second)
    for range ticker.C {
        cleanupStaleSessions()
    }
}()
```

Stale sessions are disconnected, their partner notified, and the slot freed for new connections.

---

## Design Decisions

**Why Go?** I wanted to learn Go in a real project. WebSocket servers are a natural fit — goroutines map cleanly to connections, the standard library has solid WebSocket support via `gorilla/websocket`.

**Why no database?** Flamingo Chat is ephemeral — anonymous, no history. All state is in-memory. This simplifies the architecture dramatically and makes the concurrency model easier to reason about.

**Why the layered architecture?** It emerged from trying to keep the WebSocket transport layer ignorant of business logic. This made testing easier — domain logic can be tested without spinning up WebSocket connections.

---

## Known Limitations

- No persistence — server restart drops all active chats
- Single instance only — no horizontal scaling without a shared message broker (Redis pub/sub would work)
- No message history — by design, but limits some use cases
