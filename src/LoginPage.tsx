import React, { Component } from "react";
import { Box, TextField, Button, Divider, Typography, Paper, Stack } from "@mui/material";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import LoginLogo from "./assets/loginLogo.png";
import { login } from "./Api";
import { withNavigate } from "./withNavigate";
import { NavigateFunction } from "react-router-dom";

interface LoginResponse {
  user: {
    id: number;
    email: string;
    // Add other user properties as needed
  };
  token: string;
}

interface LoginPageProps {
  navigate: NavigateFunction;
}

interface LoginPageState {
  email: string;
  password: string;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value } as Pick<LoginPageState, keyof LoginPageState>);
  };

  handleLogin = async () => {
    const { email, password } = this.state;
    const { navigate } = this.props;
    try {
      const response = await login({ email, password }) as LoginResponse;

      // Save token or user data if needed
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      alert("Login failed. Please check your email and password.");
      console.error("Login error:", error);
    }
  };

  render() {
    const { email, password } = this.state;
    const { navigate } = this.props; // Access navigate from props

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
                onChange={this.handleChange}
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

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#115293" },
                transition: "background-color 0.3s ease-in-out",
              }}
              onClick={this.handleLogin}
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
  }
}

export default withNavigate(LoginPage);