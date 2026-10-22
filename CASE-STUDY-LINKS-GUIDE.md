# DevNov — Shareable Case Study Links (M09)

Each published managed portfolio item uses the existing static React app and case study modal. Opening the modal adds a query URL:

`https://your-owned-domain.com/?project=your-project-slug#work`

Visitors opening this direct link see that real project’s case study. No framework migration, no per-project route rewrite, no new backend.

The copy-link button requires a secure HTTPS site or localhost to use the browser clipboard API. Closing the modal removes `project` from the query string. Browser Back closes the modal when opened on the page.

Only published genuine projects can be linked. Static crawlers normally see the homepage SEO metadata (individual project SEO pages would need a separate static-generation feature).
