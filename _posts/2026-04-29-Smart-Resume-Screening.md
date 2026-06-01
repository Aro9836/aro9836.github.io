---
layout: post
title: "Smart Resume Screening Project Documentation"
date: 2026-04-29
featured: false
description: "How I built a resume screening and interview automation system using Google Apps Script, Google Sheets, and AI — no external backend required."
tags: [projects, automation, google-apps-script, ai]
excerpt: >
  An automated hiring workflow — resume upload to interview scheduling — built entirely inside Google Apps Script and Sheets.
---

# Resume Processing & Interview Automation System

## Overview

This system automates the hiring workflow — from resume upload to interview scheduling.

A candidate uploads a resume through a web app. The system:
- Stores the file in Google Drive
- Extracts and analyzes content using AI
- Scores the candidate based on job requirements
- Updates application status
- Assigns interview slots (if qualified)
- Sends email notifications to candidate and admin

Everything runs inside **Google Apps Script and Google Sheets** — no external backend required.

---

## Workflow

```
Candidate uploads resume
       ↓
Entry created in Google Sheets
       ↓
Job added to processing queue
       ↓
Trigger starts processing
       ↓
Resume analyzed and scored
       ↓
Status updated
       ↓
Interview slot assigned (if eligible)
       ↓
Emails sent
```

---

## Scoring System

Instead of relying on a single AI score, the system uses a structured rubric:

| Category | Weight |
|----------|--------|
| Skills Match | 40% |
| Work Experience | 30% |
| Job Description Fit | 20% |
| Resume Structure | 10% |

Final score is calculated using a formula in code, ensuring consistency and avoiding unreliable AI outputs.

---

## Key Modules

### `00_Config.gs`
Stores system configuration (API keys, thresholds) and provides helper utilities (UUID generation, timestamps).

### `01_DriveSetup.gs`
Creates and validates required Google Drive folder structure.

### `02_SheetHelpers.gs`
Handles sheet creation and data operations (read/write/update).

### `03_ResumeProcessor.gs`
Core processing logic:
- Extracts text from uploaded PDF
- Sends to AI for structured analysis
- Applies scoring formula
- Writes results back to sheet

### `04_InterviewScheduler.gs`
Slot assignment logic:
- Reads available slots from sheet
- Assigns first available slot to qualified candidates
- Marks slot as taken

### `05_EmailNotifications.gs`
Sends templated emails:
- Confirmation to candidate (with/without interview details)
- Summary to admin

---

## Why Google Apps Script?

The constraint was: **no external infrastructure**. The hiring team already lived in Google Workspace. Apps Script runs on Google's servers, triggered by sheet events — zero deployment overhead.

Trade-offs:
- ✅ Zero hosting cost, zero infra
- ✅ Native Google Drive / Sheets / Gmail integration
- ⚠️ 6-minute execution time limit per trigger
- ⚠️ Rate limits on external API calls
- ⚠️ Limited debugging tooling

For this use case (low volume, event-driven), the trade-offs were acceptable.

---

## Lessons

**AI outputs need structure.** Raw AI text is unreliable for scoring. Prompting the model to return JSON with specific fields, then applying your own formula, gives consistent and auditable results.

**Queue-based processing over direct triggers.** Direct triggers can fail silently. A queue (a sheet column marking "pending") with a periodic trigger that processes items is more resilient.
