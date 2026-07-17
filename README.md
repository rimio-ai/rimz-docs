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

[The sync workflow](./.github/workflows/sync.yml) imports the mutable `main` documentation and creates immutable snapshots for every `v*` release tag after a README or docs update, when a release is published, and once per day as a backstop. A successful sync commits the generated files to `main` and invokes the deploy workflow directly.

The published routes keep the latest stable release at `/docs`, expose exact releases under `/docs/vVERSION`, and expose unreleased documentation under `/docs/main`. Keep the `github.com/rimio-ai/rimz` mirror and its release tags current with the primary Gitea remote so the published site stays current; dispatches fire only for GitHub pushes, and the scheduled sync also reads GitHub.

## Sync content

Generated docs are committed so this site builds without a RimZ source checkout. To refresh them from a local RimZ checkout:

```sh
RIMZ_SRC=../rimz pnpm sync
```

The sync scripts refresh `main`, discover semantic `v*` tags, create missing release snapshots, and copy each version's images into its own asset directory. Existing release snapshots stay unchanged. Hand-written scaffolding under `content/template/` seeds `main` and each newly created release.

Run `pnpm check:versions` to verify snapshot completeness, version-scoped links and images, release source refs, and the catalog.
