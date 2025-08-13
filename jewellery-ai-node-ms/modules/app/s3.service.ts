import AWS from "aws-sdk";
import { ResponseType } from "../../utils/app.types";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_S3_DIR,
  AWS_SECRET_ACCESS_KEY,
} from "../../utils/app.config";

export default class S3Service {
  private static s3: AWS.S3;

  private static GetS3Instance(): AWS.S3 {
    if (!this.s3) {
      this.s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: AWS_REGION,
        signatureVersion: "v4",
      });
    }
    return this.s3;
  }

  static async GenerateUploadURL(key: string): Promise<ResponseType> {
    try {
      const s3 = S3Service.GetS3Instance();
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: `${AWS_S3_DIR}/${key}`,
        Expires: 300,
      };

      const upload = await s3.getSignedUrlPromise("putObject", params);
      const download = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

      return {
        status: "success",
        data: {
          upload,
          download,
          key: params.Key,
          bucket: params.Bucket,
          expires: params.Expires,
        },
      };
    } catch (error: any) {
      console.log(`Error generating upload URL for key ${key}:`, error);
      return {
        status: "error",
        error: error.message || "Failed to generate upload URL",
      };
    }
  }
}
