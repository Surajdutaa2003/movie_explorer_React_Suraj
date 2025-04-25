import React, { Component } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import { signup } from './api';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import LoginLogo from './assets/loginLogo.png';

interface SignupState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  error: string | null;
}

class SignupPage extends Component<{}, SignupState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      error: null,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as any);
  };

  handleSignUp = async () => {
    const { name, email, password, confirmPassword, mobile } = this.state;

    if (!name || !email || !password || !confirmPassword || !mobile) {
      this.setState({ error: 'Please fill all fields' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Please enter a valid email address' });
      return;
    }

    if (password.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters long' });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      this.setState({ error: 'Mobile number must be 10 digits' });
      return;
    }

    try {
      const signupData = {
        full_name: name,
        email,
        mobile_number: mobile,
        password,
        role: 0,
      };

      const response = await signup(signupData);

      if (response.user?.id) {
        alert('Account created successfully!');
        window.location.href = '/login';
      } else {
        this.setState({ error: 'Signup failed. Please try again.' });
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred during signup.';

      if (error.response) {
        if (error.response.data.errors) {
          const errorMessages = error.response.data.errors;
          errorMessage = Array.isArray(errorMessages)
            ? errorMessages.join(', ')
            : errorMessages;
        } else {
          errorMessage =
            error.response.data?.message ||
            error.response.data ||
            error.message;
        }
      } else if (error.request) {
        errorMessage = 'No response received from server. Please try again.';
      } else {
        errorMessage = error.message;
      }

      this.setState({ error: errorMessage });
      console.error('Signup error:', error);
    }
  };

  render() {
    const { name, email, password, confirmPassword, mobile, error } =
      this.state;

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
            <img
              src={LoginLogo}
              alt="logo"
              className="w-[290px] h-[290px] object-contain relative bottom-[10px]"
            />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 3,
            bgcolor: '#EDEEF0',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" align="center" mb={2}>
            Sign Up
          </Typography>

          {error && (
            <Typography variant="body2" color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}

          <Stack spacing={2}>
            <Box display="flex" alignItems="flex-end">
              <MdPerson size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Full Name"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdEmail size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdLock size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdLock size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleInputChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdPhone size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Mobile Number"
                name="mobile"
                value={mobile}
                onChange={this.handleInputChange}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#115293' },
                transition: 'background-color 0.3s ease-in-out',
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
            <Button fullWidth variant="outlined" startIcon={<FcGoogle />} sx={{ textTransform: 'none' }}>
              Continue with Google
            </Button>
            <Button fullWidth variant="outlined" startIcon={<FaApple />} sx={{ textTransform: 'none' }}>
              Continue with Apple
            </Button>
          </Stack>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button sx={{ textTransform: 'none', padding: 0 }} href="/login">
                Sign In
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }
}

export default SignupPage;
