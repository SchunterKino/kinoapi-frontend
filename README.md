# kinoapi-frontend

Webapp to control cinema tech:
- start/pause the projector
- control the volume
- turn on/off lights
- open/close curtain

[![Build Status](https://travis-ci.org/SchunterKino/kinoapi-frontend.svg?branch=master)](https://travis-ci.org/SchunterKino/kinoapi-frontend)

## Building

Download dependencies:
```sh
$ npm install
```

Start dev server on <http://localhost:8080/> and automatically build on save:
```sh
$ npm start
```

Build production (minified):
```sh
$ npm run build
```

Expose the running dev server on a random ngrok.io subdomain with https support:
```sh
$ npm run ngrok
```
