// import React, { useEffect, useState } from "react";
// import { Card, Button, Typography } from "@material-tailwind/react";
// import Swal from "sweetalert2";
// import ManageProductModal from "../../modal/ManageProductModal";
// import ManageProductBulkModal from "@/modal/ManageProductBulkModal";
// import ProductModalUpdate from "@/modal/ProductModalUpdate";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { localurl } from "../../../constant";
// import { getFetch, putFetchData } from "@/api/Api";
// import { toast } from "react-toastify";
// import OrderModal from "@/modal/OrderModal";

// const ManageOrders = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
//   const [apiData, setApiData] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const sellerId = React.useMemo(() => {
//     const storedSellerId = localStorage.getItem("seller-id");
//     return storedSellerId ? JSON.parse(storedSellerId) : null;
//   }, []);

//   const queryClient = useQueryClient();

//   const {
//     data: orderData = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["orders", sellerId?.shopName, currentPage],
//     queryFn: async () => {
//       if (!sellerId?.shopName)
//         throw new Error("Seller ID or shop name is missing.");
//       const response = await getFetch(
//         `${localurl}/order/all/seller?shopName=${sellerId.shopName}&page=${currentPage}`
//       );
//       return response?.data?.data || [];
//     },
//     enabled: !!sellerId?.shopName,
//     staleTime: 1000 * 60 * 5,
//   });

//   const mutation = useMutation({
//     mutationFn: ({ id, data }) =>
//       putFetchData(`${localurl}/order/update?orderId=${id}`, { status: data }),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["orders", sellerId?.shopName]);
//       toast("order status updated");
//     },
//     onError: (error) => {
//       console.error("Error updating product:", error);
//       toast("Error updating product:");
//     },
//   });

//   const handleStatusChange = (e, id) => {
//     let data = e.target.value;
//     console.log(id);
//     mutation.mutate({ id, data });
//   };

//   const { orders = [], pagination = {} } = orderData;

//   const { totalPages } = pagination;

//   const handleOrderModalOpen = (order) => {
//     setIsOrderModalOpen(true);
//     setApiData(order);
//   };

//   return (
//     <div className="p-0 mt-7">
//       <div className="flex flex-row items-center justify-between mb-6 gap-4">
//         <Typography
//           variant="h4"
//           color="blue-gray"
//           className="text-lg sm:text-xl font-bold"
//         >
//           Orders
//         </Typography>
//       </div>

//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-max table-auto text-left border border-gray-300">
//             <thead>
//               <tr className="bg-blue-gray-100 text-blue-gray-700">
//                 <th className="px-4 py-2 border-b">Customer</th>
//                 <th className="px-4 py-2 border-b">Product</th>
//                 <th className="px-4 py-2 border-b">Quantity</th>
//                 <th className="px-4 py-2 border-b">Price (In Rs)</th>
//                 <th className="px-4 py-2 border-b">Order Date</th>
//                 {/* <th className="px-4 py-2 border-b">Delivery Date</th> */}
//                 <th className="px-4 py-2 border-b">Delivery Address</th>
//                 <th className="px-4 py-2 border-b">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((orderr) => {
//                 const isoDate = orderr?.createdAt;

//                 const date = new Date(isoDate);

//                 const formattedDate = date.toLocaleString("en-US", {
//                   year: "numeric",
//                   month: "2-digit",
//                   day: "2-digit",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   second: "2-digit",
//                   hour12: true,
//                 });

//                 console.log(formattedDate);

//                 return (
//                   <tr
//                     key={orderr.id}
//                     className="hover:bg-gray-100"
//                     onClick={() => handleOrderModalOpen(orderr)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <td className="px-4 py-2 border-b">{`${orderr?.user?.firstName} ${orderr.user.lastName}`}</td>
//                     <td className="px-4 py-2 border-b">
//                       {orderr?.product?.title}
//                     </td>
//                     <td className="px-4 py-2 br-b">{orderr?.quantity}</td>
//                     <td className="px-4 py-2 border-b">{orderr?.subTotal}</td>
//                     <td className="px-4 py-2 border-b">{formattedDate}</td>
//                     {/* <td className="px-4 py-2 border-b">{order?.stock}</td> */}
//                     <td className="px-4 py-2 border-b">
//                       {orderr?.address?.fullAddress}
//                     </td>
//                     <td className="px-4 py-2 border-b">
//                       <div className="flex items-center gap-2">
//                         <select
//                           value={orderr.status}
//                           onChange={(e) => handleStatusChange(e, orderr.id)}
//                           className="px-4 py-2 border rounded-md bg-white text-sm text-gray-700 shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                           <option value="pending" className="text-gray-700">
//                             pending
//                           </option>
//                           <option value="delivered" className="text-green-600">
//                             delivered
//                           </option>

//                           <option value="cancelled" className="text-red-600">
//                             Cancelled
//                           </option>
//                         </select>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <div className="flex justify-center items-center mt-4">
//         <Button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((prev) => prev - 1)}
//           variant="text"
//           className="px-4"
//         >
//           Previous
//         </Button>
//         <Typography variant="small" className="px-4">
//           Page {currentPage} of {totalPages}
//         </Typography>
//         <Button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((prev) => prev + 1)}
//           variant="text"
//           className="px-4"
//         >
//           Next
//         </Button>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
//             <ManageProductModal setIsModalOpen={setIsModalOpen} />
//           </div>
//         </div>
//       )}

//       {isBulkModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
//             <ManageProductBulkModal setIsBulkModalOpen={setIsBulkModalOpen} />
//           </div>
//         </div>
//       )}

//       {isUpdateModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
//             <ProductModalUpdate
//               setIsUpdateModalOpen={setIsUpdateModalOpen}
//               product={selectedProduct}
//             />
//           </div>
//         </div>
//       )}

//       {isOrderModalOpen && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4 sm:mx-auto">
//             <OrderModal
//               setIsOrderModalOpen={setIsOrderModalOpen}
//               api_data={apiData}
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default React.memo(ManageOrders);

import React, { useEffect, useState } from "react";
import { Card, Button, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import ManageProductModal from "../../modal/ManageProductModal";
import ManageProductBulkModal from "@/modal/ManageProductBulkModal";
import ProductModalUpdate from "@/modal/ProductModalUpdate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { localurl } from "../../../constant";
import { getFetch, putFetchData } from "@/api/Api";
import { toast } from "react-toastify";
import OrderModal from "@/modal/OrderModal";
import { useNavigate } from "react-router-dom";

const ManageOrders = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [api_data, setApi_data] = useState();

  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", sellerId?.shopName, currentPage],
    queryFn: async () => {
      if (!sellerId?.shopName)
        throw new Error("Seller ID or shop name is missing.");
      const response = await getFetch(
        `${localurl}/order/all/seller?shopName=${sellerId.shopName}&page=${currentPage}`
      );
      return response?.data?.data || [];
    },
    enabled: !!sellerId?.shopName,
    staleTime: 1000 * 60 * 5,
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      putFetchData(`${localurl}/order/update?orderId=${id}`, { status: data }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", sellerId?.shopName]);
      toast("order status updated");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast("Error updating product:");
    },
  });

  const handleStatusChange = (e, id) => {
    let data = e.target.value;
    console.log(id);
    mutation.mutate({ id, data });
  };

  const { order = [], pagination = {} } = orders;

  const { totalPages } = pagination;

  const handleOrderModalOpen = (order) => {
    setIsOrderModalOpen(true);
    setApi_data(order);
    // navigate("/order-modal",{state:JSON.stringify(order)})
  };

  return (
    <div className="p-0 mt-7">
      <div className="flex flex-row items-center justify-between mb-6 gap-4">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-lg sm:text-xl font-bold"
        >
          Orders
        </Typography>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left border border-gray-300">
            <thead>
              <tr className="bg-blue-gray-100 text-blue-gray-700">
                <th className="px-4 py-2 border-b">Customer</th>
                <th className="px-4 py-2 border-b">Product</th>
                <th className="px-4 py-2 border-b">Quantity</th>
                <th className="px-4 py-2 border-b">Price (In Rs)</th>
                <th className="px-4 py-2 border-b">Order Date</th>
                {/* <th className="px-4 py-2 border-b">Delivery Date</th> */}
                <th className="px-4 py-2 border-b">Delivery Address</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.orders?.map((orderr) => {
                const isoDate = orderr?.createdAt;

                const date = new Date(isoDate);

                const formattedDate = date.toLocaleString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                });

                return (
                  <tr
                    key={orderr.id}
                    className="hover:bg-gray-100"
                    style={{ cursor: "pointer" }}
                  >
                    <td
                      className="px-4 py-2 border-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >{`${orderr?.user?.firstName} ${orderr.user.lastName}`}</td>
                    <td
                      className="px-4 py-2 border-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >
                      {orderr?.orderedItems[0].title}
                    </td>
                    <td
                      className="px-4 py-2 br-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >
                      {orderr?.orderedItems[0]?.orderQuantity}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >
                      {orderr?.subTotal}
                    </td>
                    <td
                      className="px-4 py-2 border-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >
                      {formattedDate}
                    </td>
                    {/* <td className="px-4 py-2 border-b">{order?.stock}</td> */}
                    <td
                      className="px-4 py-2 border-b"
                      onClick={() => handleOrderModalOpen(orderr)}
                    >
                      {orderr?.address?.fullAddress}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <select
                          value={orderr.status}
                          onChange={(e) => handleStatusChange(e, orderr.id)}
                          className="px-4 py-2 border rounded-md bg-white text-sm text-gray-700 shadow-md hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending" className="text-gray-700">
                            pending
                          </option>
                          <option value="delivered" className="text-green-600">
                            delivered
                          </option>

                          <option value="cancelled" className="text-red-600">
                            Cancelled
                          </option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

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

      {isOrderModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-50"
          style={{ padding: "30px 0" }}
        >
          {/* Cross Button */}
          <button
            onClick={() => setIsOrderModalOpen(false)}
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              background: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
          <div
            className="bg-white rounded-lg shadow-lg p-6 relative"
            style={{ width: "80%", height: "100%" }}
          >
            <OrderModal
              setIsOrderModalOpen={setIsOrderModalOpen}
              api_data={api_data}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ManageOrders);
