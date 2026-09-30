# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.1 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:typography,forms" sveltekit-adapter="adapter:netlify" --no-download-check --install npm .
```

## Developing

```sh
bun install
bun dev      # compiles SCSS, then starts the dev server
bun watch    # live-compile src/styles/main.scss (run from anywhere in the project)
```

## Building

```sh
bun run build
bun preview
```

## Decap CMS

The CMS lives at `/admin` (`src/routes/admin/`), configured in `config.json`. For local editing, run `bunx decap-server` alongside `bun dev`.
