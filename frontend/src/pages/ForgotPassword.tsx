import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Backdrop,
  Fade,
} from '@mui/material';
import Button from '../components/common/CustomButton.tsx';
import { Link } from 'react-router-dom';
import api from '../api/api.tsx';
import { useNotification } from '../context/NotificationContext.tsx';
import logo from '../assets/logo.png';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      notify('OTP sent to your email (check spam folder too)', 'success');
      setStep(2);
    } catch (error: any) {
      notify(error.response?.data?.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      notify('Password reset successfully! Please login.', 'success');
      window.location.href = '/login';
    } catch (error: any) {
      notify(error.response?.data?.message || 'Failed to reset password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box 
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 0, md: 12 },
            py: 3,
            background: 'linear-gradient(135deg, #6B3CDA11 0%, #6B3CDA05 100%)',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              width: '500px',
              height: '500px',
              p: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #6B3CDAAA 0%, #3A86FF88 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(107, 60, 218, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 20px 40px rgba(107, 60, 218, 0.15)',
              }
            }}
          >
            <img 
              src={logo} 
              alt="SafeBait Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0px 8px 16px rgba(107, 60, 218, 0.2))'
              }}
            />
          </Box>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              width: '100%',
              maxWidth: '400px',
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: '1px solid rgba(107, 60, 218, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 10px 40px rgba(107, 60, 218, 0.1)',
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #6B3CDA 0%, #8B6BE3 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1
                }}
              >
                Reset Password
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                {step === 1 ? 'Enter your email to reset password' : 'Enter the verification code'}
              </Typography>
            </Box>

            {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <TextField
              label="Email Address"
              type="email"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6B3CDA',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6B3CDA',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6B3CDA 0%, #8B6BE3 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B2CCA 0%, #7B5BD3 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(107, 60, 218, 0.3)',
                }
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3,
                bgcolor: 'rgba(107, 60, 218, 0.1)',
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#6B3CDA'
                }
              }}
            >
              Enter the 6-digit OTP sent to {email}
            </Alert>
            
            <TextField
              label="6-Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6B3CDA',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6B3CDA',
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6B3CDA',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6B3CDA',
                },
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(107, 60, 218, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6B3CDA',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6B3CDA',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6B3CDA 0%, #8B6BE3 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5B2CCA 0%, #7B5BD3 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(107, 60, 218, 0.3)',
                }
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setStep(1)}
              disabled={loading}
              sx={{
                color: '#6B3CDA',
                borderColor: 'rgba(107, 60, 218, 0.3)',
                '&:hover': {
                  borderColor: '#6B3CDA',
                  background: 'rgba(107, 60, 218, 0.05)',
                }
              }}
            >
              Back to Email
            </Button>
          </form>
        )}

        <Box sx={{ mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'rgba(107, 60, 218, 0.1)', pt: 3 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Remember your password?{" "}
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6B3CDA 0%, #8B6BE3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
          </Paper>
        </Box>
      </Container>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'rgba(107, 60, 218, 0.1)',
          backdropFilter: 'blur(4px)',
        }}
        open={loading}
      >
        <Fade in={loading}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 8px 32px rgba(107, 60, 218, 0.1)',
              border: '1px solid rgba(107, 60, 218, 0.2)',
            }}
          >
            <CircularProgress size={50} sx={{ color: '#6B3CDA' }} />
            <Typography
              sx={{
                background: 'linear-gradient(135deg, #6B3CDA 0%, #8B6BE3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              {step === 1 ? 'Sending verification code...' : 'Resetting your password...'}
            </Typography>
          </Box>
        </Fade>
      </Backdrop>
    </>
  );
}
