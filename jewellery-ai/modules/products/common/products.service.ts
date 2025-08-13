import { Http } from "dff-util";
import { Product } from "./types";
import { signal } from "@preact/signals-react";

export const SelectedProduct = signal({} as Product);

export const ProductList = signal<Product[]>([]);

export const headers = () => {
  return {
    ["Content-Type"]: "application/json",
  };
};

export const uploadFile = async (file: File) => {
  const resp = await Http.Post(
    "http://localhost:4000/s3/upload-url",
    {
      fileName: file.name,
    },
    ""
  );
  const uploadUrl = resp.data.upload;
  console.log(uploadUrl);
  await Http.CloudUpload(uploadUrl, file);
  const analyse = await sendDataToAnalysis(resp.data.download);
  if (analyse.status == "error") {
    return analyse.status;
  }
  return {
    url: resp.data.download,
    filename: file.name,
    mimetype: file.type,
  };
};

export const sendDataToAnalysis = async (url: string) => {
  const res = await Http.Post(
    "http://localhost:4000/data",
    {
      image_url: url,
    },
    ""
  );
  return res;
};

export const getProductList = async () => {
  const res = await Http.Get("http://localhost:4000/products", null, headers());
  // ProductList.value = await res.data;
  return res.data;
};
