#!/usr/bin/env bash
set -euo pipefail

source .env.local

REGION=us-west-1
BRANCH=main

npm run build

cd dist
zip -r ../dist.zip .
cd ..

read -r JOB_ID UPLOAD_URL <<< "$(aws amplify create-deployment \
    --region $REGION \
    --app-id $AMPLIFY_APP_ID \
    --branch-name $BRANCH \
    --query '[jobId, zipUploadUrl]' \
    --output text)"

curl --fail -H "Content-Type: application/zip" -T dist.zip "$UPLOAD_URL"

aws amplify start-deployment \
    --region $REGION \
    --app-id $AMPLIFY_APP_ID \
    --branch-name $BRANCH \
    --job-id $JOB_ID

rm dist.zip