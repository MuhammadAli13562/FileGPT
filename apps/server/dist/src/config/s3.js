"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const region = process.env.AWS_BUCKET_REGION;
const secretAccessKey = process.env.AWS_BUCKET_SECRET_ACCESS_KEY;
const accessKeyId = process.env.AWS_BUCKET_ACCESS_KEY;
exports.s3 = new client_s3_1.S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
