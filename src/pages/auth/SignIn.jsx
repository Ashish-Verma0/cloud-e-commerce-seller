import React, { useState, useCallback } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { postFetchData } from "@/api/Api";
import { localurl } from "../../../constant";
import { toast } from "react-toastify";

export function SignIn() {
  const [hide, setHide] = useState(false);
  const [formData, setFormData] = useState({
    ownerEmail: "",
    ownerPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      setHide(true);
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const response = await postFetchData(
          `${localurl}/seller/login`,
          formData
        );
        localStorage.setItem("token", response.token);
        localStorage.setItem("seller-id", JSON.stringify(response.user));

        if (response.success) {
          setHide(false);
          toast("Seller Login successfully");
          setTimeout(() => {
            navigate("/dashboard/manage-products");
            window.location.reload();
          }, 2000);
        } else {
          setHide(false);
          setError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        setHide(false);
        console.error("Login error:", error);
        setError("An error occurred. Please try again later.");
      } finally {
        setHide(false);
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Typography variant="h2" className="font-bold text-blue-600">
            Login
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal mt-2"
          >
            Login to your account
          </Typography>
        </div>

        {/* SignIn Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Enter Email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              type="email"
              className="w-full"
              required
            />
          </div>
          <div className="mb-6">
            <Input
              label="Enter Password"
              name="ownerPassword"
              value={formData.ownerPassword}
              onChange={handleInputChange}
              type="password"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={hide ? true : false}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {error && (
            <Typography
              variant="paragraph"
              className="text-center text-red-500 font-medium mt-4"
            >
              {error}
            </Typography>
          )}

          <Typography
            variant="paragraph"
            className="text-center text-blue-gray-500 font-medium mt-4"
          >
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Sign up
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default React.memo(SignIn);
