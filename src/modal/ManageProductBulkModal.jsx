import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { postFetch } from "@/api/Api";
import { localurl } from "../../constant";

const ManageProductBulkModal = ({ setIsBulkModalOpen }) => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await postFetch(
        `${localurl}/product/bulk/create?shopName=${sellerId.shopName}`,
        formData
      );
      if (res?.response?.status === 409) {
        const errorMessage =
          res?.response?.data?.message || "Conflict error occurred";
        throw new Error(errorMessage);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products", sellerId?.shopName]);
      toast.success("Bulk Uploaded Successfully");
      setIsBulkModalOpen(false);
    },
    onError: (error) => {
      console.error("Error on adding location:", error);
      toast.error(error.message || "Error on adding Bulk File");
    },
  });

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        ![
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(selectedFile.type)
      ) {
        toast.error("Only Excel files are allowed!");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must not exceed 10MB!");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast.error("Please upload a file");
      return;
    }
    const formData = new FormData();
    formData.append("excel", file);
    mutation.mutate(formData);
  };

  return (
    <div className="inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <button
          onClick={() => setIsBulkModalOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ❌
        </button>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center text-gray-800">
            Upload Bulk Products
          </h2>
          <p className="text-sm text-center text-gray-500">
            Upload an Excel file (max size: 10MB)
          </p>
        </div>

        <div className="flex flex-col items-center">
          <label
            htmlFor="file-upload"
            className="w-40 h-40 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 16.5V19a2.5 2.5 0 002.5 2.5h13A2.5 2.5 0 0021 19v-2.5M16.5 10.5l-4.5 4.5m0 0l-4.5-4.5m4.5 4.5V3"
              />
            </svg>
            <span className="text-sm text-blue-500 mt-2">Upload File</span>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected File: {file.name}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ManageProductBulkModal);
