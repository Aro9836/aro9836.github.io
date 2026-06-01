---
layout: post
title: "SafeShare Explained"
date: 2025-12-23
featured: true
description: "SafeShare is a secure file-sharing backend with JWT auth, RBAC, audit logging, and Dockerized deployment — here's how it works."
tags: [projects, fastapi, security, docker]
---

SafeShare is a secure file-sharing and access control system that allows users to upload, manage, and share files safely. It features role-based access, audit logging, and a REST API for integration and management.

## Features

- User authentication and role-based access control
- Secure file upload, download, and sharing
- Audit logs for all file-related actions
- REST API with Swagger UI documentation
- Dockerized deployment for easy setup

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/thisizaro/safeshare_backend.git
   cd safeshare
   ```

2. Set up environment variables in a `.env` file
3. Build and run Docker containers:

   ```bash
   docker-compose up --build
   ```

4. Access the API at `http://localhost:8000` and Swagger docs at `/docs`

---

## Architecture

The system is built around three core concerns:

### Authentication
JWT tokens are issued on login and validated on every protected route via middleware. Tokens are stateless — no session storage needed.

### Authorization (RBAC)
Users are assigned roles (e.g., `admin`, `user`). Each endpoint checks the role before allowing access. This keeps permission logic centralized.

### File Handling
Files are stored with unique names to prevent collisions. Download links can be scoped — only users with appropriate access can retrieve them.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| API | FastAPI |
| Auth | JWT + Bcrypt |
| Storage | Local / configurable |
| Docs | Swagger UI (auto-generated) |
| Deploy | Docker + docker-compose |

---

## Key Design Decisions

**Why JWT over sessions?** Stateless auth scales better — no session store needed. For a file-sharing API this matters since multiple service instances can validate tokens independently.

**Why Bcrypt?** It's slow by design. That's the point for password hashing — it makes brute-force attacks expensive.

**Why FastAPI?** Async by default, auto-generates OpenAPI docs, and Pydantic makes request validation clean.

---

[View on GitHub](https://github.com/thisizaro/safeshare_backend)
