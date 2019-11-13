import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import EcrDeploy = require('../lib/ecr-repo-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EcrDeploy.EcrRepo(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
