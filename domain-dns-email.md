# davidwhittingham.com: DNS, Email, and Hosting

Reference for how this domain's DNS and email are configured, and what
to know before making changes.

## Registrar vs. DNS provider

- **Registrar**: Namecheap (where the domain is registered/renewed)
- **DNS provider**: Cloudflare (nameservers point here: `arturo.ns.cloudflare.com`,
  `violet.ns.cloudflare.com`)

Namecheap no longer controls DNS for this domain — Cloudflare is
authoritative. Any DNS changes happen in the Cloudflare dashboard, not
Namecheap's.

## What's hosted where

| Subdomain | Points to | Purpose |
|---|---|---|
| `davidwhittingham.com` (root) | Netlify (`apex-loadbalancer.netlify.com`) | Main site |
| `www` | Netlify (`davidwhittingham.netlify.app`) | Main site (www) |
| `stats` | Fly.io (`umani.fly.dev`) | Stats/analytics app |
| `photos` | Cloudflare Tunnel → PhotoPrism | Personal photo library |
| `ssh` | Cloudflare Tunnel → Shredpad's sshd | Remote SSH access |

`photos` and `ssh` are both gated by **Cloudflare Access** (Google
login, email allow-list) — not public.

## Email

**Catch-all forwarding**: any address `@davidwhittingham.com` forwards
to `davidwhittingham94@gmail.com`, via **Cloudflare Email Routing**
(not Namecheap — see incident below). Configured as:
- 3 MX records (`routeN.mx.cloudflare.net`), auto-created by Cloudflare
  when Email Routing is enabled — don't hand-edit these
- A catch-all rule in Cloudflare's Email Routing settings, forwarding
  everything to the Gmail address

To add/change forwarding destinations or per-address rules: Cloudflare
dashboard → the zone → **Email → Email Routing**.

## Incident: email forwarding broke when DNS moved to Cloudflare (Aug 2026)

**What happened**: Namecheap has a free "Redirect Email" catch-all
feature, but it's not a portable DNS record — it's a proprietary
feature that only works while Namecheap is the authoritative DNS
provider. When nameservers were switched to Cloudflare, Namecheap's
forwarding silently stopped (no MX record existed at all in the new
zone), and nobody noticed for about two weeks.

**Fix**: Set up Cloudflare's own native Email Routing with an
equivalent catch-all rule (see above).

**Data loss**: Mail servers that tried delivering during the gap would
have queued and retried for their standard window (typically 3-5 days)
before bouncing back to the sender with a failure notice. Since the gap
was ~12 days, essentially everything sent during that window had
already bounced by the time this was fixed — there's no queue to
recover from on the DNS/hosting side. If something important is
missing, the sender needs to resend it.

**Lesson for next time**: when moving a domain's DNS to a new
provider, pull the *complete* existing record set first (including any
provider-specific features like email forwarding, which won't show up
as a normal DNS record you can just copy) and explicitly recreate the
equivalent on the new provider *before or immediately after* cutting
over nameservers - not after noticing something's broken.

## Making changes safely

Before changing nameservers, adding/removing DNS records, or touching
Email Routing:
1. Pull the current full record set from whichever provider is
   currently authoritative
2. Recreate anything non-obvious (forwarding, verification TXT records,
   SPF/DKIM if ever added) on the new side first
3. Only then switch nameservers/cut over
