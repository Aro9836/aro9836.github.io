---
layout: post
title: "Notes on Go — Concepts Worth Understanding"
date: 2026-05-16
featured: false
description: "Personal notes on Go concepts that took me time to understand — goroutines, channels, interfaces, and the Go way of thinking."
tags: [go, learning, notes]
---

These are personal notes from learning Go. Not a tutorial — just the things that clicked late or that I had to look up multiple times.

---

## Goroutines Are Not Threads

My first mistake: treating goroutines like OS threads.

Goroutines are **lightweight** — thousands can run concurrently without the overhead of actual thread creation. The Go runtime multiplexes them onto OS threads using an M:N scheduler.

```go
go func() {
    fmt.Println("running concurrently")
}()
```

The `go` keyword is the entire syntax. That's it.

**Gotcha:** If `main()` exits, all goroutines are killed — even if they haven't finished.

---

## Channels Are Typed Pipes

A channel moves values between goroutines safely:

```go
ch := make(chan int)

go func() {
    ch <- 42  // send
}()

val := <-ch  // receive (blocks until something arrives)
fmt.Println(val)
```

**Unbuffered channels** (like above) block the sender until someone receives. **Buffered channels** (`make(chan int, 10)`) allow sends up to the buffer size before blocking.

---

## select Statement

Like a `switch` for channel operations — picks whichever channel is ready:

```go
select {
case msg := <-ch1:
    fmt.Println("from ch1:", msg)
case msg := <-ch2:
    fmt.Println("from ch2:", msg)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
}
```

This is how you implement timeouts, fan-in, and non-blocking channel reads.

---

## Interfaces Are Implicit

No `implements` keyword. If a type has the required methods, it satisfies the interface:

```go
type Writer interface {
    Write(p []byte) (n int, err error)
}

type MyWriter struct{}

func (w MyWriter) Write(p []byte) (int, error) {
    // ...
    return len(p), nil
}

// MyWriter now satisfies Writer — no declaration needed
```

This is **duck typing with compile-time checking**. I find this elegant.

---

## defer Is LIFO

Multiple defers in a function run in reverse order (last in, first out):

```go
func example() {
    defer fmt.Println("third")
    defer fmt.Println("second")
    defer fmt.Println("first")
}
// Output: first, second, third
```

Useful for cleanup — `defer file.Close()` right after `os.Open()` keeps related code together.

---

## Error Handling

Go has no exceptions. Functions return errors as values:

```go
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething failed: %w", err)
}
```

The `%w` verb wraps the error — lets callers use `errors.Is()` and `errors.As()` to inspect the chain.

**Opinion:** This pattern feels verbose coming from Python, but it forces you to think about every failure path. I've started to appreciate it.

---

## The Empty Interface

`interface{}` (or `any` in modern Go) holds any value:

```go
func printAnything(v any) {
    fmt.Printf("%T: %v\n", v, v)
}
```

Use it sparingly — it gives up type safety. Generics (Go 1.18+) often replace it for typed containers.

---

## Still Learning

- Generics (type parameters)
- `sync` package patterns (Mutex, WaitGroup, Once)
- `context` for cancellation propagation
- Building HTTP servers with `net/http`

Go's simplicity is real but the concurrency model requires a different mental model. Worth the investment.
