# DevNov — Retired demo-preview content

The old local demo cards are no longer public portfolio content. `demoEnabled`
is deliberately set to `false`, so fictional projects and illustrative team
profiles cannot appear merely because a real list is empty.

## Where the former project concepts went

The twelve fictional project patterns are now optional, internal Supabase
`[Template]` drafts in [`supabase/seed.sql`](./supabase/seed.sql). They are
unpublished, unfeatured, without hosted links or screenshots, and their copy
plainly says that they are not client work. They can be viewed only by an
administrator in the content panel.

Running the current seed more than once is safe: it creates missing template
slugs only and does not overwrite existing content or re-add technology links
that an administrator removed.

## Converting a template into a real case study

Edit every fictional field, remove the `[Template]` title prefix, select the
actual technology stack, upload an approved screenshot, add the project's
real HTTPS link, and only then mark it Published. Do not publish an
illustrative concept, mockup, fictional person, or invented outcome.

The original local demo assets can remain as unused design references, but
they are not a source of public portfolio data.
