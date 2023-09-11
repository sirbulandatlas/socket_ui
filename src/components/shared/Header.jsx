import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/useUserContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const headerStyle = {
    backgroundColor: '#2196F3',
  };

  const titleStyle = {
    flexGrow: 1,
  };

  const usernameStyle = {
    marginRight: '16px',
  };

  const handleLogout = () => {
    localStorage.setItem('access_token', null);
    navigate('/login'); 
  };

  return (
    <AppBar position="static" style={headerStyle}>
      <Toolbar>
        <Typography variant="h6" style={titleStyle}>
          <span style={usernameStyle}>Welcome, {user.username}</span>
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
