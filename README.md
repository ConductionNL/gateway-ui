# Gateway User Interface documentation

## Installation

Make sure to configure the location of the Common-Gateway you are working with in `/pwa/static/env.js` before running the frontend.

Requirements:
npm or docker desktop.

With npm:
- `npm i`

If getting errors about node-gyp or about missing visual studio build tools. Try to install Visual Studio C++ Build Tools from atleast 2017.

Then try to run the project with:
- `npm run develop`

With docker:
- `docker-compose up --build`

## Work instructions

1. [User management](/documentation/work-instructions/user-management.md)
