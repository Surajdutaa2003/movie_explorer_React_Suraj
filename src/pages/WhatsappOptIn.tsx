// src/components/WhatsappOptIn.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const WhatsappOptIn = ({ onOptIn, onClose }: { onOptIn: () => void; onClose: () => void }) => {
  const joinLink = 'https://wa.me/+14155238886?text=join%20welcome-coat';
  
  const handleJoin = () => {
    localStorage.setItem('whatsapp_opt_in_attempted', 'true');
    onOptIn();
    // Open WhatsApp link in new tab without closing dialog
    window.open(joinLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h6" mb={2}>
        Join WhatsApp Notifications
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        Would you like to receive movie updates on WhatsApp?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1EBE52' } }}
          onClick={handleJoin}
        >
          Join
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Skip
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary" mt={2}>
        Click "Skip" when you're done joining WhatsApp notifications
      </Typography>
    </Box>
  );
};

export default WhatsappOptIn;