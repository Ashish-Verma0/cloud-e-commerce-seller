import React, { useState, useCallback } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { postFetch } from "@/api/Api";
import { localurl } from "../../../constant";
import { toast } from "react-toastify";

export function SignUp() {
  const [hide, setHide] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
    ownerPhone: "",
    ownerAadhar: "",
    ownerPanCard: "",
    shopName: "",
    shopAddress: "",
    shopVerified: false,
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        setImage(file);
      } else {
        toast("File size exceeds the limit of 2MB.");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    setHide(true);
    e.preventDefault();

    const formDataToSend = new FormData();

    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("ownerAadhar", formData.ownerAadhar);
    formDataToSend.append("ownerEmail", formData.ownerEmail);
    formDataToSend.append("ownerPanCard", formData.ownerPanCard);
    formDataToSend.append("ownerPassword", formData.ownerPassword);
    formDataToSend.append("ownerPhone", formData.ownerPhone);
    formDataToSend.append("shopAddress", formData.shopAddress);
    formDataToSend.append("shopName", formData.shopName);
    formDataToSend.append("shopVerified", formData.shopVerified);
    formDataToSend.append("shopLogo", image);
    try {
      const response = await postFetch(
        `${localurl}/seller/create`,
        formDataToSend
      );
      if (response.status === 201) {
        setHide(false);
        toast("Seller Created Successfully");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      setHide(false);
    } catch (error) {
      setHide(false);
      console.error("Error occurred while submitting form", error);
    }
  };

  return (
    <section className="m-8 flex flex-wrap gap-8 justify-center items-start">
      <div className="w-full lg:w-3/5 mt-12">
        <div className="text-center mb-8">
          <Typography variant="h2" className="font-bold ml-20">
            Sign Up
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Fill in the details below to create an account.
          </Typography>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-2"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4 mb-4">
            {["ownerName", "ownerEmail", "ownerPassword", "ownerPhone"].map(
              (field) => (
                <div key={field} className="w-72">
                  <Input
                    label={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}
          </div>

          <div className="flex flex-col gap-4">
            {["ownerAadhar", "ownerPanCard", "shopName", "shopAddress"].map(
              (field) => (
                <div key={field} className="w-72">
                  <Input
                    label={`Enter ${field
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                  />
                </div>
              )
            )}
          </div>

          <div className="w-full flex justify-center items-center mt-6">
            <div className="w-72">
              <label
                htmlFor="upload-logo"
                className="block w-full py-2 px-4 bg-blue-500 text-white font-medium text-center rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
              >
                Choose App Logo
              </label>
              <input
                id="upload-logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="mt-6 col-span-2">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  I agree to the&nbsp;
                  <a
                    href="#"
                    className="font-normal text-black transition-colors hover:text-gray-900 underline"
                  >
                    Terms and Conditions
                  </a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
              // checked={formData.shopVerified} // Bind checkbox state to shopVerified
              // onChange={(e) =>
              //   setFormData((prev) => ({
              //     ...prev,
              //     shopVerified: e.target.checked,
              //   }))
              // }
            />
            <Button
              type="submit"
              className="mt-6 w-full lg:w-1/2 mx-auto"
              fullWidth
              disabled={hide ? true : false}
            >
              Sign Up
            </Button>
            <Typography
              variant="paragraph"
              className="text-center text-blue-gray-500 font-medium mt-4"
            >
              Already have an account?
              <Link to="/sign-in" className="text-gray-900 ml-1">
                Login
              </Link>
            </Typography>
          </div>
        </form>
      </div>
    </section>
  );
}

export default React.memo(SignUp);
