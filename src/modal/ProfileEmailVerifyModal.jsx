import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getFetch, postFetchData } from "@/api/Api";
import { localurl } from "../../constant";
import { toast } from "react-toastify";

const ProfileEmailVerifyModal = ({ setIsHandleVerify, userEmail }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  useEffect(() => {
    const savedTimer = localStorage.getItem("otpTimer");
    if (savedTimer) {
      setTimer(parseInt(savedTimer, 10));
    }

    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0;
          localStorage.setItem("otpTimer", newTime);
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOtpSent, timer]);

  const handleChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (updatedOtp.join("").length === otp.length && !updatedOtp.includes("")) {
      setIsOtpVerified(true);
    } else {
      setIsOtpVerified(false);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    } else if (event.key === "Backspace") {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
    }
  };

  const sendOtpMutation = useMutation({
    mutationFn: () =>
      postFetchData(`${localurl}/seller/verify-email`, { email: userEmail }),
    onSuccess: (response) => {
      if (response.success) {
        toast("Otp send successfully to your email id");
        setIsOtpSent(true);
      } else {
        setIsOtpSent(false);
        toast("Error sending OTPpppppp");
      }
    },
    onError: (error) => {
      console.error("Error sending OTP:", error);
      toast(error?.response?.data?.message);
      setIsOtpSent(false);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      postFetchData(`${localurl}/seller/verify-otp`, { otp: otp.join("") }),
    onSuccess: () => {
      toast("OTP Verified");
      setIsHandleVerify(false);
    },
    onError: (error) => {
      console.error("Error verifying OTP:", error);
      toast(error?.response?.data?.message);
    },
  });

  const handleSendOtp = () => {
    setIsOtpSent(true);
    sendOtpMutation.mutate();
    setTimer(30);
    localStorage.setItem("otpTimer", 30);
  };

  const handleVerifyOtp = () => {
    verifyOtpMutation.mutate();
    setIsHandleVerify(false);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setIsOtpSent(false);
    localStorage.removeItem("otpTimer");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          boxShadow: 3,
          borderRadius: 3,
          p: 4,
          width: "100%",
          maxWidth: 400,
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Close Icon */}
        <IconButton
          onClick={() => setIsHandleVerify(false)}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>

        <SmartphoneIcon sx={{ fontSize: 40, color: "#1976d2", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          OTP Verification
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          One Time Password (OTP) has been sent via Email to{" "}
          <strong>{userEmail}</strong>. Enter the OTP below to verify.
        </Typography>

        <Grid container spacing={1} justifyContent="center" sx={{ mt: 3 }}>
          {otp.map((digit, index) => (
            <Grid item key={index}>
              <TextField
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", fontSize: 18 },
                }}
                sx={{ width: 40 }}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="body2" color="text.secondary" mt={2}>
          Resend OTP in{" "}
          <strong>
            {String(Math.floor(timer / 60)).padStart(2, "0")}:
            {String(timer % 60).padStart(2, "0")}
          </strong>
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleVerifyOtp}
          disabled={!isOtpVerified}
        >
          Verify OTP
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSendOtp}
          disabled={isOtpSent ? true : false}
        >
          Send OTP
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEmailVerifyModal;
