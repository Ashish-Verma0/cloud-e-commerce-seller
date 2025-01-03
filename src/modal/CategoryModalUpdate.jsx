import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localurl } from "../../constant";

import { putFetch } from "@/api/Api";
import { toast } from "react-toastify";

const CategoryModelUpdate = React.memo(
  ({ setIsUpdateModalOpen, selectedCategoryData, fetchCategories }) => {
    const [hide, setHide] = useState(false);
    const [categoryName, setCategoryName] = useState(
      selectedCategoryData.categoryName || ""
    );
    const [image, setImage] = useState(null);
    const [thumbnail, setThumbnail] = useState(
      selectedCategoryData.categoryLogo
        ? `${localurl}/${selectedCategoryData.categoryLogo.filename}`
        : ""
    );

    const queryClient = useQueryClient();

    useEffect(() => {
      setCategoryName(selectedCategoryData.categoryName || "");
      setThumbnail(
        selectedCategoryData.categoryLogo
          ? `${localurl}/${selectedCategoryData.categoryLogo.filename}`
          : ""
      );
    }, [selectedCategoryData]);

    const handleImageChange = useCallback((e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        resizeImage(file);
      }
    }, []);

    const resizeImage = useCallback((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);
          setThumbnail(canvas.toDataURL("image/png"));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }, []);

    const mutation = useMutation({
      mutationFn: async (formData) => {
        return putFetch(
          `${localurl}/category/update?categoryId=${selectedCategoryData.id}`,
          formData
        );
      },
      onSuccess: () => {
        toast("Category Updated Successfully");
        fetchCategories();
        setIsUpdateModalOpen(false);
        setHide(false);
      },
      onError: (error) => {
        console.error("Error updating category:", error);
        toast("Error updating category");
        setHide(false);
      },
    });

    const handleUpdateCategory = async (e) => {
      setHide(true);
      e.preventDefault();
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      if (image) {
        formData.append("categoryLogo", image);
      }
      try {
        await mutation.mutateAsync(formData);
      } catch (error) {
        setHide(false);
        console.error("Error during mutation:", error);
        toast("Error during mutation:");
      }
    };

    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Update Category
          </Typography>
          <p
            onClick={() => setIsUpdateModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>

        <form onSubmit={handleUpdateCategory}>
          <div className="mb-4">
            <Input
              label="Category Name"
              name="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className="cursor-pointer w-full inline-block"
            >
              <span className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block text-center">
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

          {thumbnail && (
            <div className="mb-4">
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
                className="w-24 h-24 object-cover rounded-md shadow"
              />
            </div>
          )}

          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
              disabled={hide ? true : false}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    );
  }
);

export default CategoryModelUpdate;
