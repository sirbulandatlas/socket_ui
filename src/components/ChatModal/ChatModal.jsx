import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
} from '@mui/material';
import './chatModal.scss'; // Import the SCSS file

const ChatModal = ({
  open,
  onClose,
  title,
  content,
  onSubmit,
  disabled,
  selectOptions,
  placeholder,
  onSelectChange,
}) => {

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="chat-modal"
      aria-describedby="chat-modal-description"
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        className="chat-modal" 
      >
        <Typography id="chat-modal" variant="h6" component="h2">
          {title}
        </Typography>
        {content}
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          style={{ marginTop: '16px' }}
          disabled={disabled}
        >
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default ChatModal;
