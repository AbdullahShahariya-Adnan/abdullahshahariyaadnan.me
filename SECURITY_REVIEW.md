# Portfolio security review (source-code review, not a penetration test)

## Controls added
- Content creation, updates, deletion, and image uploads require a signed admin JWT verified by backend middleware.
- Tokens explicitly carry an admin role and expire after 2 hours. Existing sessions must log in again.
- Production refuses an unset/weak JWT_SECRET (minimum 32 characters). Rotate JWT_SECRET when deploying this version.
- Login limited to 8 attempts per 15 minutes per IP, in addition to general rate limits.
- Project fields, image file signatures, IDs, and HTTPS links are validated server-side.
- Admin token stored in sessionStorage rather than localStorage (still accessible to scripts in the page; HttpOnly cookies and CSRF protection are preferable for high-risk apps).
- Helmet headers and CORS origin allowlist retained.

## Before production deployment
1. Set NODE_ENV=production and JWT_SECRET to a new cryptographically random secret (32+ chars). Do not commit secrets or .env files.
2. Set CORS_ORIGIN to your exact HTTPS frontend domain(s), not '*'.
3. Ensure only trusted admin_users exist; remove test/demo accounts, use a unique strong password, and secure your database account with least privilege.
4. Restrict database networking, enforce TLS for DB connections, and configure secure backups.
5. Add Cloudinary credentials only to backend environment variables. Restrict image upload account permissions and quotas.
6. Set up bot protection for the public contact form, audit logs, monitoring, and regular dependency/security updates.
7. Test login, token expiration, forbidden POST/PUT/DELETE, uploads, and contact spam protection against a staging deployment.

## Limitations
This is a static code review and hardening pass, not proof of a secure live deployment. The contact form remains public by design. Login does not yet have MFA or account-wide lockout. A stolen token remains usable until expiration. Rate limits depend on correct trusted proxy configuration and may need a shared store when scaling.
