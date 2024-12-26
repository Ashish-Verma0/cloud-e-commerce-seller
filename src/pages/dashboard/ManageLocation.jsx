import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import ManageLocationModal from "@/modal/ManageLocationModal";
import LocationUpdateModal from "@/modal/LocationUpdateModal";
import { localurl } from "../../../constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteFetchByUrl, getFetch } from "@/api/Api";
import { toast } from "react-toastify";

const ManageLocation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const queryClient = useQueryClient();

  const {
    data: locations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["locations", sellerId?.shopName, currentPage],
    queryFn: async () => {
      if (!sellerId?.shopName)
        throw new Error("Seller ID or shop name is missing.");
      const response = await getFetch(
        `${localurl}/sellerLocation/all/seller?shopName=${sellerId.shopName}&page=${currentPage}`
      );
      return response?.data?.data || [];
    },
    enabled: !!sellerId?.shopName,
    staleTime: 1000 * 60 * 5,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (locationId) => {
      await deleteFetchByUrl(
        `${localurl}/sellerLocation/delete?locationId=${locationId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["locations", sellerId.shopName]);
      toast("location deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast("Error deleting category");
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
        Swal.fire("Deleted!", "The location has been deleted.", "success");
        handleDeleteCategory(id);
      }
    });
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setIsUpdateModalOpen(true);
  };

  const { location = [], pagination = {} } = locations;
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
          Locations
        </Typography>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => toggleModal(true)}
        >
          + Add Location
        </button>
      </div>

      {/* Location Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left border border-gray-300">
            <thead>
              <tr className="bg-blue-gray-100 text-blue-gray-700">
                <th className="px-4 py-2 border-b">State</th>
                <th className="px-4 py-2 border-b">City</th>
                <th className="px-4 py-2 border-b">Area</th>
                <th className="px-4 py-2 border-b">Postal Code</th>
                <th className="px-4 py-2 border-b">Delivery Time</th>
                <th className="px-4 py-2 border-b">Delivery Rate</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {location?.map((location) => (
                <tr key={location.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{location.state}</td>
                  <td className="px-4 py-2 border-b">{location.city}</td>
                  <td className="px-4 py-2 border-b">{location.area}</td>
                  <td className="px-4 py-2 border-b">{location.pinCode}</td>
                  <td className="px-4 py-2 border-b">
                    {location.deliveryTime}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {location.deliveryPrice}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Tooltip content="Edit">
                        <IconButton
                          variant="text"
                          size="sm"
                          color="blue"
                          onClick={() => handleEdit(location)}
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <IconButton
                          variant="text"
                          size="sm"
                          color="red"
                          onClick={() => handleDelete(location.id)}
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

      {/* Pagination */}
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
            <ManageLocationModal setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      )}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <LocationUpdateModal
              setIsUpdateModalOpen={setIsUpdateModalOpen}
              selectedLocation={selectedLocation}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ManageLocation);
