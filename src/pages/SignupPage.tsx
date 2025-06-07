import React, { Component } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Stack,
  Dialog,
} from '@mui/material';
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md';
import { signupUser } from '../services/Api';
import LoginLogo from '../assets/loginLogo.png';
import toast, { Toaster } from 'react-hot-toast';
import WhatsappOptIn from './WhatsappOptIn';
import throttle from 'lodash/throttle';

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  countryCode: string;
  error: string | null;
  showWhatsAppDialog: boolean;
  isLoading: boolean;
}

class SignupPage extends Component<{}, SignupState> {
  throttledSignup: () => void;

  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      countryCode: '+91',
      error: null,
      showWhatsAppDialog: false,
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
    const { firstName, lastName, email, password, confirmPassword, mobile } = this.state;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !mobile) {
      toast.error('Please fill all fields', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
      return;
    }

    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      const signupData = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        mobile_number: `${this.state.countryCode}${mobile}`,
        password,
      };

      const loadingToast = toast.loading('Creating your account...', {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #3B82F6',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });

      const response = await signupUser(signupData);

      if (response.user?.id) {
        localStorage.setItem('token', response.token);
        toast.success('Account created successfully!', {
          id: loadingToast,
          style: {
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #10B981',
            color: '#1F2937',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        });
        this.setState({ showWhatsAppDialog: true });
      } else {
        toast.error('Signup failed. Please try again.', {
          id: loadingToast,
          style: {
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #EF4444',
            color: '#1F2937',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during signup.';
      console.error('Signup error details:', error);
      toast.error(errorMessage, {
        style: {
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid #EF4444',
          color: '#1F2937',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleWhatsAppOptIn = () => {
    console.log('User attempted WhatsApp opt-in');
    setTimeout(() => {
      this.setState({ showWhatsAppDialog: false });
      window.location.href = '/login';
    }, 500);
    toast.success('You will be redirected to login in 5 seconds...', {
      duration: 400,
      style: {
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #10B981',
        color: '#1F2937',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    });
  };

  handleDialogClose = () => {
    this.setState({ showWhatsAppDialog: false });
    window.location.href = '/login';
  };

  render() {
    const { firstName, lastName, email, password, confirmPassword, mobile, error, showWhatsAppDialog, isLoading } = this.state;

    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={2}
        bgcolor="#f5f5f2"
      >
        <Toaster position="top-right" />
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
                placeholder="First Name"
                name="firstName"
                value={firstName}
                onChange={this.handleInputChange}
              />
            </Box>

            <Box display="flex" alignItems="flex-end">
              <MdPerson size={20} style={{ marginRight: 8, color: '#9e9e9e' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Last Name"
                name="lastName"
                value={lastName}
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
              <Box display="flex" width="100%">
                <TextField
                  disabled
                  variant="standard"
                  value={this.state.countryCode}
                  sx={{ width: '60px', mr: 1 }}
                  inputProps={{
                    style: { color: '#666' }
                  }}
                />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Mobile Number"
                  name="mobile"
                  value={mobile}
                  onChange={this.handleInputChange}
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                    inputMode: 'numeric'
                  }}
                  type="tel"
                />
              </Box>
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

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button sx={{ textTransform: 'none', padding: 0 }} href="/login">
                Sign In
              </Button>
            </Typography>
          </Box>
        </Paper>

        <Dialog open={showWhatsAppDialog} onClose={this.handleDialogClose}>
          <WhatsappOptIn onOptIn={this.handleWhatsAppOptIn} onClose={this.handleDialogClose} />
        </Dialog>
      </Box>
    );
  }
}

export default SignupPage;