import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { postFetch } from "@/api/Api";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const CategoryADDModal = ({ setIsModalOpen, sellerId, fetchCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [hide, setHide] = useState(false);
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategoryData) => {
      const formData = new FormData();
      formData.append("categoryName", newCategoryData.name);
      formData.append("categoryLogo", newCategoryData.image);

      const response = await postFetch(
        `${localurl}/category/create?sellerId=${sellerId.id}`,
        formData
      );
      return response;
    },
    onSuccess: () => {
      fetchCategories();
      setIsModalOpen(false);
      setHide(false);
      toast("Category added successfully");
    },
    onError: (error) => {
      setHide(false);
      console.error("Error adding category:", error);
      toast("Error adding category");
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setImage(file);
      resizeImage(file);
    } else {
      toast("Please upload a valid image file.");
    }
  };

  const resizeImage = (file) => {
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
  };

  const handleAddCategory = (e) => {
    setHide(true);
    e.preventDefault();
    if (!newCategory.trim() || !thumbnail || !sellerId?.id) {
      toast(
        "Please provide all required fields and ensure seller ID is available."
      );
      setHide(false);
      return;
    }
    addCategoryMutation.mutate({ name: newCategory, image });
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Add Category
          </Typography>
          <p
            onClick={() => setIsModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>

        <div className="mt-6">
          <form className="flex flex-col gap-5" onSubmit={handleAddCategory}>
            <Input
              label="Category"
              name="title"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div>
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

            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              disabled={hide ? true : false}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CategoryADDModal);
