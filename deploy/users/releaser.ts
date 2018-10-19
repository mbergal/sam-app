import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const releaserUser = new aws.iam.User(`releaser`);
