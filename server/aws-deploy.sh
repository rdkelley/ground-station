#!/usr/bin/env bash
set -euo pipefail

source .env

TAG=$(node -p "require('./package.json').version")
REGION=us-west-1
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGISTRY=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com
REPO=$REGISTRY/telemetry-server

aws ecr get-login-password --region $REGION \
    | docker login --username AWS --password-stdin $REGISTRY
docker build --platform linux/amd64 -t $REPO:$TAG .
docker push $REPO:$TAG

aws ecs update-express-gateway-service \
  --region $REGION \
  --service-arn $SERVICE_ARN \
  --primary-container '{"image": "'$REPO:$TAG'", "containerPort": 3000}'