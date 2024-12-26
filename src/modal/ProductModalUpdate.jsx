import React, { useState, useMemo } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFetch, putFetch } from "@/api/Api";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const ProductModalUpdate = ({
  setIsEditModalOpen,
  productData,
  fetchProducts,
}) => {
  // const sellerId = useMemo(() => {
  //   const storedSellerId = localStorage.getItem("seller-id");
  //   return storedSellerId ? JSON.parse(storedSellerId) : null;
  // }, []);
  const [formData, setFormData] = useState({
    title: productData.title || "",
    // category: productData.category?.categoryName || "",
    // subcategory: productData.subCategory?.subcategoryName || "",
    price: productData.price || "",
    rating: productData.rating || "",
    stock: productData.stock || "",
    desc: productData.desc || "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState(
    productData.productimage?.filename
      ? [`${localurl}/${productData.productimage.filename}`]
      : []
  );

  const queryClient = useQueryClient();

  // Fetch categories
  // const {
  //   data: categoryData = [],
  //   isLoading: categoryLoading,
  //   error: categoryError,
  // } = useQuery({
  //   queryKey: ["categories", sellerId?.shopName],
  //   queryFn: async () => {
  //     if (!sellerId?.shopName)
  //       throw new Error("Seller ID or shop name is missing.");
  //     const response = await getFetch(
  //       `${localurl}/category/all?shopName=${sellerId.shopName}`
  //     );
  //     return response?.data?.data || [];
  //   },
  //   enabled: !!sellerId?.shopName,
  //   staleTime: 1000 * 60 * 5,
  // });

  // Fetch subcategories
  // const { data: subcategoryData = [], isLoading: subcategoryLoading } =
  //   useQuery({
  //     queryKey: ["subcategories", sellerId?.shopName, formData.category],
  //     queryFn: async () => {
  //       if (!sellerId?.shopName || !formData.category) return [];
  //       const response = await getFetch(
  //         `${localurl}/subcategory/all?shopName=${sellerId.shopName}&categoryName=${formData.category}`
  //       );
  //       return response?.data?.data || [];
  //     },
  //     enabled: !!formData.category,
  //     staleTime: 1000 * 60 * 5,
  //   });

  // Update mutation
  const mutation = useMutation({
    mutationFn: (formdata) =>
      putFetch(
        `${localurl}/product/update?productId=${productData.id}`,
        formdata
      ),
    onSuccess: () => {
      // queryClient.invalidateQueries(["products"]);
      fetchProducts();
      toast("Product Updated Successfully");
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast("Error updating product:");
    },
  });

  const handleImageChange = (e) => {
    setImage(e.target.files);
    const files = Array.from(event.target.files);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(imagePreviews);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    if (image) {
      Array.from(image).forEach((img) => formdata.append("productimage", img));
    }
    Object.entries(formData).forEach(([key, value]) =>
      formdata.append(key, value)
    );
    mutation.mutate(formdata);
  };

  return (
    <section>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Edit Product
          </Typography>
          <p
            onClick={() => setIsEditModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>

        {/* Form */}
        <div className="mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleUpdateProduct}>
            {/* Title */}
            <Input
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            {/* Category */}
            {/* <div className="relative w-full">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categoryLoading ? (
                  <option disabled>Loading categories...</option>
                ) : categoryError ? (
                  <option disabled>Error loading categories</option>
                ) : (
                  categoryData.map((category) => (
                    <option
                      key={category.categoryName}
                      value={category.categoryName}
                    >
                      {category.categoryName}
                    </option>
                  ))
                )}
              </select>
            </div> */}

            {/* Subcategory */}
            {/* <div className="relative w-full">
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={!formData.category}
              >
                <option value="" disabled>
                  Select a subcategory
                </option>
                {subcategoryLoading ? (
                  <option disabled>Loading subcategories...</option>
                ) : (
                  subcategoryData.map((subcategory) => (
                    <option
                      key={subcategory.subcategoryName}
                      value={subcategory.subcategoryName}
                    >
                      {subcategory.subcategoryName}
                    </option>
                  ))
                )}
              </select>
            </div> */}

            {/* Price */}
            <Input
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />

            {/* Rating */}
            <Input
              label="Rating"
              name="rating"
              type="number"
              value={formData.rating}
              onChange={handleChange}
              required
            />

            {/* Stock */}
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              required
            />

            {/* Description */}
            <Input
              label="Description"
              name="desc"
              type="text"
              value={formData.desc}
              onChange={handleChange}
              required
            />

            {/* Image Upload */}
            <Input
              label="Upload Image"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />

            {selectedImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {selectedImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Selected ${index + 1}`}
                    className="max-w-full h-auto rounded border"
                  />
                ))}
              </div>
            ) : (
              productData.productimage.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {productData?.productimage[0]?.filename.startsWith("https")
                    ? productData.productimage.map((image, index) => (
                        <img
                          key={index}
                          src={`${image.filename}`}
                          alt={`Selected ${index + 1}`}
                          className="max-w-full h-auto rounded border"
                        />
                      ))
                    : productData.productimage.map((image, index) => (
                        <img
                          key={index}
                          src={`${localurl}/${image.filename}`}
                          alt={`Selected ${index + 1}`}
                          className="max-w-full h-auto rounded border"
                        />
                      ))}
                </div>
              )
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductModalUpdate);
