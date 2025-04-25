import React, { Component } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { signup } from './api';  // Ensure the signup API is correctly imported

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

    // Validate all fields
    if (!name || !email || !password || !confirmPassword || !mobile) {
      this.setState({ error: 'Please fill all fields' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: 'Please enter a valid email address' });
      return;
    }

    // Validate password
    if (password.length < 6) {
      this.setState({ error: 'Password must be at least 6 characters long' });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }

    // Validate mobile number
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
        role: 0, // Assuming '0' is a regular user role
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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data.errors) {
          // Extracting specific error messages from the response object
          const errorMessages = error.response.data.errors;
          errorMessage = Array.isArray(errorMessages)
            ? errorMessages.join(', ')
            : errorMessages; // Join the error messages if it's an array
        } else {
          errorMessage = error.response.data?.message || error.response.data || error.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Please try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      this.setState({ error: errorMessage });
      console.error('Signup error:', error);
    }
  };

  render() {
    const { name, email, password, confirmPassword, mobile, error } = this.state;

    return (
      <div>
        <Typography variant="h4" align="center">
          Sign Up
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Full Name"
          name="name"
          value={name}
          onChange={this.handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email Address"
          name="email"
          value={email}
          onChange={this.handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={this.handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={this.handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Mobile Number"
          name="mobile"
          value={mobile}
          onChange={this.handleInputChange}
          fullWidth
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={this.handleSignUp}
          style={{ marginTop: '20px' }}
        >
          Sign Up
        </Button>
      </div>
    );
  }
}

export default SignupPage;
