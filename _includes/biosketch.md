**Backend Engineer** — FastAPI · PostgreSQL · Docker · Deployment

I build production-ready backend systems with strong foundations in Linux and systems programming.

My focus areas include designing scalable REST APIs, implementing authentication & RBAC systems, structuring relational databases, and containerizing and deploying backend services.

This site documents my backend projects, engineering notes, and technical explorations.

---

**Featured posts:**

{% for post in site.posts %}{% if post.featured %}
- [{{ post.title }}]({{ post.url }}) <small>{{ post.date | date_to_long_string }}</small>{% endif %}{% endfor %}
