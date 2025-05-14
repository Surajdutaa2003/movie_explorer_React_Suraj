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
import { signupUser } from '../Api';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from "react-hot-toast";import throttle from 'lodash/throttle';
import LoginLogo from '../assets/loginLogo.png';

interface SignupState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  error: string | null;
  isLoading: boolean;
}

class SignupPage extends Component<{}, SignupState> {
  throttledSignup: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      error: null,
      isLoading: false,
    };

    if (process.env.NODE_ENV === 'test') {
      this.throttledSignup = this._handleSignUp.bind(this);
    } else {
      this.throttledSignup = throttle(this._handleSignUp.bind(this), 3000);
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as any);
  };

  _handleSignUp = async () => {
    const { name, email, password, confirmPassword, mobile } = this.state;

    if (!name || !email || !password || !confirmPassword || !mobile) {
      this.setState({ error: 'Please fill all fields' });
      toast.error('Please fill all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Please enter a valid email address' });
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      this.setState({ error: 'Password must be at least 8 characters long' });
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      this.setState({ error: 'Mobile number must be 10 digits' });
      toast.error('Mobile number must be 10 digits');
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      const signupData = {
        name,
        email,
        mobile_number: mobile,
        password,
      };

      console.log('Sending signup payload:', signupData);
      const response = await signupUser(signupData);
      console.log('Signup API response:', response);

      if (response.id && response.token) {
        localStorage.setItem('token', response.token);
        toast.success('Account created successfully!');
        window.location.href = '/login';
      } else {
        throw new Error('Signup failed: Missing id or token in response');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors
        ? Array.isArray(error.response.data.errors)
          ? error.response.data.errors.join(', ')
          : String(error.response.data.errors)
        : error.response?.data?.message || error.message || 'An error occurred during signup';
      console.error('Signup error details:', error);
      this.setState({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  };

  render() {
    const { name, email, password, confirmPassword, mobile, error, isLoading } = this.state;

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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              onClick={this.throttledSignup}
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
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
              sx={{ textTransform: 'none' }}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FaApple />}
              sx={{ textTransform: 'none' }}
              disabled={isLoading}
            >
              Continue with Apple
            </Button>
          </Stack>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button sx={{ textTransform: 'none', padding: 0 }} href="/login" disabled={isLoading}>
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