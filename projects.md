---
layout: page
title: Projects
description: "Projects by Aranya Dutta — backend systems, APIs, Chrome extensions, and Linux kernel modules."
keywords: "projects, FastAPI, Docker, CICFlowMeter, SafeShare, KataYomi, KernelTalk, backend engineering"
---

# Projects

Things I'm actively building and shipping — from backend APIs to Chrome extensions and kernel modules.

---

<div class="project-entry">
<h2>CICFlowMeter API</h2>

**Stack:** Python · FastAPI · Docker · Java · Gradle

<div class="project-links">
  <a href="https://github.com/thisizaro/cicflowmeter-docker-api" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="/2026/01/15/cicflowmeter-api/">Blog Post</a>
</div>

Built a Dockerized REST API to process uploaded PCAP files using CICFlowMeter and return extracted network flow features as CSV files.

- Orchestrated execution of Java/Gradle-based CICFlowMeter from a FastAPI service, isolating heavy dependencies from the API layer
- Implemented file handling, ZIP packaging, and controlled single-request execution to support large PCAP analysis workloads
- Exposed interactive API documentation via Swagger UI for easy testing and integration
</div>

---

<div class="project-entry">
<h2>SafeShare Backend</h2>

**Stack:** Python · FastAPI · JWT · Bcrypt · Docker

<div class="project-links">
  <a href="https://github.com/thisizaro/safeshare_backend" target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href="/2025/12/23/Safeshare/">Blog Post</a>
</div>

Secure file-sharing service using FastAPI, implementing JWT for stateless authentication and Bcrypt for password hashing.

- Designed a Role-Based Access Control (RBAC) system and middleware to protect sensitive API endpoints
- Authored comprehensive technical documentation including SRS, System Architecture, and Testing Plans following SDLC best practices
- Containerized with Docker for reproducible deployment
</div>

---

<div class="project-entry">
<h2>KataYomi — Katakana Hover Reader</h2>

**Stack:** JavaScript · Chrome Extension API · DOM Manipulation

<div class="project-links">
  <a href="https://github.com/thisizaro/KataYomi" target="_blank" rel="noopener noreferrer">GitHub</a>
</div>

Lightweight Chrome extension (Manifest V3) to assist Japanese learners by displaying Hiragana readings for Katakana text on hover.

- Implemented client-side Katakana detection by traversing DOM text nodes and matching Unicode ranges (U+30A0–U+30FF)
- Developed custom translation logic using Unicode offset mapping for fast, dictionary-free conversion
- Designed a non-intrusive tooltip overlay that doesn't disrupt page layout
</div>

---

<div class="project-entry">
<h2>KernelTalk</h2>

**Stack:** C · Linux Kernel · IPC · Character Device Drivers

<div class="project-links">
  <a href="https://github.com/thisizaro/KernelTalk" target="_blank" rel="noopener noreferrer">GitHub</a>
</div>

Linux kernel module enabling multi-client terminal-based chat via a custom character device (`/dev/kerneltalk`).

- Implemented producer–consumer synchronization using a circular buffer to safely handle concurrent operations
- Designed blocking and non-blocking I/O behavior to manage message flow across multiple user-space processes
- Enabled kernel–user space communication using file operations (open, read, write) in C
</div>
