import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  CssBaseline,
  Paper,
  Avatar,
  CircularProgress,
  Link,
  Snackbar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './register.scss'
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const { postData } = useAxios();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!formData.name || !formData.email || !formData.password) {
      setSnackbarMessage('Please enter all required fields.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      // Simulate an API call to create a new user (replace with actual API call)
      const response = await postData('/sign-up', formData);
      const data = response.data

      // Handle successful user creation
      setSnackbarMessage('Sign up successful');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      localStorage.setItem('access_token', data.access_token);
      setUser(data);
      // Redirect or set user state accordingly
      navigate('/')
    } catch (err) {
      if (err.response) {
        console.log(err.response)
        setSnackbarMessage(`Sign up failed. ${err.response?.data?.message || "something went wrong"}.`);
      } else {
        setSnackbarMessage('Sign up failed. Please check your credentials.');
      }
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3}>
        <div className="signup-container">
          <Avatar className="signup-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className="signup-form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="signup-button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <div className="signup-signin-link">
              <Link href="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </div>
          </form>
        </div>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
