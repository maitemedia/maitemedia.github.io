# Security headers deployment notes

This project includes a root-level `_headers` file with the frontend hardening policy prepared for static hosts that support file-based header rules, including Netlify and Cloudflare Pages.

If the active production host for `en.maitemedia.com` ignores `_headers`, apply the same header set at the CDN, reverse proxy, or web server layer for all site paths.

Header set to apply:

- Content-Security-Policy
- Strict-Transport-Security
- X-Frame-Options
- Referrer-Policy
- X-Content-Type-Options
- Permissions-Policy

Recommended scope:

- Apply to `/*`
- Keep HTTPS enabled for the production domain
- Re-test the final domain after deploy to confirm the host is serving the headers in HTTP responses
