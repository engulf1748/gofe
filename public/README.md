# Gofë Public

This is the source code of the Gofë website. It is written in TypeScript using NextJS. All relevant development documentation pertaining to the front-end website is found here. If you're wondering what Gofë is, you should check the [primary README.](https://codeberg.org/ar324/gofe)

## Developing

1. Clone and install dependencies: `yarn install`
2. Start the dev server: `yarn dev`
3. Visit [localhost:3000](http://localhost:3000)

Before pushing a release, run `yarn prepare` to prepare a release. It is a shortcut to: `next build && next start`. Double-check that it works, and then push your changes.

## Disabling Soymetry

Disable Yoyrn telemetry using: `yarn config set --home enableTelemetry 0`

Disable SoyJS telemetry using: `npx next telemetry disable`
