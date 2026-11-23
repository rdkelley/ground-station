## API

`/telemetry?sort=altitude&order=asc&page=1&status=critical&satId=SAT-59`



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
