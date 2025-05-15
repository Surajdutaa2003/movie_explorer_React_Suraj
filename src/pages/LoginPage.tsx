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
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import LoginLogo from "../assets/loginLogo.png";
import { loginUser } from "../Api";
import { withNavigate } from "../withNavigate";
import { NavigateFunction } from "react-router-dom";
import { throttle } from "lodash";
import { getMovies } from "../Api";

interface LoginResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    mobile_number: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

interface LoginPageProps {
  navigate: NavigateFunction;
}

interface LoginPageState {
  email: string;
  password: string;
  error: string | null;
}

class LoginPage extends Component<LoginPageProps, LoginPageState> {
  throttledLogin: () => void;

  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
    };

    this.throttledLogin = throttle(this.handleLogin.bind(this), 2000, {
      trailing: false,
    });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: null } as Pick<
      LoginPageState,
      keyof LoginPageState
    >);
  };

  handleLogin = async () => {
    const { email, password } = this.state;
    const { navigate } = this.props;

    if (!email || !password) {
      this.setState({ error: "Please fill in both email and password" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: "Please enter a valid email address" });
      return;
    }

    if (password.length < 8) {
      this.setState({ error: "Password must be at least 8 characters long" });
      return;
    }

    try {
      const response = (await loginUser({ email, password })) as LoginResponse;
      console.log("Login response:", response);
      console.log("Token:", response.token);
      console.log("Role:", response.user.role);
      console.log("User:", response.user);

      localStorage.setItem("role", response.user.role);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);

      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored role:", localStorage.getItem("role"));

      alert("Login successful!");
      // const res =  await getMovies(response.token);
      navigate("/home");
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please check your email and password.";
      this.setState({ error: errorMessage });
      console.error("Login error:", error);
    }
  };

  // Temporary button to clear localStorage for testing
  clearStorage = () => {
    localStorage.clear();
    console.log("localStorage cleared");
    this.setState({ error: "localStorage cleared. Please log in again." });
  };

  render() {
    const { email, password, error } = this.state;
    const { navigate } = this.props;

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
          {error && (
            <Typography variant="body2" color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}

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
              onClick={this.throttledLogin}
            >
              Sign In
            </Button>

            {/* Temporary button for clearing localStorage */}
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
              onClick={this.clearStorage}
            >
              Clear Storage (Debug)
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

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{" "}
              <Button
                sx={{ textTransform: "none", padding: 0 }}
                onClick={() => navigate("/signup")}
              >
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
// ss