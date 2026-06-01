---
layout: post
title: "Serving a Resume on GitHub Pages"
date: 2026-01-28
featured: false
description: "A quick walkthrough of how I set up my resume PDF to be served via GitHub Pages with a clean redirect."
tags: [github-pages, jekyll, tips]
---

I wanted `thisizaro.github.io/resume` to open my resume PDF directly — no extra clicks. Here's the quick setup.

---

## The Goal

Visiting `/resume` should instantly show the PDF. No intermediate page, no clicking.

---

## The Setup

In my Jekyll site, I created `resume/index.html`:

```html
---
title: Resume
layout: contentbase
---
<html>
<head>
  <meta http-equiv="refresh"
        content="0; url={{ '/resume/resume_v26.pdf' | relative_url }}" />
</head>
<body>
  <p>Redirecting... 
    <a href="{{ '/resume/resume_v26.pdf' | relative_url }}">Click here</a>
  </p>
</body>
</html>
```

The `meta refresh` tag with `content="0"` redirects instantly on page load.

---

## File Naming Convention

I version my PDFs — `resume_v23.pdf`, `resume_v24.pdf`, etc. This lets me:

1. Keep older versions as backup
2. Update the redirect by changing one line
3. See at a glance which version is live

---

## No-Cache Headers

GitHub Pages caches aggressively. To force browsers to pick up a new PDF version, I added no-cache meta tags:

```html
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="pragma" content="no-cache" />
```

This ensures that after a push, visitors get the latest version.

---

## The PDF Itself

I use a PDF viewer embedded in the browser. Most modern browsers open PDFs natively — no special setup needed on the server side.

For the PDF itself: I keep my resume in a Google Doc and export as PDF whenever I update it. Simple and version-controlled via the filename convention.

---

## Result

`https://thisizaro.github.io/resume` → instant PDF display.

Clean, simple, and requires zero maintenance once set up.
