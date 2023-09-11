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
import './login.scss';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { postData } = useAxios()
  const { setUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

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

    if (!formData.email || !formData.password) {
      setSnackbarMessage('Please enter both email and password.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      const response = await postData('/login', formData);
      const data = response.data
      localStorage.setItem('access_token', data.access_token);
      setUser(data);

      setSnackbarMessage('Login successful');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/')
    } catch (err) {
      if (err.response) {
        console.log(err.response)
        setSnackbarMessage(`Login failed. ${err.response?.data?.message || "something went wrong"}.`);
      } else {
        setSnackbarMessage('Login failed. Please check your credentials.');
      }

      console.error('Login error:', err);
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
        <div className="login-container">
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <form className="login-form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <div className="login-signup-link">
              <Link href="/sign-up" variant="body2">
                Don't have an account? Sign Up
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

export default Login;
