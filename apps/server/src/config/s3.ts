import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const region = process.env.AWS_BUCKET_REGION!;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY!;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY!;

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
