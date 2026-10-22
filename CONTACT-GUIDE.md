# Devnov enquiry and contact configuration

The website is a fully static React/Vite application: no database and no server-side code. You can publish contact options using any or all of these:

1. **Verified email:** edit `agency.email` in `src/data/agencyData.js`.
2. **Calendly booking:** add your own HTTPS booking URL to `agency.calendlyUrl`.
3. **Web3Forms enquiry form:** create an access key with Web3Forms, copy `.env.example` to `.env.local`, and enter `VITE_WEB3FORMS_ACCESS_KEY=<your public access key>`. Restart `npm.cmd run dev` or rebuild after edits.

Web3Forms accepts a public access key inside browser JS; **do not put private API keys or sensitive credentials in Vite `VITE_` values.** The form validates required name, email and message fields and shows success only after an accepted API response. Protect your Web3Forms setup with the provider's spam controls, notifications and domain restrictions where offered.

If none of the contact methods are configured, the form is disabled intentionally and the website shows a clear pending setup message. Do not deploy as a lead-generation website until a contact method works. Test delivery to the final email inbox yourself.

Before production, review privacy obligations for countries you operate in and add an appropriate privacy notice describing how submitted enquiry data is processed by your service providers.