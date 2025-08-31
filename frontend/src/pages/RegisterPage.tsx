import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Backdrop,
  Fade
} from "@mui/material";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useNotification } from "../context/NotificationContext.tsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character");
      setIsLoading(false);
      return;
    }

    try {
      await register(email, password);
      notify("Registration successful! Please login.","success");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setIsLoading(false);
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
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
              Join SafeBait today
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              margin="normal"
              fullWidth
              type="email"
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
            <TextField
              label="Password"
              margin="normal"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ minLength: 8 }}
              helperText="Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
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
                '& .MuiFormHelperText-root': {
                  color: 'rgba(107, 60, 218, 0.7)',
                }
              }}
            />
            <TextField
              label="Confirm Password"
              margin="normal"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              inputProps={{ minLength: 8 }}
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
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2, 
                  p: 1, 
                  borderRadius: 1, 
                  bgcolor: 'error.lighter',
                  textAlign: 'center'
                }}
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
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
              Create Account
            </Button>
          </form>
          <Box sx={{ mt: 3, textAlign: 'center', borderTop: 1, borderColor: 'rgba(107, 60, 218, 0.1)', pt: 3 }}>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Already a user?{" "}
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
                Login Here
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
          open={isLoading}
        >
          <Fade in={isLoading}>
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
                Creating your account...
              </Typography>
            </Box>
          </Fade>
        </Backdrop>
      </>
    ); 
}
