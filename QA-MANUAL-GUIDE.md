# Devnov visual, usability and accessibility checklist

**Automated checks (offline):**

```powershell
npm.cmd run qa:content
npm.cmd run check
```

Static automated checks inspect navigation anchor targets, published project images, social URLs, contact configuration and SEO state. They **cannot** confirm real external links, actual Web3Forms delivery, web-vitals, cross-browser behavior, WCAG compliance, or visual design quality.

## Required manual checks before launch

1. Preview at **360px, 390px, 768px, 1024px, 1440px**. Look for horizontal scroll, cut-off text, unreadable cards, and tightly spaced CTAs.
2. Test navigation with keyboard only: **Tab**, **Shift+Tab**, **Enter**, and **Escape**. On mobile, menu must open, close, and return focus logically.
3. Test with browser zoom at **200%**, and device preferences set to **reduced motion**.
4. Use screen-reader software (NVDA/VoiceOver), check heading order, accessible labels and dialog open/close behavior.
5. Add a real project with a screenshot and alt text. Check card, category filter, modal, source-code link and live-demo link on mobile and desktop.
6. Confirm actual recipient delivery of the contact form in Web3Forms, including failure messages, spam filtering and required input validation. Never assume success because a button rendered.
7. Check every external URL manually; the static link check does not contact websites.
8. Review data/privacy statements, cookies/analytics (if added later), images/licenses and team consent with your legal/business advisor before international launch.
9. Inspect browser DevTools Console and Lighthouse on a deployed URL; fix genuine warnings before publishing.
10. Test behavior on a physical Android or iPhone, plus desktop Chrome/Edge/Firefox if possible.

The branded `public/404.html` is a fallback for hosts that serve it. Confirm 404 behavior with your specific host: a client-side SPA rewrite configuration may return the index page instead.