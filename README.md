# RimZ Docs

Public documentation site for [RimZ](https://github.com/rimio-ai/rimz), built with Next.js and Fumadocs.

## Development

```sh
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

If `pnpm` is not installed globally, use the pinned package manager through `npx`:

```sh
npx pnpm@11.24.0 install
npx pnpm@11.24.0 dev
```

## Build

```sh
pnpm build
```

The build is configured as a static export for GitHub Pages. It writes the site to `out/`, including `.nojekyll` so Pages serves the `_next` assets.

For a project Pages URL such as `https://USER.github.io/REPO/`, build with the repository path:

```sh
NEXT_PUBLIC_BASE_PATH=/REPO NEXT_PUBLIC_SITE_URL=https://USER.github.io/REPO pnpm build
```

## Deployment

Every push to `main` deploys the static export to GitHub Pages at <https://rimz.rimio.ai> through [the deploy workflow](./.github/workflows/deploy.yml).

[The sync workflow](./.github/workflows/sync.yml) rebuilds the documentation from RimZ `main` and every stable `v*` release tag after a README or docs update, when a release is published, and once per day as a backstop. A successful sync commits the generated files to `main` and invokes the deploy workflow directly.

The site publishes several documentation sets, chosen with the version dropdown at the top of the docs sidebar:

- `latest`: RimZ trunk (`main`), served at `/docs`. This is the default set, the one in the sitemap and `llms.txt`, and the only one search engines index.
- One set per stable release tag, served at `/docs/<tag>`, for example `/docs/v0.4.3`. Release pages carry a notice that links back to `latest`, and are marked `noindex`. Prereleases such as `v0.5.0-rc.1` are never published.

Switching versions keeps the reader on the same page when it exists in the target version, and falls back to that version's introduction otherwise. Each version has its own static search index at `/api/search/<version>`. `content/versions.json` records every set and the commit it was built from. Keep the `github.com/rimio-ai/rimz` mirror, its `main` branch, and its release tags current with the primary Gitea remote so the published site stays current; dispatches fire only for GitHub pushes, and the scheduled sync also reads GitHub.

## Sync content

Generated docs are committed so this site builds without a RimZ source checkout. To refresh them from a local RimZ checkout:

```sh
RIMZ_SRC=../rimz pnpm sync
```

The sync script checks out `main` and every stable `v*` tag into temporary worktrees and regenerates `content/versions/<version>/` and `public/docs-assets/<version>/` from each, rebuilding every set from scratch so a transform change reaches old releases too. Hand-written scaffolding under `content/template/` seeds each set; pages that a release predates are dropped from its navigation. A new upstream page under `docs/guide` or `docs/reference` must be mapped in `scripts/sync-content.mjs` and listed in the template `meta.json`, or the sync fails.

The introduction and the quickstart are cut from each version's own RimZ `README.md`, between `{/* sync:<id>:start */}` and `{/* sync:<id>:end */}` markers in the template, so each release shows the commands it actually shipped. The introduction takes the README's opening, project status, feature list, compatibility matrix, and architecture; the quickstart takes "Get started", "Install" (older releases only), "Everyday moves", and "Configuration". `readmePages` in `scripts/sync-content.mjs` lists the sections, and a renamed README heading fails the sync. A README link to its own `#anchor` follows the heading to whichever page holds it, or falls back to the README on GitHub.

Search descriptions for imported pages are generated from each upstream document's opening prose, while hand-written pages keep their descriptions in `content/template/`. Keep lead paragraphs specific and useful: content checks reject missing, thin, overly long, or duplicate descriptions.

Run `pnpm check:content` to verify every version's pages, that links and images stay inside their own version, the source refs, and `content/versions.json`.
