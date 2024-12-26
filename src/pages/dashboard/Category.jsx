import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
// import Swal from "sweetalert2";
import ManageProductBulkModal from "@/modal/ManageProductBulkModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFetch, postFetch, deleteFetchByUrl } from "@/api/Api";
import { localurl } from "../../../constant";
import CategoryModalUpdate from "@/modal/CategoryModalUpdate";
import CategoryAddModal from "@/modal/CategoryAddModal";
import { toast } from "react-toastify";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const queryClient = useQueryClient();

  const {
    data: categories = [],
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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId) => {
      await deleteFetchByUrl(
        `${localurl}/category/delete?categoryId=${categoryId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", sellerId.shopName]);
      toast("Category deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast(error.response.data.message);
    },
  });

  const handleDeleteCategory = (id) => {
    if (!sellerId?.id) {
      toast("Seller ID is required to delete categories.");
      return;
    }
    deleteCategoryMutation.mutate(id);
  };

  const toggleModal = (show) => {
    setIsModalOpen(show);
  };
  const toggleUpdateModalModal = (show, selectedcategory) => {
    setIsUpdateModalOpen(show);
    setSelectedCategoryData(selectedcategory || []);
  };
  return (
    <div className="p-0 mt-7">
      <div className="flex flex-row items-center justify-between mb-6 gap-4">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-lg sm:text-xl font-bold"
        >
          Category
        </Typography>
        <div className="flex flex-row gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center font-medium text-base sm:text-base"
            onClick={() => toggleModal(true)}
          >
            + Add Category
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border border-gray-300 text-center">
            <thead>
              <tr className="bg-blue-gray-100 text-blue-gray-700">
                <th className="px-4 py-2 border-b">Image</th>
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">
                    <Avatar
                      src={`${localurl}/${product.categoryLogo.filename}`}
                      alt={product.title}
                      size="sm"
                      variant="rounded"
                      className="shadow-md"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{product.categoryName}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip content="Edit">
                        <IconButton
                          variant="text"
                          size="sm"
                          color="blue"
                          onClick={() => toggleUpdateModalModal(true, product)}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <IconButton
                          variant="text"
                          size="sm"
                          color="red"
                          onClick={() => handleDeleteCategory(product.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <CategoryAddModal
              setIsModalOpen={setIsModalOpen}
              sellerId={sellerId}
              fetchCategories={() =>
                queryClient.invalidateQueries(["categories", sellerId.shopName])
              }
            />
          </div>
        </div>
      )}
      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <ManageProductBulkModal
              setIsBulkModalOpen={setIsBulkModalOpen}
              fetchCategories={() =>
                queryClient.invalidateQueries(["categories", sellerId.shopName])
              }
            />
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <CategoryModalUpdate
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              selectedCategoryData={selectedCategoryData}
              fetchCategories={() =>
                queryClient.invalidateQueries(["categories", sellerId.shopName])
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Category);
