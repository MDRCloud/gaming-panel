# MDRCloud Gaming Panel (fork notes)

This repository is MDRCloud's fork of [calagopus/panel](https://github.com/calagopus/panel), used to host customer game servers at `https://games.mdrcloud.com`. This file describes only what differs from upstream and how to maintain it. Infrastructure details (hosts, network, backups, secrets handling) live in the private runbook: `MDRCloud-DeveloperPortal/docs/GAMING-PANEL.md`.

## Branch model

| Branch | Purpose |
|--------|---------|
| `main` | Mirror of `upstream/main`. Do not commit MDRCloud changes here. |
| `mdrcloud` | What we deploy: upstream plus the changes below. |

Remotes: `origin` = `MDRCloud/gaming-panel`, `upstream` = `calagopus/panel`.

## What we changed (keep this list short)

Everything is additive where possible so upstream merges stay clean.

| Path | Change |
|------|--------|
| `frontend/extensions/mdrcloud_brand/` | Branding extension: Mantine theme, brand tokens, self-hosted fonts. No core files touched. |
| `frontend/public/` | Replaced favicons, apple-touch/PWA icons, `icon.svg` and `site.webmanifest` with MDRCloud versions (the only core-file edits). |
| `.github/workflows/mdrcloud-image.yml` | Builds the x86_64 panel image and pushes it to GHCR. |
| `.github/workflows/upstream-sync.yml` | Weekly PR merging `upstream/main` into `mdrcloud`. |
| `frontend/pnpm-lock.yaml` | Lockfile entries for the extension's font packages. |
| `MDRCLOUD.md` | This file. |

## Branding

Source of truth is the private `mdrcloud-brand` repo.

- **Tokens:** `frontend/extensions/mdrcloud_brand/src/brand.css` is a copy of `mdrcloud-brand/tokens/brand.css`. The Mantine palette in `src/index.ts` mirrors the same colours. When the brand repo changes, copy the file and update `index.ts` to match.
- **Fonts:** Plus Jakarta Sans, Comfortaa and JetBrains Mono come from `@fontsource-variable/*` packages (self-hosted, no CDN).
- **Icons:** generated from `mdrcloud-brand/assets/logos/mdrcloud-logo.png` (white artwork) on `#0a0d18` at 16, 32, 180, 192 and 512 px, plus `favicon.ico`. `icon.svg` is `mdrcloud-brand/icon.svg`. The panel's *Application icon* setting points at `/icon.svg`, so replacing that file rebrands the sidebar and login logo.
- **Runtime settings** (admin UI, stored in the database, not in code): application name `MDRCloud Game Hosting`, registration disabled, telemetry disabled.
- The footer still credits Calagopus. Upstream's licence requires keeping that notice.

## Building the image

Pushing to `mdrcloud` runs `mdrcloud-image.yml`, which builds the frontend, cross-compiles `panel-rs` for `x86_64-unknown-linux-musl`, and pushes `ghcr.io/mdrcloud/gaming-panel:latest` and `:<commit sha>`. The package is private. The first build has no cache and is slow.

## Syncing with upstream

`upstream-sync.yml` opens a PR `sync/upstream-<date>` into `mdrcloud` every Monday. Merge conflicts fail the run; resolve locally:

```bash
git fetch upstream
git checkout mdrcloud
git merge upstream/main
```

Likely conflict spots: files in `frontend/public/`, `frontend/pnpm-lock.yaml`. After merging, check that `frontend/extensions/mdrcloud_brand` still type-checks (`pnpm typecheck`) and that the login page renders in the brand theme before merging to `mdrcloud`.

## Local development

- Node 24+ and **pnpm 11+** are required. If an older pnpm shadows it on `PATH` (for example one from `Program Files\nodejs`), call the newer one by full path.
- `cd frontend && pnpm install && pnpm dev`. The dev server proxies the API to `localhost:8000` (`BACKEND_PORT` to change), so run a backend there or tunnel to one.
- On Windows with `core.autocrlf=true`, `pnpm biome:validate` reports every upstream file as mis-formatted (CRLF). That is a local artefact; CI runs on LF. Check only your own files: `pnpm exec biome check --css-parse-tailwind-directives=true <path>`.

## Integration with other MDRCloud systems

- **Developer Portal** reads servers from `GET /api/admin/servers` using a panel API key with only the admin permission `servers.read`. A server belongs to a CMS customer through its `customer_id` entry in the server's **Container Labels** (Admin, Servers, the server, General, advanced mode). No label means staff-only.
- **Join address** shown to customers comes from each allocation's *IP alias* (`play.mdrcloud.xyz`), not the node's internal IP.
- **Billing/CMS** does not provision servers yet; staff create customer servers in the panel and set the label by hand.

## Known limitations

- Browser file uploads through `games.mdrcloud.com` are capped at 100 MB by Cloudflare's free plan. Large worlds and modpacks go through SFTP.
- The image is x86_64 only. Upstream's multi-arch, all-in-one and Docker Hub builds are intentionally not built.
