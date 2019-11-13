import cdk = require('@aws-cdk/core');
import * as ecr from '@aws-cdk/aws-ecr';
import { TagStatus } from '@aws-cdk/aws-ecr';
import { IGrantable } from '@aws-cdk/aws-iam';

export interface EcrRepoProps extends cdk.StackProps {
  /**
   * Allowed tag prefixes for ECR images that should be retained.
   * By default, tags with 'v' (ex. v1.0.0) will be kept.
   *
   * @default - [ 'v' ]
   */
  tagPrefixes?: string[]
  /**
   * The container repository name
   */
  repoName?: string
  /**
   * Should the repo be retained after stack deletion?
   *
   * @default false
   */
  retain?: boolean;
  /**
   * Allowed accessors for pulling from the ECR repo
   *
   * @default - No additional access
   */
  allowedPull?: IGrantable[]
  /**
   * Allowed accessors for pushing/pulling to the ECR repo
   *
   * @default - No additional access
   */
  allowedPullPush?: IGrantable[];
  /**
   * The maximum number of allowed images to keep with tags
   *
   * @default 5
   */
  maxTaggedImages?: number;
  /**
   * The maximum number of allowed images to keep with no image tags
   *
   * @default 1
   */
  maxUntaggedImages?: number;
}

export class EcrRepo extends cdk.Stack {
  /**
   * The Amazon Resource Name for this ECR repository
   */
  readonly repoArn: string;
  /**
   * The ECR repository name
   */
  readonly repoName: string;

  constructor(scope: cdk.Construct, id: string, props: EcrRepoProps = { tagPrefixes: [ 'v' ] }) {
    super(scope, id, props);

    const repo = new ecr.Repository(this, `${id}-repo`, {
      repositoryName: props.repoName,
      removalPolicy: props.retain ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          maxImageCount: props.maxTaggedImages || 5,
          rulePriority: 2,
          tagPrefixList: props.tagPrefixes,
        },
        {
          maxImageCount: props.maxUntaggedImages || 1,
          rulePriority: 1,
          tagStatus: TagStatus.UNTAGGED
        },
      ],
    });

    // Assign Pull permissions
    for(const grantee of props.allowedPull || []) {
      repo.grantPull(grantee);
    }

    // Assign Pull/Push permissions
    for(const grantee of props.allowedPullPush || []) {
      repo.grantPull(grantee);
    }

    this.repoArn = repo.repositoryArn;
    this.repoName = repo.repositoryName;
  }
}
