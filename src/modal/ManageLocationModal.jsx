import React, { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { postFetchData } from "@/api/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const ManageLocationModal = ({ setIsModalOpen }) => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);
  const [hide, setHde] = useState(false);
  const [formData, setFormData] = useState({
    state: "",
    city: "",
    area: "",
    pinCode: null,
    deliveryTime: null,
    deliveryPrice: null,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return postFetchData(
        `${localurl}/sellerLocation/create?shopName=${sellerId.shopName}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["locatlocationsion", sellerId?.shopName]);
      // fetchCategories();
      toast("Location Created Successfully");
      setIsModalOpen(false);
      setHde(false);
    },
    onError: (error) => {
      console.error("Error on adding location:", error);
      toast("Error on adding location:");
      setHde(false);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddArea = async (e) => {
    setHde(true);
    e.preventDefault();
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      setHde(false);
      console.error("Error during mutation:", error);
      toast("Error during mutation:");
    }
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center border-b pb-4">
          <Typography
            variant="h4"
            className="font-bold text-blue-600 text-left"
          >
            Add Location
          </Typography>
          <p
            onClick={() => setIsModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>
        <div className="mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleAddArea}>
            <Select
              label="Select State"
              value={formData.state}
              onChange={(value) =>
                setFormData((prevData) => ({ ...prevData, state: value }))
              }
            >
              {[
                "Andaman and Nicobar Islands",
                "Andhra Pradesh",
                "Arunachal Pradesh",
                "Assam",
                "Bihar",
                "Chandigarh",
                "Chhattisgarh",
                "Dadra and Nagar Haveli and Daman and Diu",
                "Delhi",
                "Goa",
                "Gujarat",
                "Haryana",
                "Himachal Pradesh",
                "Jharkhand",
                "Karnataka",
                "Kerala",
                "Lakshadweep",
                "Madhya Pradesh",
                "Maharashtra",
                "Manipur",
                "Meghalaya",
                "Mizoram",
                "Nagaland",
                "Odisha",
                "Puducherry",
                "Punjab",
                "Rajasthan",
                "Sikkim",
                "Tamil Nadu",
                "Telangana",
                "Tripura",
                "Uttar Pradesh",
                "Uttarakhand",
                "West Bengal",
              ].map((state) => (
                <Option key={state} value={state}>
                  {state}
                </Option>
              ))}
            </Select>
            <Input
              label="Enter city Name"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="Enter Area Name"
              name="area"
              value={formData.area}
              onChange={handleChange}
            />
            <Input
              label="Enter Postal Code"
              type="phone"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <Input
              label="Delivery Time (in minutes)"
              type="phone"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
            />
            <Input
              label="Delivery Rate"
              type="phone"
              name="deliveryPrice"
              value={formData.deliveryPrice}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
              disabled={hide ? true : false}
            >
              Add Area
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ManageLocationModal);
