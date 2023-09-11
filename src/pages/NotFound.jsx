import React from 'react';
import { Typography, Container, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for does not exist.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go Back to Home
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound;
