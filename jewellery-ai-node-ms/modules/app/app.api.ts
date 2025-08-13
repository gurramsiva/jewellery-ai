import { api } from "encore.dev/api";
import S3Service from "./s3.service";
import { ProductService } from "./product.service";
import { ResponseType } from "../../utils/app.types";
// import { Product, CreateProductRequest, ProductSearchRequest } from "../../utils/product.schema";

export const HealthCheckApi = api<{}, { status: string; message: string }>(
  {
    expose: true,
    method: "GET",
    path: "/",
  },
  async () => {
    return {
      status: "success",
      message: "Jewellery AI API is running",
    };
  }
);

export const CreateDataApi = api<{ image_url: string }, ResponseType>(
  {
    expose: true,
    method: "POST",
    path: "/data",
  },
  async ({ image_url }) => {
    try {
      const data = await ProductService.getData(image_url);
      return {
        status: "success",
        data,
      };
    } catch (error: any) {
      return {
        status: "error",
      };
    }
  }
);

export const GetProductsApi = api<{}, ResponseType>(
  {
    expose: true,
    method: "GET",
    path: "/products",
  },
  async () => {
    try {
      const products = await ProductService.getProducts();
      return {
        status: "success",
        data: products,
        total: products?.length || 0,
      };
    } catch (error: any) {
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Failed to fetch products",
      };
    }
  }
);

export const GenerateUploadURLApi = api<{ fileName: string }, ResponseType>(
  {
    expose: true,
    method: "POST",
    path: "/s3/upload-url",
  },
  async ({ fileName }) => {
    try {
      const result = await S3Service.GenerateUploadURL(fileName);
      return result;
    } catch (error: any) {
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Failed to generate upload URL",
      };
    }
  }
);
