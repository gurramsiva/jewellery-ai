export interface Product {
  _id: string;
  title: string;
  category: string;
  summary: string;
  image_url: string;
  price?: number;
  accuracy?: string;
}
