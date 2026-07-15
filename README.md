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

[The sync workflow](./.github/workflows/sync.yml) imports content from the RimZ repository after a README or docs update and once per day as a backstop. A successful sync commits the generated files to `main` and invokes the deploy workflow directly.

Both automation paths read `github.com/rimio-ai/rimz` at `main`. Keep that GitHub remote current with the primary Gitea remote so the published site stays current; dispatches fire only for GitHub pushes, and the scheduled sync also reads GitHub.

## Sync content

Generated docs are committed so this site builds without a RimZ source checkout. To refresh them from a local RimZ checkout:

```sh
RIMZ_SRC=../rimz node scripts/sync-content.mjs
```

The sync script writes its mapped generated pages, refreshes the README-derived overview sections in `content/docs/index.mdx`, and copies images into `public/`. The rest of the hand-written pages and all `meta.json` files are left alone.
