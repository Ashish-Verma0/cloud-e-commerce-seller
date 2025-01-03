// import React from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Avatar,
// } from "@mui/material";

// const OrderModal = ({ setIsOrderModalOpen }) => {
//   const orderDetails = {
//     deliveryAddress: {
//       name: "John Doe",
//       address: "123 Elm Street, Springfield",
//       city: "Springfield",
//       state: "IL",
//       postalCode: "62701",
//       phone: "+1 555-1234",
//     },
//     orderedProducts: [
//       {
//         id: 1,
//         name: "Wireless Headphones",
//         price: "$59.99",
//         quantity: 2,
//         image: "https://via.placeholder.com/100",
//       },
//       {
//         id: 2,
//         name: "Gaming Mouse",
//         price: "$29.99",
//         quantity: 1,
//         image: "https://via.placeholder.com/100",
//       },
//     ],
//   };

//   return (
//     <Box
//       sx={{
//         padding: "20px",
//         maxWidth: "1200px",
//         margin: "20px auto",
//         backgroundColor: "#f5f5f5",
//         borderRadius: "12px",
//         boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <div className="flex justify-between items-center border-b pb-4">
//         <Typography variant="h4" className="font-bold text-blue-600 text-left">
//           Ordered Product
//         </Typography>
//         <p
//           onClick={() => setIsOrderModalOpen(false)}
//           style={{ cursor: "pointer" }}
//         >
//           ❌
//         </p>
//       </div>

//       {/* Delivery Address Section */}
//       <Card
//         sx={{
//           marginBottom: "20px",
//           backgroundColor: "#ffffff",
//           borderRadius: "12px",
//           boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h5"
//             sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
//           >
//             Delivery Address
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: "4px" }}>
//             <strong>Name:</strong> {orderDetails.deliveryAddress.name}
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: "4px" }}>
//             <strong>Address:</strong> {orderDetails.deliveryAddress.address}
//           </Typography>
//           <Typography variant="body1" sx={{ marginBottom: "4px" }}>
//             <strong>City:</strong> {orderDetails.deliveryAddress.city},{" "}
//             {orderDetails.deliveryAddress.state} -{" "}
//             {orderDetails.deliveryAddress.postalCode}
//           </Typography>
//           <Typography variant="body1">
//             <strong>Phone:</strong> {orderDetails.deliveryAddress.phone}
//           </Typography>
//         </CardContent>
//       </Card>

//       {/* Ordered Products Section */}
//       <Card
//         sx={{
//           backgroundColor: "#ffffff",
//           borderRadius: "12px",
//           boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <CardContent>
//           <Typography
//             variant="h5"
//             sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
//           >
//             Ordered Products
//           </Typography>
//           <Grid container spacing={3}>
//             {orderDetails.orderedProducts.map((product) => (
//               <Grid
//                 item
//                 xs={12}
//                 sm={6}
//                 md={4}
//                 key={product.id}
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Card
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     padding: "16px",
//                     borderRadius: "10px",
//                     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                     width: "100%",
//                     maxWidth: "300px",
//                     transition: "transform 0.3s",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                     },
//                   }}
//                 >
//                   <Avatar
//                     variant="square"
//                     src={product.image}
//                     alt={product.name}
//                     sx={{
//                       width: "100px",
//                       height: "100px",
//                       marginBottom: "12px",
//                     }}
//                   />
//                   <Box>
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         fontWeight: "bold",
//                         marginBottom: "8px",
//                         textAlign: "center",
//                       }}
//                     >
//                       {product.name}
//                     </Typography>
//                     <Typography variant="body2" sx={{ textAlign: "center" }}>
//                       Price: {product.price}
//                     </Typography>
//                     <Typography variant="body2" sx={{ textAlign: "center" }}>
//                       Quantity: {product.quantity}
//                     </Typography>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default OrderModal;

import React, { useState } from "react";
import { Card, CardContent, Typography, Box, Grid, Paper } from "@mui/material";
import { localurl } from "../../constant";

const OrderModal = ({ api_data }) => {
  return (
    <div className="main-container">
      <div
        className="content"
        style={{
          padding: "16px",
          maxHeight: "570px",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            gap: { xs: 3, lg: 5 },
          }}
        >
          {/* Product Details */}
          {/* Product Details */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: { xs: "center", lg: "left" },
              }}
            >
              Order Details
            </Typography>
            <Grid container spacing={2}>
              {api_data.orderedItems?.map((elem) => {
                const { id, price, orderQuantity, productimage, desc, title } =
                  elem;
                console.log("elem", elem);
                return (
                  <Grid item xs={12} sm={6} md={4} key={id}>
                    <Card
                      sx={{
                        padding: "16px",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {productimage[0].filename.startsWith("https") ? (
                        <img
                          src={`${productimage[0].filename}`}
                          alt="Product"
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <img
                          src={`${localurl}/${productimage[0].filename}`}
                          alt="Product"
                          style={{
                            width: "100%",
                            maxHeight: "180px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: "8px",
                            textAlign: { xs: "center", sm: "left" },
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            marginBottom: "8px",
                            textAlign: { xs: "center", sm: "left" },
                          }}
                        >
                          {desc}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#d32f2f",
                            fontWeight: "bold",
                            textAlign: { xs: "center", sm: "left" },
                          }}
                        >
                          <span
                            style={{
                              textDecoration: "line-through",
                              color: "#999",
                            }}
                          >
                            ₹{(price * 1.3).toFixed(2)}
                          </span>{" "}
                          ₹{price}{" "}
                          <span style={{ color: "green", fontSize: "14px" }}>
                            30% Off
                          </span>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "blue",
                            marginTop: "8px",
                            textAlign: { xs: "center", sm: "left" },
                          }}
                        >
                          Quantity: <strong>{orderQuantity}</strong>
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Price and Address Details */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              marginTop: { xs: 3, lg: 0 },
            }}
          >
            {/* Price Summary */}
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: { xs: "center", lg: "left" },
                }}
              >
                Price Details
              </Typography>
              <Paper
                sx={{
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography sx={{ marginBottom: "8px", fontWeight: "bold" }}>
                  Total Product Price: ₹{api_data.subTotal}
                </Typography>
                <Typography sx={{ marginBottom: "8px" }}>
                  Delivery Charges: ₹40
                </Typography>
                <Typography sx={{ marginBottom: "8px", color: "green" }}>
                  Discounts: - ₹{(api_data.subTotal * 0.03).toFixed(2)}
                </Typography>
                <hr />
                <Typography sx={{ marginTop: "8px", fontWeight: "bold" }}>
                  Order Total: ₹
                  {(api_data.subTotal - api_data.subTotal * 0.03 + 40).toFixed(
                    2
                  )}
                </Typography>
              </Paper>
            </Box>

            {/* Address Details */}
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: { xs: "center", lg: "left" },
                }}
              >
                Address Details
              </Typography>
              <Paper
                sx={{
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography sx={{ marginBottom: "8px" }}>
                  <strong>Customer Name:</strong> {api_data.address.name}
                </Typography>
                <Typography sx={{ marginBottom: "8px" }}>
                  <strong>Full Address:</strong> {api_data.address.fullAddress}
                </Typography>
                <Typography sx={{ marginBottom: "8px" }}>
                  <strong>State:</strong> {api_data.address.state}
                </Typography>
                <Typography sx={{ marginBottom: "8px" }}>
                  <strong>City:</strong> {api_data.address.city}
                </Typography>
                <Typography sx={{ marginBottom: "8px" }}>
                  <strong>Area Name:</strong> {api_data.address.area}
                </Typography>
                <Typography>
                  <strong>Area Pincode:</strong> {api_data.address.pinCode}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default React.memo(OrderModal);
