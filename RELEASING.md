# Releasing With Lerna

This repository uses `lerna` in independent mode for package versioning and publishing.

## Install

Dependencies are already wired at the root of the monorepo:

```bash
bun install
```

## Version packages

Choose package bumps interactively:

```bash
bun run release:version
```

Skip prompts when you already know you want to continue:

```bash
bun run release:version:yes
```

`lerna version` updates changed package versions, rewrites internal workspace dependency ranges, creates release commits, and tags the versions.

## Publish packages

Publish packages whose local versions are ahead of npm:

```bash
bun run release:publish
```

Non-interactive publish:

```bash
bun run release:publish:yes
```

Build, typecheck, then publish:

```bash
bun run release
```

## npm 2FA

`lerna publish` delegates publishing to the npm CLI. That means your existing npm browser-based 2FA flow should still be the one used during publish.

If npm opens a browser challenge during `publish`, complete it there and let the terminal process continue. No extra release tool is required on top of `lerna`.

## Typical flow

```bash
bun run release:version
git push --follow-tags
bun run release:publish
```
