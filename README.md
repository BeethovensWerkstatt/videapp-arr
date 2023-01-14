# VideApp-Arr

The VideApp for Arrangements (VideApp-Arr) is a tool developed by the
Beethovens Werkstatt project, funded by the Mainz Academy for Science and
Literature. It is the software component of the second module of the project,
as described at https://beethovens-werkstatt.de/modul-2/.

As of January 2023, the app is still built on NodeJS v14. This should be fine,
though, as the app is rendered to static sites served by an nginx:alpine Docker
image. The app itself is built on Vue2.

Since 2023-01, the remnants of data from an earlier iteration of the app are
removed from this repo. It was retrieved from a dedicated API for the second
module so far (coming from the BeethovensWerkstatt/module2 repo), but is now
pulling data from https://api.beethovens-werkstatt.de (which automatically
retrieves data from BeethovensWerkstatt/data).

For local testing, BeethovensWerkstatt/api needs to be ```gulp dist```ed and
deployed to a local eXist-db installation. Then, in this repo, the API address
to be used can be configured in _./src/store.js_. This app can be tested using
the setup described below. For actual deployment, use the _Dockerfile_ to create
your own Docker image. 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
