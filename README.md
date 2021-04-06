# Serverless authentication with AWS Lambda

This is the repo for a blog entry on [dev.to](https://dev.to/lauracarballo/serverless-authentication-with-aws-lambda-427m).

## Motivation

For those getting a bit curious about how authentication really works in serverless applications, I have come up with this easy tutorial that will guide you through the process.

## Technologies

- Serverless Framework
- AWS Lambda
- DynamoDB

## Setup

Clone this repo and run `npm install` to install all the dependencies.

## To run the project

`sls offline --httpPort 6000`

Runs the app in the development mode.
Open http://localhost:6000 to view it in the browser.

The page will reload if you make edits.

`sls deploy`

Deploys the functions
