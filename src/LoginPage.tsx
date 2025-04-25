import React, { useState } from "react";
import { Box, TextField, Button, Divider, Typography, Paper, Stack } from "@mui/material";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoginLogo from "./assets/loginLogo.png";
import { login } from "./Api"; // <- Import the login function

interface LoginResponse {
  user: any;
  token: string;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }) as LoginResponse;

      // Save token or user data if needed
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token); // If token is returned

      alert("Login successful!");
      navigate("/home");
    } catch (error: any) {
      alert("Login failed. Please check your email and password.");
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      bgcolor="#EDEEF0"
    >
      <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
        <Box
          width={300}
          height={200}
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography>
            <img
              src={LoginLogo}
              alt="logo"
              className="w-[290px] h-[290px] object-contain relative bottom-[10px]"
            />
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 3,
          bgcolor: "#EDEEF0",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <Box display="flex" alignItems="flex-end">
            <MdEmail size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Box>

          <Box display="flex" alignItems="flex-end">
            <MdLock size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#115293" },
              transition: "background-color 0.3s ease-in-out",
            }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="textSecondary">
            OR
          </Typography>
        </Divider>

        <Stack spacing={1.5}>
          <Button fullWidth variant="outlined" startIcon={<FcGoogle />} sx={{ textTransform: "none" }}>
            Continue with Google
          </Button>
          <Button fullWidth variant="outlined" startIcon={<FaApple />} sx={{ textTransform: "none" }}>
            Continue with Apple
          </Button>
        </Stack>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Don't have an account?{" "}
            <Button sx={{ textTransform: "none", padding: 0 }} onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
