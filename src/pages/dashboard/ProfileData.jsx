import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProfileData = () => {
  const sellerId = React.useMemo(() => {
    const storedSellerId = localStorage.getItem("seller-id");
    return storedSellerId ? JSON.parse(storedSellerId) : null;
  }, []);

  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: sellerId.ownerName || "",
    ownerEmail: sellerId.ownerEmail || "",
    ownerPhone: sellerId.ownerPhone || "",
    shopName: sellerId.shopName || "",
    shopAddress: sellerId.shopAddress || "",
  });
  const navigate = useNavigate();
  const handleEdit = () => setIsEditable(true);
  const handleSubmit = () => {
    setIsEditable(false);
    console.log("Updated data:", formData);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="relative">
      <FaTimes
        className="absolute top-2 right-2 text-red-500 text-2xl cursor-pointer hover:text-red-700"
        onClick={() => navigate("/dashboard/manage-products")}
      />
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg relative border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out mt-5">
        <div className="flex flex-col items-center gap-4">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCZDyLxMWZlx4PmhEss-JsPKtY-e_O293Pfg&s"
            alt="Profile"
            className="rounded-full object-cover border-2 border-gray-300 shadow-md"
            style={{ width: "6rem", height: "6rem" }}
          />
          <h2 className="text-lg font-semibold text-gray-700">
            Profile Information
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <h2 className="text-base font-semibold text-gray-700">
              Owner Name
            </h2>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
                !isEditable ? "bg-gray-100" : ""
              }`}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-700">
              Owner Email
            </h2>
            <input
              type="text"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              readOnly={!isEditable}
              className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
                !isEditable ? "bg-gray-100" : ""
              }`}
            />
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-700">Owner Phone</h2>
          <input
            type="phone"
            name="ownerPhone"
            value={formData.ownerPhone}
            onChange={handleChange}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
              !isEditable ? "bg-gray-100" : ""
            }`}
          />
        </div>
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-700">ShopName</h2>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
              !isEditable ? "bg-gray-100" : ""
            }`}
          />
        </div>
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-700">
            Shop Address
          </h2>
          <input
            type="text"
            name="address"
            value={formData.shopAddress}
            onChange={handleChange}
            readOnly={!isEditable}
            className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${
              !isEditable ? "bg-gray-100" : ""
            }`}
          />
        </div>

        <div className="mt-6 flex justify-center">
          {isEditable ? (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ width: "100%" }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
