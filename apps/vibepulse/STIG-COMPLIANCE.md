# STIG Compliance & Security Hardening

Reference checklist for Vibepulse GSD aligned with applicable DISA STIG
controls for web applications and development toolchains.

## Content Security Policy (CSP)

The Tauri webview and any future hosted deployment **must** set the
following CSP headers. In the static adapter output the meta tag in
`src/app.html` is the appropriate location:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src  'self';
    style-src   'self' 'unsafe-inline';
    img-src     'self' data:;
    font-src    'self';
    connect-src 'self';
    object-src  'none';
    frame-ancestors 'none';
  "
/>
```

> **V-222602** – The application must set the Content-Security-Policy header.
> **V-222603** – The application must not include unsafe-eval in script-src.

## Input Validation (V-222609)

All user inputs **must** be validated on both client and server side.
Svelte `bind:value` does not sanitize — always pass through a validation
layer before using values in DOM or API calls.

## Cookie & Session Flags (V-222577, V-222578)

If HTTP cookies are introduced in a future hosted mode:

- `Secure` flag required on all cookies.
- `HttpOnly` flag required on session cookies.
- `SameSite=Strict` or `SameSite=Lax` required.

## Dependency Integrity (V-222656)

- Use `npm audit` and `biome check` in CI.
- Pin dependency versions in `package-lock.json` (committed).
- Review new dependencies for known CVEs before adoption.

## Error Handling (V-222607)

- Never expose stack traces or internal paths to end users.
- Log errors server-side; display generic messages in the UI.

## Transport Security (V-222596)

- All external API calls must use HTTPS.
- No mixed-content allowed.

## Biome Lint Rules (mapped to STIGs)

| Biome Rule                     | STIG Reference |
| ------------------------------ | -------------- |
| `noDangerouslySetInnerHtml`    | V-222602 (XSS) |
| `noExplicitAny`               | V-222609 (type safety) |
| `noConsole`                    | V-222607 (info leak) |
| `a11y/*` (recommended)        | Section 508 / WCAG |

## Style Dictionary Token Governance

- All token values originate from `design/tokens/**/*.tokens.json`.
- Generated output in `design/styles/` **must not** be hand-edited.
- `npm run tokens:build` regenerates CSS, TypeScript, and Tailwind preset.
- CI should run `tokens:build` and fail if `design/styles/` has uncommitted
  diffs, ensuring the generated output matches the source tokens.
