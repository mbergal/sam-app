import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as buildBucket from "../buckets/builds";

export const releaserUser = new aws.iam.User(`releaser`);
