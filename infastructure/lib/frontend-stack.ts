import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'

interface FrontendStackProps extends cdk.StackProps {
  bucketName: string
  cloudfrontId: string
  repoName: string
}

export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props)

    const githubRole = new iam.Role(this, 'roleGithub', {
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${props.env?.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.repoName}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description: 'Role assumed by GitHub Actions to deploy frontend',
    })

    githubRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListBucket'],
        resources: [`arn:aws:s3:::${props.bucketName}`],
      }),
    )

    githubRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:DeleteObject', 's3:GetObject', 's3:PutObject'],
        resources: [
          `arn:aws:s3:::${props.bucketName}/projects/game/*`,
          `arn:aws:s3:::${props.bucketName}/projects/xmas/*`,
        ],
      }),
    )

    githubRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${props.env?.account}:distribution/${props.cloudfrontId}`,
        ],
      }),
    )
  }
}
