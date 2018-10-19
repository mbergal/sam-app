import * as aws from "@pulumi/aws";
import * as serverless from "@pulumi/aws-serverless";

const aa = require("../../swagger.json");

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

export const role = new aws.iam.Role("precompiled-lambda-role", {
  assumeRolePolicy: JSON.stringify(policy)
});

export const lambda = new aws.lambda.Function("misha-helloworld", {
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

export const api = new serverless.apigateway.API("misha-helloworld", {
  swaggerSpec: lambda.arn.apply(arn => JSON.stringify(swaggerRouteHandler(arn)))
});
