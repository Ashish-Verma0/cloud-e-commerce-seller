import React, { useMemo, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import ManageProductBulkModal from "@/modal/ManageProductBulkModal";
import SubCategoryAddModal from "@/modal/SubCategoryAddModal";
import SubCategoryUpdateModal from "@/modal/SubCategoryUpdateModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFetchByUrl, getFetch } from "@/api/Api";
import { localurl } from "../../../constant";
import { toast } from "react-toastify";

const Subcategory = () => {
  const sellerId = useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: subcategories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subcategories", sellerId?.shopName, currentPage],
    queryFn: async () => {
      if (!sellerId?.shopName)
        throw new Error("Seller ID or shop name is missing.");
      const response = await getFetch(
        `${localurl}/subcategory/all/seller?shopName=${sellerId.shopName}&page=${currentPage}`
      );

      return response?.data?.data || [];
    },
    enabled: !!sellerId?.shopName,
    staleTime: 1000 * 60 * 5,

    onError: (error) => {
      console.log("Error fetching subcategories:", error),
        toast("Error fetching subcategories:");
    },
  });

  const deleteSubcategory = useMutation({
    mutationFn: async (id) => {
      console.log("id", id);
      await deleteFetchByUrl(
        `${localurl}/subcategory/delete?subcategoryId=${id}`
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["subcategory", sellerId?.shopName]);
      // Swal.fire("Deleted!", "Your subcategory has been deleted.", "success");
      toast("Your subcategory has been deleted");
    },
    onError: (error) => {
      // Swal.fire("Error!", "Failed to delete subcategory.", "error");
      toast("Error deleting subcategories:");
      console.log("Error deleting subcategories:", error);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSubcategory.mutate(id);
      }
    });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };
  const { subcategory = [], pagination = {} } = subcategories;
  const { totalPages } = pagination;

  return (
    <div className="p-0 mt-7">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-6 gap-4">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-lg sm:text-xl font-bold"
        >
          Sub Category
        </Typography>
        <div className="flex flex-row gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center font-medium text-base sm:text-base"
            onClick={() => setIsModalOpen(true)}
          >
            + Add SubCategory
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Typography variant="h6">Loading subcategories...</Typography>
        </div>
      )}

      {/* Error Handling */}
      {isError && (
        <div className="flex justify-center items-center py-8">
          <Typography variant="h6" color="red">
            Failed to load subcategories. Please try again.
          </Typography>
        </div>
      )}

      {/* Product Table */}
      {!isLoading && !isError && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left border border-gray-300">
              <thead>
                <tr className="bg-blue-gray-100 text-blue-gray-700">
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Category</th>
                  <th className="px-4 py-2 border-b">Sub Category</th>
                  <th className="px-4 py-2 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subcategory?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">
                      <Avatar
                        src={`${localurl}/${product.subcategoryLogo.filename}`}
                        alt={product.subcategoryName}
                        size="sm"
                        variant="rounded"
                        className="shadow-md"
                      />
                    </td>
                    <td className="px-4 py-2 border-b">
                      {product.subcategoryName}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {product.category.categoryName}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip content="Edit">
                          <IconButton
                            variant="text"
                            size="sm"
                            color="blue"
                            onClick={() => handleEdit(product)}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete">
                          <IconButton
                            variant="text"
                            size="sm"
                            color="red"
                            onClick={() => handleDelete(product.id)}
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
      )}

      <div className="flex justify-center items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          variant="text"
          className="px-4"
        >
          Previous
        </Button>
        <Typography variant="small" className="px-4">
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          variant="text"
          className="px-4"
        >
          Next
        </Button>
      </div>

      {/* Modals */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <SubCategoryAddModal setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      )}

      {isBulkModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <ManageProductBulkModal setIsBulkModalOpen={setIsBulkModalOpen} />
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <SubCategoryUpdateModal
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              selectedProduct={selectedProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Subcategory);
