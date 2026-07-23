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
npx pnpm@11.10.0 install
npx pnpm@11.10.0 dev
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

[The sync workflow](./.github/workflows/sync.yml) rebuilds the documentation from the highest stable `v*` release tag after a README or docs update, when a release is published, and once per day as a backstop. A successful sync commits the generated files to `main` and invokes the deploy workflow directly.

The site publishes exactly one release at a time under `/docs`, with no version in the URL. The tag it was built from is recorded in `content/version.json` and shown in the navigation bar. Keep the `github.com/rimio-ai/rimz` mirror and its release tags current with the primary Gitea remote so the published site stays current; dispatches fire only for GitHub pushes, and the scheduled sync also reads GitHub.

## Sync content

Generated docs are committed so this site builds without a RimZ source checkout. To refresh them from a local RimZ checkout:

```sh
RIMZ_SRC=../rimz pnpm sync
```

The sync script picks the highest stable `v*` tag, checks it out into a temporary worktree, and regenerates `content/docs/` and `public/docs-assets/` from it. Patch releases such as `v0.4.1` supersede `v0.4` automatically; prereleases such as `v0.5.0-rc.1` are ignored. Hand-written scaffolding under `content/template/` seeds the generated tree.

Search descriptions for imported pages are generated from each upstream document's opening prose, while hand-written pages keep their descriptions in `content/template/`. Keep lead paragraphs specific and useful: content checks reject missing, thin, overly long, or duplicate descriptions.

Run `pnpm check:content` to verify page completeness, link and image targets, the release source ref, and `content/version.json`.
