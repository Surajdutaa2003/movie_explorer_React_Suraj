import React, { Component } from "react";
import {
  Box,
  TextField,
  Button,
  Divider,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdEmail, MdLock, MdPerson, MdPhone } from "react-icons/md";
import LoginLogo from "./assets/loginLogo.png";

interface State {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

class SignupPage extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as Pick<State, keyof State>);
  };

  handleSignUp = () => {
    const { name, email, password, confirmPassword, mobile } = this.state;

    if (!name || !email || !password || !confirmPassword || !mobile) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Save the user data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({ name, email, password, mobile })
    );

    alert("Account created successfully!");
    window.location.href = "/login";
  };

  render() {
    const { name, email, password, confirmPassword, mobile } = this.state;

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
        {/* Logo */}
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

        {/* Form */}
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
              <MdPerson size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Name"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdEmail size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Email"
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdPhone size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
              <TextField
  fullWidth
  variant="standard"
  placeholder="Mobile Number"
  type="text"
  name="mobile"
  value={mobile}
  onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      this.setState({ mobile: value });
    }
  }}
  inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
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
                onChange={this.handleChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdLock size={20} style={{ marginRight: 8, color: "#9e9e9e" }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleChange}
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
              onClick={this.handleSignUp}
            >
              Sign Up
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="textSecondary">
              OR
            </Typography>
          </Divider>

          <Stack spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FcGoogle />}
              sx={{ textTransform: "none" }}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FaApple />}
              sx={{ textTransform: "none" }}
            >
              Continue with Apple
            </Button>
          </Stack>

          {/* Link to Sign In */}
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <a href="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
                Sign In
              </a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
}

export default SignupPage;
