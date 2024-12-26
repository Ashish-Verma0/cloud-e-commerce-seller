import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFetch, putFetch } from "@/api/Api";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const SubCategoryUpdateModal = ({ setIsUpdateModalOpen, selectedProduct }) => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [formdata, setFormData] = useState({
    category: selectedProduct?.category?.categoryName || "",
    subCategory: selectedProduct?.subcategoryName || "",
  });
  const [image, setImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(
    selectedProduct.subcategoryLogo.filename || null
  );

  const queryClient = useQueryClient();

  // const {
  //   data: categories = [],
  //   isLoading,
  //   error,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);

    if (selectedFile) {
      setSelectedImages(URL.createObjectURL(selectedFile));
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return putFetch(
        `${localurl}/subcategory/update?subcategoryId=${selectedProduct.id}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subcategory", sellerId?.shopName]);
      // fetchCategories();
      toast("Subcategory Updated Successfullly");
      setIsUpdateModalOpen(false);
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast("Error updating category:");
    },
  });

  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subcategoryName", formdata.subCategory);
    if (image) {
      formData.append("subcategoryLogo", image);
    }
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error during mutation:", error);
      toast("Error during mutation:");
    }
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Edit Sub Category
          </Typography>
          <p
            onClick={() => setIsUpdateModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>
        <div className="mt-6">
          <form
            className="flex flex-col gap-5"
            onSubmit={handleUpdateSubcategory}
          >
            {/* <div className="relative w-full">
              <select
                name="category"
                value={formdata.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
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
            </div> */}
            <Input
              label="Enter SubCategory"
              name="subCategory"
              type="text"
              value={formdata.subCategory}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="image-upload" className="cursor-pointer w-full">
                <span
                  type="button"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                >
                  Upload Image
                </span>
              </label>
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {(selectedImages || image) && (
              <div className="mb-4">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : `${localurl}/${selectedImages}`
                  }
                  alt="Thumbnail Preview"
                  className="w-24 h-24 object-cover rounded-md shadow"
                />
              </div>
            )}

            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SubCategoryUpdateModal);
