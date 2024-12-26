import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { putFetchData } from "@/api/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const LocationUpdateModal = ({ setIsUpdateModalOpen, selectedLocation }) => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [formData, setFormData] = useState({
    state: selectedLocation?.state || "",
    city: selectedLocation?.city || "",
    area: selectedLocation?.area || "",
    pinCode: selectedLocation?.pinCode || "",
    deliveryTime: selectedLocation?.deliveryTime || "",
    deliveryPrice: selectedLocation?.deliveryPrice || "",
  });

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return putFetchData(
        `${localurl}/sellerLocation/update?locationId=${selectedLocation?.id}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["locations", sellerId?.shopName]);
      setIsUpdateModalOpen(false);
      toast("Location Updated Successfully");
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast("Error updating category");
    },
  });

  const handleUpdateArea = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
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
            Edit Location
          </Typography>
          <p
            onClick={() => setIsUpdateModalOpen(false)}
            style={{ cursor: "pointer" }}
          >
            ❌
          </p>
        </div>
        <div className="mt-6">
          <form className="flex flex-col gap-4" onSubmit={handleUpdateArea}>
            <Select
              label="Select State"
              value={formData.state}
              onChange={(value) =>
                setFormData((prevData) => ({ ...prevData, state: value }))
              }
            >
              <Option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </Option>
              <Option value="Andhra Pradesh">Andhra Pradesh</Option>
              <Option value="Arunachal Pradesh">Arunachal Pradesh</Option>
              <Option value="Assam">Assam</Option>
              <Option value="Bihar">Bihar</Option>
              <Option value="Chandigarh">Chandigarh</Option>
              <Option value="Chhattisgarh">Chhattisgarh</Option>
              <Option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </Option>
              <Option value="Delhi">Delhi</Option>
              <Option value="Goa">Goa</Option>
              <Option value="Gujarat">Gujarat</Option>
              <Option value="Haryana">Haryana</Option>
              <Option value="Himachal Pradesh">Himachal Pradesh</Option>
              <Option value="Jharkhand">Jharkhand</Option>
              <Option value="Karnataka">Karnataka</Option>
              <Option value="Kerala">Kerala</Option>
              <Option value="Lakshadweep">Lakshadweep</Option>
              <Option value="Madhya Pradesh">Madhya Pradesh</Option>
              <Option value="Maharashtra">Maharashtra</Option>
              <Option value="Manipur">Manipur</Option>
              <Option value="Meghalaya">Meghalaya</Option>
              <Option value="Mizoram">Mizoram</Option>
              <Option value="Nagaland">Nagaland</Option>
              <Option value="Odisha">Odisha</Option>
              <Option value="Puducherry">Puducherry</Option>
              <Option value="Punjab">Punjab</Option>
              <Option value="Rajasthan">Rajasthan</Option>
              <Option value="Sikkim">Sikkim</Option>
              <Option value="Tamil Nadu">Tamil Nadu</Option>
              <Option value="Telangana">Telangana</Option>
              <Option value="Tripura">Tripura</Option>
              <Option value="Uttar Pradesh">Uttar Pradesh</Option>
              <Option value="Uttarakhand">Uttarakhand</Option>
              <Option value="West Bengal">West Bengal</Option>
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
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
            />
            <Input
              label="Delivery Time (in minutes)"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
            />
            <Input
              label="Delivery Rate"
              name="deliveryPrice"
              value={formData.deliveryPrice}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Add Area
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LocationUpdateModal);
