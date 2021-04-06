# React authentication with AWS Lambda

This is the repo for a blog entry on [dev.to]().

## Motivation

For those getting a bit curious about how authentication really works in serverless applications, I have come up with this easy tutorial that will guide you through the process.

## Technologies

- AWS serverless
- DynamoDB

## Setup

Clone this repo `git clone https://github.com/lauracarballo/authentication` to your desktop and run `npm install` to install all the dependencies.

## To run the project

`sls offline --httpPort 6000`

Runs the app in the development mode.
Open http://localhost:6000 to view it in the browser.

The page will reload if you make edits.

`sls deploy`

Deploys the functions
