import React, { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
} from "@material-tailwind/react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ManageProductModal from "../../modal/ManageProductModal";
import ManageProductBulkModal from "@/modal/ManageProductBulkModal";
import { deleteFetchByUrl, getFetch } from "@/api/Api";
import { localurl } from "../../../constant";
import ProductModalUpdate from "@/modal/ProductModalUpdate";
import { toast } from "react-toastify";

const OutOfStock = () => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["outstock", sellerId.shopName, currentPage],
    queryFn: () =>
      getFetch(
        `${localurl}/product/all/out-stock?shopName=${sellerId.shopName}&page=${currentPage}`
      ).then((response) => response.data),
    keepPreviousData: true,
    staleTime: 300000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching products</div>;
  }

  const { products, pagination } = data.data;
  const { currentPage: backendPage, totalPages } = pagination;

  const handleEditModalOpen = (show, product) => {
    setIsEditModalOpen(show);
    setProductData(product || []);
  };

  return (
    <div className="p-0 mt-7">
      <div className="flex flex-row items-center justify-between mb-6">
        <Typography variant="h4" color="blue-gray">
          Out Of Stock Products
        </Typography>
      </div>

      {/* Products Table */}
      <Card>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left border border-gray-300">
              <thead>
                <tr className="bg-blue-gray-100 text-blue-gray-700">
                  <th className="px-4 py-2 border-b">Image</th>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Category</th>
                  <th className="px-4 py-2 border-b">Price</th>
                  <th className="px-4 py-2 border-b">Rating</th>
                  <th className="px-4 py-2 border-b">Stock</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    {product?.productimage[0]?.filename.startsWith("https") ? (
                      <td className="px-4 py-2 border-b">
                        <Avatar
                          src={`${product?.productimage[0]?.filename}`}
                          alt={product.title}
                          size="sm"
                          variant="rounded"
                          className="shadow-md"
                        />
                      </td>
                    ) : (
                      <td className="px-4 py-2 border-b">
                        <Avatar
                          src={`${localurl}/${product?.productimage[0]?.filename}`}
                          alt={product.title}
                          size="sm"
                          variant="rounded"
                          className="shadow-md"
                        />
                      </td>
                    )}

                    <td className="px-4 py-2 border-b">{product.title}</td>
                    <td className="px-4 py-2 border-b">
                      {product.category.categoryName}
                    </td>
                    <td className="px-4 py-2 border-b">${product.price}</td>
                    <td className="px-4 py-2 border-b">{product.rating}</td>
                    <td className="px-4 py-2 border-b">{product.stock}</td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <Tooltip content="Edit">
                          <IconButton
                            variant="text"
                            size="sm"
                            color="blue"
                            onClick={() => handleEditModalOpen(true, product)}
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <Button
          disabled={backendPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          variant="text"
          className="px-4"
        >
          Previous
        </Button>
        <Typography variant="small" className="px-4">
          Page {backendPage} of {totalPages}
        </Typography>
        <Button
          disabled={backendPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          variant="text"
          className="px-4"
        >
          Next
        </Button>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
            <ProductModalUpdate
              setIsEditModalOpen={setIsEditModalOpen}
              productData={productData}
              fetchProducts={() =>
                queryClient.invalidateQueries([
                  "outstock",
                  sellerId.shopName,
                  currentPage,
                ])
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OutOfStock);
