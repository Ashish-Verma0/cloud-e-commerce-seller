import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";

const OrderModal = ({ setIsOrderModalOpen }) => {
  const orderDetails = {
    deliveryAddress: {
      name: "John Doe",
      address: "123 Elm Street, Springfield",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      phone: "+1 555-1234",
    },
    orderedProducts: [
      {
        id: 1,
        name: "Wireless Headphones",
        price: "$59.99",
        quantity: 2,
        image: "https://via.placeholder.com/100",
      },
      {
        id: 2,
        name: "Gaming Mouse",
        price: "$29.99",
        quantity: 1,
        image: "https://via.placeholder.com/100",
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "20px auto",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center border-b pb-4">
        <Typography variant="h4" className="font-bold text-blue-600 text-left">
          Ordered Product
        </Typography>
        <p
          onClick={() => setIsOrderModalOpen(false)}
          style={{ cursor: "pointer" }}
        >
          ❌
        </p>
      </div>

      {/* Delivery Address Section */}
      <Card
        sx={{
          marginBottom: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
          >
            Delivery Address
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "4px" }}>
            <strong>Name:</strong> {orderDetails.deliveryAddress.name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "4px" }}>
            <strong>Address:</strong> {orderDetails.deliveryAddress.address}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "4px" }}>
            <strong>City:</strong> {orderDetails.deliveryAddress.city},{" "}
            {orderDetails.deliveryAddress.state} -{" "}
            {orderDetails.deliveryAddress.postalCode}
          </Typography>
          <Typography variant="body1">
            <strong>Phone:</strong> {orderDetails.deliveryAddress.phone}
          </Typography>
        </CardContent>
      </Card>

      {/* Ordered Products Section */}
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "16px", color: "#333" }}
          >
            Ordered Products
          </Typography>
          <Grid container spacing={3}>
            {orderDetails.orderedProducts.map((product) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={product.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "16px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    maxWidth: "300px",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <Avatar
                    variant="square"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      width: "100px",
                      height: "100px",
                      marginBottom: "12px",
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        textAlign: "center",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                      Price: {product.price}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                      Quantity: {product.quantity}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderModal;
