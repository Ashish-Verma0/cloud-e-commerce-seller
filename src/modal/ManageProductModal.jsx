import React, { useState, useEffect, useMemo } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localurl } from "../../constant";
import { getFetch, postFetch } from "@/api/Api";
import { toast } from "react-toastify";

const ManageProductModal = ({ setIsModalOpen }) => {
  const sellerId = useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    rating: "",
    stock: "",
    category: "",
    subcategory: "",
    desc: "",
    isProductPopular: "yes",
  });
  const [selectedImages, setSelectedImages] = useState([]);

  const [image, setImage] = useState([]);
  const queryClient = useQueryClient();

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", sellerId?.shopName],
    queryFn: async () => {
      if (!sellerId?.shopName)
        throw new Error("Seller ID or shop name is missing.");
      const response = await getFetch(
        `${localurl}/category/all?shopName=${sellerId.shopName}`
      );
      return response?.data?.data || [];
    },
    enabled: !!sellerId?.shopName,
    staleTime: 1000 * 60 * 5,
  });

  const { data: subcategoryData, isLoading: subcategoryLoading } = useQuery({
    queryKey: ["subcategories", sellerId?.shopName, formData.category],
    queryFn: async () => {
      if (!sellerId?.shopName || !formData.category) return [];
      const response = await getFetch(
        `${localurl}/subcategory/all?shopName=${sellerId?.shopName}&categoryName=${formData.category}`
      );
      return response?.data?.data || [];
    },
    enabled: !!formData.category,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: (formdata) =>
      postFetch(
        `${localurl}/product/create?shopName=${sellerId.shopName}&categoryName=${formData.category}&subcategoryName=${formData.subcategory}`,
        formdata
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["products", sellerId.shopName]);
      toast("Product Added Successfully");
      setIsModalOpen(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target || {};
    if (name) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formdata = new FormData();

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formdata.append("productimage", image[i]);
      }
    }

    Object.entries(formData).forEach(([key, value]) => {
      formdata.append(key, value);
    });

    mutation.mutate(formdata);
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Add Product
          </Typography>
          <p
            onClick={() => setIsModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>

        <div className="mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleAddProduct}>
            {/* Title */}
            <Input
              label="Enter Product Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            {/* Category */}
            <div className="relative w-full">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categoryData && categoryData.length > 0 ? (
                  categoryData.map((category) => (
                    <option
                      key={category.categoryName}
                      value={category.categoryName}
                    >
                      {category.categoryName}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>

            {/* Subcategory */}
            <div className="relative w-full">
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.category}
              >
                <option value="" disabled>
                  Select a subcategory
                </option>
                {subcategoryData && subcategoryData.length > 0 ? (
                  subcategoryData.map((subcategory) => (
                    <option
                      key={subcategory.subcategoryName}
                      value={subcategory.subcategoryName}
                    >
                      {subcategory.subcategoryName}
                    </option>
                  ))
                ) : subcategoryLoading ? (
                  <option disabled>Loading subcategories...</option>
                ) : (
                  <option disabled>No subcategories available</option>
                )}
              </select>
            </div>

            {/* Price */}
            <Input
              label="Enter Price"
              name="price"
              type="phone"
              value={formData.price}
              onChange={handleChange}
            />

            {/* Rating */}
            <Input
              label="Enter Rating"
              name="rating"
              type="phone"
              value={formData.rating}
              onChange={handleChange}
            />

            {/* Stock */}
            <Input
              label="Enter Stock Quantity"
              name="stock"
              type="phone"
              value={formData.stock}
              onChange={handleChange}
            />
            <Input
              label="Enter Product desc"
              name="desc"
              type="text"
              value={formData.desc}
              onChange={handleChange}
            />

            {/* Image Upload */}
            <Input
              id="image-upload"
              label="Upload Image"
              type="file"
              multiple
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />

            {selectedImages.length > 0 && (
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
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Loading..." : "Add Product"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ManageProductModal);
