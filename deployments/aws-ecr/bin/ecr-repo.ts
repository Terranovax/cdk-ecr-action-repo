#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { EcrRepo } from '../lib/ecr-repo-stack';

const app = new cdk.App();

new EcrRepo(app, 'ecr-action-repo', {
    repoName: 'examples/ecr-action-repo'
});
