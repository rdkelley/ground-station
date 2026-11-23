# Ground Station

This application consists of a backend that serves satellite telemetry data and a frontend that displays data in a (hopefully visually appealing) UI.

Some notes on its implementation:

- The frontend is built with Vue (TypeScript), using Pinia for state management
- The backend is built with Express and TypeScript
- The backend connects to an in-memory SQLite database that is repopulated on server restart
- The DB is populated on server start with 250 mock examples

## Quick Start

**The application is deployed at <https://main.d1picqe4uvgggp.amplifyapp.com>**

To run locally in a dev environment, you will need Node.js 26 (eariler versions my still work, but at least greater than 22.13.0 for `node:sqlite`)

```
# Start server
cd server
npm install
npm run dev

# Start GUI
../gui
npm install
npm run dev
```

## API Endpoints

Base URL: `https://te-32bbfbf123304ae0a8da76fae7c4727f.ecs.us-west-1.on.aws`

**GET /telemetry** -- returns a page of telemetry data. All query parameters are optional:

- `page` -- page number, starting at 1
- `satId` -- partial match on satellite ID
- `status` -- `healthy`, `warning` or `critical`
- `sort` -- column to sort by
- `order` -- `asc` or `desc`

Ex: [`/telemetry?sort=altitude&order=asc&page=1&status=critical`](https://te-32bbfbf123304ae0a8da76fae7c4727f.ecs.us-west-1.on.aws/telemetry?sort=altitude&order=asc&page=1&status=critical)

**GET /telemetry/:satid** -- returns the telemetry entry for one satellite, or 404 if it doesn't exist.  
Ex: [`/telemetry/SAT-15`](https://te-32bbfbf123304ae0a8da76fae7c4727f.ecs.us-west-1.on.aws/telemetry/SAT-15)

**POST /telemetry** -- adds a satellite. Requires `satelliteId`, `timestamp` (ISO 8601), `altitude`, `velocity` and `status`.

**DELETE /telemetry/:satid** -- deletes a satellite, or returns 404 if it doesn't exist.

## Testing

Both server and GUI have automated tests.

To test server endpoints:

```
cd server
npm test
```

To run unit tests for GUI data retreival:

```
cd gui
npm run test:unit
```

## Deployment

Both server and GUI are already deployed -- these deploy scripts are included for reference.

### Server

The server is deployed at <https://te-32bbfbf123304ae0a8da76fae7c4727f.ecs.us-west-1.on.aws/telemetry>.

The server runs as a container on ECS (Fargate). The deploy script builds the
image for `linux/amd64`, pushes it to ECR, and updates the ECS service to run it. To run (assuming access to the host AWS account):

Create a `.env` file in `/server`:

```
SERVICE_ARN=<ECS service ARN>
REGION=<region the ECS service is deployed in>
```

Then increase the version and deploy:

```
cd server
npm version patch
./aws-deploy.sh
```

### GUI

The GUI is deployed at <https://main.d1picqe4uvgggp.amplifyapp.com>.

A script to deploy to an already configured Amplify instance is provided. To run:

Create a `.env.production` file in `/gui`:

```
VITE_API_URL=<production API address>
```

Then:

```
cd gui
./deploy/amplify.sh
```
