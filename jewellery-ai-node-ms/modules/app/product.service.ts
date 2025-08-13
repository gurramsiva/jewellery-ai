import { Http } from "dff-util";
import { connectToDatabase, getDatabase } from "../../utils/databse";
import { Product } from "./product.schema";

export class ProductService {
  static async ProductSchema() {
    const db = await getDatabase();
    const collection = db?.collection<Product>("products");
    return collection;
  }

  static async getProducts() {
    const schema = await ProductService.ProductSchema();
    return await schema?.find().toArray();
  }

  static async getData(image_url: string) {
    const imageAnalysis = await Http.Get(
      "http://localhost:8000/data",
      {
        image_url,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    imageAnalysis.image_url = image_url;
    if (imageAnalysis.accuracy > 50) {
      imageAnalysis.title = imageAnalysis.title.toUpperCase();
      const product = await ProductService.saveService(imageAnalysis);
      return product;
    } else {
      throw new Error("Image analysis accuracy is too low");
    }

    // return imageAnalysis;
  }
  static async saveService(item: any) {
    item._id = item._id || crypto.randomUUID();
    item.title = item.title.toUpperCase();
    const schema = await ProductService.ProductSchema();
    await schema?.updateOne({ _id: item._id as any }, { $set: item }, { upsert: true });
    return item;
  }
}
