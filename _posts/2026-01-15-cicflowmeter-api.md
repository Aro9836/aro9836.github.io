---
layout: post
title: "CICFlowMeter API (Dockerized)"
date: 2026-01-15
featured: true
description: "How I built a Dockerized REST API around CICFlowMeter to extract network flow features from PCAP files — architecture, challenges, and lessons."
tags: [projects, fastapi, docker, networking, security]
---

This project provides a **REST API wrapper** around [CICFlowMeter](https://github.com/CanadianInstituteForCybersecurity/CICFlowMeter) using **FastAPI** and **Docker**.

The API accepts a **PCAP file**, processes it using CICFlowMeter inside a Docker container, and returns the generated **CSV flow files as a ZIP archive**.

---

## The Problem

CICFlowMeter is a network traffic analyzer that extracts features from PCAP files — things like packet lengths, inter-arrival times, and flow duration. It's a staple tool in network intrusion detection research.

The issue: it's a Java/Gradle desktop application with no HTTP interface. If you want to integrate it into a pipeline, you either run it manually or write glue code.

I needed a way to call it programmatically via HTTP — so I built one.

---

## How It Works

```
Client → POST /analyze (PCAP file)
       → FastAPI saves to /pcap
       → Triggers CICFlowMeter (via Gradle)
       → CSVs generated in /flow
       → ZIPped and returned
```

Only **one request is processed at a time** — enforced by a lock. CICFlowMeter is resource-heavy and running concurrent analyses would exhaust memory fast.

---

## Project Structure

```
/
├── api/            # FastAPI application
├── code/           # CICFlowMeter source (cloned in Docker)
├── pcap/           # Uploaded PCAP files
├── flow/           # Generated CSV flow files
├── gradle-task     # Custom Gradle task (runcmd)
├── Dockerfile
└── README.md
```

---

## Key Decisions

### Why Docker?

CICFlowMeter requires Java + Gradle + specific library versions. Putting this in a Docker image means:

1. No dependency conflicts with the Python API layer
2. Reproducible environment anywhere
3. Easy to ship as a self-contained unit

### Why FastAPI?

- Async request handling
- Auto-generated Swagger UI (great for testing)
- Pydantic for file validation
- Clean routing

### The Lock Mechanism

```python
import asyncio

_lock = asyncio.Lock()

@app.post("/analyze")
async def analyze(file: UploadFile):
    async with _lock:
        # save PCAP, run CICFlowMeter, return ZIP
        ...
```

Simple but effective. Requests that arrive while processing will wait.

---

## Challenges

**CICFlowMeter Gradle setup inside Docker** — the build cache needed to be warmed up at image build time, not at runtime. First attempt had 2-minute cold starts. Fixed by adding a `RUN gradle build` step in the Dockerfile.

**File cleanup** — after returning the ZIP, temporary files need cleanup. Used `BackgroundTasks` in FastAPI for this.

---

## Usage

```bash
# Start the API
docker-compose up

# Analyze a PCAP file
curl -X POST http://localhost:8000/analyze \
  -F "file=@capture.pcap" \
  -o results.zip

# Unzip and inspect
unzip results.zip
```

---

[View on GitHub](https://github.com/thisizaro/cicflowmeter-docker-api)
