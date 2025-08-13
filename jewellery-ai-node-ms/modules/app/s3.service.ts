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

  // static async UploadFileToS3(url: string, file: any, mimeType: string): Promise<ResponseType> {
  //   try {
  //     console.log(`Uploading file to S3 URL`, {
  //       userId: "default",
  //       mimeType,
  //       urlLength: url.length,
  //     });

  //     const response = await fetch(url, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": mimeType,
  //       },
  //       body: file,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to upload file. Status: ${response.status}`);
  //     }

  //     const downloadUrl = url.split("?")[0];

  //     return {
  //       status: "success",
  //       data: {
  //         download: downloadUrl,
  //         uploadStatus: response.status,
  //         uploadStatusText: response.statusText,
  //       },
  //     };
  //   } catch (error: any) {
  //     console.error(`Error uploading file to S3:`, error);
  //     return {
  //       status: "error",
  //       error: error.message || "Failed to upload file to S3",
  //     };
  //   }
  // }

  // /**
  //  * Generate download URL for existing S3 object
  //  */
  // static async GenerateDownloadURL(key: string, expiresIn: number = 300): Promise<ResponseType> {
  //   try {
  //     const s3 = S3Service.GetS3Instance();
  //     const params = {
  //       Bucket: AWS_S3_BUCKET_NAME,
  //       Key: `${AWS_S3_DIR}/${key}`,
  //       Expires: expiresIn,
  //     };

  //     const downloadUrl = await s3.getSignedUrlPromise("getObject", params);

  //     return {
  //       status: "success",
  //       data: {
  //         download: downloadUrl,
  //         key: params.Key,
  //         bucket: params.Bucket,
  //         expires: params.Expires,
  //       },
  //     };
  //   } catch (error: any) {
  //     console.error(`Error generating download URL for key ${key}:`, error);
  //     return {
  //       status: "error",
  //       error: error.message || "Failed to generate download URL",
  //     };
  //   }
  // }
}
