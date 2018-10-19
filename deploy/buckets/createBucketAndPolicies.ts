import * as aws from "@pulumi/aws";

export interface BucketResources {
  bucket: aws.s3.Bucket;
  readPolicy: aws.iam.Policy;
  writePolicy: aws.iam.Policy;
  readGroup: aws.iam.Group;
  writeGroup: aws.iam.Group;
}
export function createBucketAndPolicies(name: string): BucketResources {
  const bucket = new aws.s3.Bucket(name, { bucket: name });
  const readPolicy = new aws.iam.Policy(`${name}-read`, {
    policy: bucket.bucket.apply(readPolicyForBucket)
  });
  const writePolicy = new aws.iam.Policy(`${name}-write`, {
    policy: bucket.bucket.apply(writePolicyForBucket)
  });

  const readGroup = new aws.iam.Group(`${name}-read`);
  const readPolicyAttachment = new aws.iam.PolicyAttachment(`${name}-read`, {
    groups: [readGroup],
    policyArn: readPolicy.arn
  });
  const writeGroup = new aws.iam.Group(`${name}-write`);
  const writePolicyAttachment = new aws.iam.PolicyAttachment(`${name}-write`, {
    groups: [writeGroup],
    policyArn: writePolicy.arn
  });

  return {
    bucket,
    readPolicy,
    writePolicy,
    readGroup,
    writeGroup
  };
}

function readPolicyForBucket(bucketName: string) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:GetObject"],
        Resource: [
          `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
        ]
      }
    ]
  });
}

function writePolicyForBucket(bucketName: string) {
  return JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["s3:PutObject"],
        Resource: [
          `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
        ]
      }
    ]
  });
}
