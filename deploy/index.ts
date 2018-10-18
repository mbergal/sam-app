import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as serverless from "@pulumi/aws-serverless";
const aa = require("./swagger.json");

function createBucketAndPolicies(name: string) {
  const bucket = new aws.s3.Bucket(name, { bucket: name });
  const bucketReadPolicy = new aws.iam.Policy(`${name}-read`, {
    policy: bucket.bucket.apply(readPolicyForBucket)
  });
  const bucketWritePolicy = new aws.iam.Policy(`${name}-write`, {
    policy: bucket.bucket.apply(writePolicyForBucket)
  });

  const readGroup = new aws.iam.Group(`${name}-read`);
  const readPolicyAttachment = new aws.iam.PolicyAttachment(`${name}-read`, {
    groups: [readGroup],
    policyArn: bucketReadPolicy.arn
  });
  const writeGroup = new aws.iam.Group(`${name}-write`);
  const writePolicyAttachment = new aws.iam.PolicyAttachment(`${name}-write`, {
    groups: [writeGroup],
    policyArn: bucketWritePolicy.arn
  });

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
}

createBucketAndPolicies("builds.dev.mbergal.com");

const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Action: "sts:AssumeRole",
      Principal: {
        Service: "lambda.amazonaws.com"
      },
      Effect: "Allow",
      Sid: ""
    }
  ]
};
const role = new aws.iam.Role("precompiled-lambda-role", {
  assumeRolePolicy: JSON.stringify(policy)
});

const csharpLambda = new aws.lambda.Function("misha-helloworld", {
  name: "misha-helloworld",
  runtime: aws.lambda.DotnetCore2d0Runtime,
  s3Bucket: "builds.dev.mbergal.com",
  s3Key: "HelloWorld.zip",
  timeout: 5,
  handler: "HelloWorld::HelloWorld.Function::FunctionHandler",
  role: role.arn
});

function swaggerRouteHandler(lambdaArn: string) {
  let region = aws.config.requireRegion();
  aa.paths["/hello"]["get"]["x-amazon-apigateway-integration"][
    "uri"
  ] = `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`;
  console.log(JSON.stringify(aa));

  return aa;
}
const precompiledApi = new serverless.apigateway.API("misha-helloworld", {
  swaggerSpec: csharpLambda.arn.apply(arn =>
    JSON.stringify(swaggerRouteHandler(arn))
  )
});
