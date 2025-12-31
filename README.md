typescript next.js starter kit for leaflet-react
===============

An extensible [next.js](https://nextjs.org/) starter kit for the [leaflet-react](https://react-leaflet.js.org/) map plugin. Template visually enhanced by [tailwind](https://tailwindcss.com/) and [lucide icons](https://lucide.dev/). ✨
Setup with [typescript](https://www.typescriptlang.org/) 👐.

Packed with useful components and hooks for using the map and create UI elements for your next(.js) big mapping project.

Wanna instead use the crazy fast Maplibre GL JS?: Here's my [maplibre next.js ts starter kit](https://github.com/richard-unterberg/maplibre-nextjs-ts-starter)

### Table of Contents
1. [Features](#features)
2. [Getting started](#getting-started)
    1. [Clone & Deploy with Github and Vercel](#clone-deploy)
    2. [Manual install](#manual-install)
3. [Start up](#start-up)
4. [Coming up (probably)](#coming-up)
5. [Dependencies](#dependencies)
6. [Removing linting rules](#disable-lint)
7. [No typescript?](#no-ts)

### <a id="features"></a> 🎇 Features

- 🏇 mighty next.js 13 leaflet-react no-ssr setup
- 😏 typescript + strict lint setup
- 🔗 next.js ready route nav module
- 🌤 modular demo content
- 🐛 custom marker icons
- 📚 marker categories
- 🫧 marker cluster by category with matching icon+color and notification bubble with marker count
- ⚓️ custom hooks for getting marker data and map context (thx [Flo301](https://github.com/Flo301))
- 🏡 custom ui components (locate me, center on markers)

### <a id="getting-started"></a> 🏎 Getting Started

#### <a id="clone-deploy"></a> ⛴ Clone & Deploy with Github and Vercel

Create new Github repo with vercel and deploy it within minutes. Could not be easier as hitting some buttons. Shipping of private repos is possible.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frichard-unterberg%2Fnext-leaflet-starter-typescript)

Later: Check out your repo locally and run ```npm install``` or ```yarn``` in root

Follow Instructions for [Starting Up](#start-up)

#### <a id="manual-install"></a> ⚙️ Manual install

```bash
git clone https://github.com/richard-unterberg/next-leaflet-starter-typescript
# then
npm install
# or
yarn
```

#### 🔑 Environment Setup

After installation, you need to configure your environment variables:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys:
   - **NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY**: Required for address search autocomplete
     - Get your key from [Google Cloud Console](https://console.cloud.google.com/)
     - Enable the following APIs:
       - Maps JavaScript API
       - Places API
   - **NEXT_PUBLIC_GEOCODING_API_KEY**: For geocoding features
     - Get your key from [OpenCage](https://opencagedata.com/api) or your preferred geocoding service
   - **NEXT_PUBLIC_PASSWORD**: Set a password for application access control

3. Save the `.env` file

**Note**: Never commit your `.env` file to version control. It contains sensitive API keys.

### <a id="start-up"></a> 🏍️ Start up

According the official [Next.js Docs](https://nextjs.org/docs/getting-started):

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Building with type checking and linting

```bash
npm run build
# or
yarn build
```

Start build locally

```bash
npm run start
# or
yarn start
```

### <a id="coming-up"></a> 📊 Upcoming (probably)

+ redesign zoom in / zoom out
+ atom components for map ui
+ fix error when setting new coordinates in hot reload "Map container is already initialized."
+ breakpoint hook synced with tailwind breakpoint which is usable in js
+ multiple map instances per page
  + not possible atm since we read the map instance directly from window object 🤫
+ add axios for fetching data
  + move simulated "endpoint" (Places) to public folder and convert to JSON

- **Feel free to contribute!** 🤗

### <a id="dependencies"></a> 📦 All them dependencies

```json
"next": "^13.2.3",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-leaflet": "^4.2.1",
"@react-leaflet/core": "^2.1.0",
"leaflet": "^1.9.3",
"leaflet.markercluster": "^1.5.3",
"react-resize-detector": "^8.0.4",
"tailwindcss": "^3.2.6"
"lucide-react": "^0.121.0",
```

See ```package.json``` for more details and devDependencies.

### <a id="disable-lint"></a> 🤯 How to remove those  linting rules?

You can adjust the settings mainly in ```eslint.json``` and ```tsconfig.json```.

I've been using them a lot on my dayjob so I can't be anymore without them.

### <a id="no-ts"></a> 📝 Don't wanna use typscript at all?

See this nice javascript implementation - This repo is heavily inspired by this one:
https://github.com/colbyfayock/next-leaflet-starter


Happy coding! ✌️👽
