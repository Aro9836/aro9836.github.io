---
layout: post
title: "BrowserBridge — Controlling Your Real Browser from Code"
date: 2026-03-11
featured: true
description: "How I built BrowserBridge — a local WebSocket bridge that lets external systems control your actual browser session, preserving logins and cookies."
tags: [projects, javascript, automation, browser]
---

## The Problem

I was working on an AI automation where the agent needed to use my **real browser session** — not a headless browser, not Puppeteer's isolated instance. My actual browser, with my logins, cookies, and browser state intact.

Standard tools don't work here:
- **Puppeteer / Selenium** — run separate browser instances, no access to your session
- **Headless Chrome** — same problem, plus no visual feedback
- **Browser extensions** — limited to in-browser JavaScript, can't receive external commands easily

So I built BrowserBridge: a minimal setup that allows external tools to control basic browser features programmatically.

---

## How It Works

BrowserBridge has two parts:

1. **A Chrome extension** — runs inside your browser, listens on a WebSocket
2. **A local WebSocket server** — receives commands from external systems and forwards them to the extension

```
External Tool (AI agent, script, etc.)
    ↓  HTTP/WebSocket
Local Server (Node.js)
    ↓  WebSocket
Chrome Extension (inside real browser)
    ↓  Chrome APIs
Your actual browser tabs, DOM, etc.
```

---

## Commands Supported

Basic browser control via WebSocket messages:

```json
{ "action": "navigate", "url": "https://example.com" }
{ "action": "click", "selector": "#submit-button" }
{ "action": "type", "selector": "#search", "text": "hello" }
{ "action": "screenshot" }
{ "action": "get_html", "selector": "body" }
```

---

## The Chrome Extension Side

The extension uses Chrome's `tabs`, `scripting`, and `webNavigation` APIs. The key insight: since it runs inside the real browser, it has full access to your session — cookies, localStorage, authenticated state.

```javascript
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "click") {
    chrome.scripting.executeScript({
      target: { tabId: msg.tabId },
      func: (selector) => document.querySelector(selector)?.click(),
      args: [msg.selector]
    });
  }
});
```

---

## Security Note

BrowserBridge is **local only** — the WebSocket server binds to `localhost`. It's designed for personal automation workflows, not anything exposed to the network. Don't run it in production or on shared machines.

---

## Use Cases

- AI agents that need authenticated browser sessions
- Personal automation scripts (form filling, data extraction)
- Testing flows that require real browser state
- Research on browser automation techniques

---

## Why Not Just Use Playwright?

Playwright is excellent for testing. But it creates a fresh browser context — no cookies, no logins, no extension state. If you need to automate something in your *actual* browser (because the site detects headless browsers, or because you need your session), it doesn't help.

BrowserBridge fills that specific gap.

---

[View on GitHub](https://github.com/thisizaro/BrowserBridge)
