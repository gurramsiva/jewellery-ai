"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { getProductList, uploadFile } from "./common/products.service";
import { Product } from "./common/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProductList();
      setProducts(res);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    console.log("selectedImage", selectedImage);
    if (!selectedImage) return alert("Please select an image");
    setIsUploading(true);
    try {
      const fileUploadUrl = await uploadFile(selectedImage);
      console.log("Uploaded file URL:", fileUploadUrl);
      setSelectedImage(null);
      setImagePreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchProducts();
      console.log(fileUploadUrl);
      if (fileUploadUrl == "error") {
        return alert("please try with other images");
      } else {
        alert("Product uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Upload Section */}
      <div className="w-full">
        {/* <h1 className="text-3xl font-bold mb-6 text-center">
          Upload New Product
        </h1> */}
        <div className="bg-default-50 rounded-lg p-8 border border-default-200 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4 w-full">
              {/* <label className="text-lg font-medium">Product Image</label> */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <Button variant="bordered" onPress={() => fileInputRef.current?.click()} className="h-12 w-48" size="lg">
                {selectedImage ? "Change Image" : "Select Image"}
              </Button>
            </div>

            {imagePreview && (
              <div className="border-2 border-dashed border-default-300 rounded-lg p-4 w-full max-w-md">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              </div>
            )}

            <Button color="primary" size="lg" onPress={handleUpload} isLoading={isUploading} className="w-48 h-12">
              {isUploading ? "Uploading..." : "Upload Product"}
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Products ({products.length})</h2>
        {products.length === 0 ? (
          <div className="bg-default-50 rounded-lg p-8 border border-default-200 max-w-2xl mx-auto">
            <div className="text-center">
              <p className="text-default-500">No products uploaded yet. Upload your first product above!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-default-50 rounded-lg border border-default-200 overflow-hidden">
                <div className="p-4 pb-2">
                  <div className="flex justify-between items-start w-full mb-2">
                    <h4 className="font-bold text-large truncate flex-1">{product.title}</h4>
                    {product.accuracy && (
                      <span className="bg-success-100 text-success-800 px-2 py-1 rounded-full text-sm font-medium">
                        {product.accuracy}%
                      </span>
                    )}
                  </div>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                <div className="px-4 py-2">
                  <img alt={product.title} className="object-cover rounded-xl w-full h-48" src={product.image_url} />
                </div>
                <div className="p-4 pt-2">
                  <p className="text-small text-default-500 line-clamp-3">{product.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
