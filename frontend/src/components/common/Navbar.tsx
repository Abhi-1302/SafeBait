import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Switch,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useThemeMode } from "../../context/ThemeContext.tsx";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { darkMode, toggleDarkMode } = useThemeMode();

  const handleAdminMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAdminMenuClose = () => setAnchorEl(null);

  const handleAdminNav = (path: string) => {
    navigate(path);
    handleAdminMenuClose();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #7b1fa2ee 0%, #6B3CDAAA 100%)'
          : 'linear-gradient(135deg, #4c34d3ee 0%, #6B3CDAAA 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Box
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            cursor: 'pointer',
            gap: 2 
          }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="SafeBait Logo" style={{ height: '32px', width: 'auto' }} />
          <Typography 
            variant="h6"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SafeBait
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              p: 0.5,
            }}>
              <Brightness7Icon sx={{ mr: 0.5, color: darkMode ? 'grey.500' : 'inherit', fontSize: '1.2rem' }} />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                color="default"
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#fff',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#fff',
                  }
                }}
              />
              <Brightness4Icon sx={{ ml: 0.5, color: darkMode ? 'inherit' : 'grey.500', fontSize: '1.2rem' }} />
            </Box>
          </Tooltip>
        </Box>
        {user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isAdmin && (
              <>
                <Button
                  onClick={handleAdminMenuOpen}
                  startIcon={<AdminPanelSettingsIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  Admin
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAdminMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: darkMode ? 'rgba(33, 33, 33, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                      border: '1px solid',
                      borderColor: darkMode ? 'rgba(123, 31, 162, 0.2)' : 'rgba(76, 52, 211, 0.2)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => handleAdminNav("/admin")}
                    sx={{ 
                      color: darkMode ? '#f3e5f5' : '#212121',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(123, 31, 162, 0.2)' : 'rgba(76, 52, 211, 0.1)',
                      }
                    }}
                  >
                    Admin Dashboard
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleAdminNav("/admin/templates")}
                    sx={{ 
                      color: darkMode ? '#f3e5f5' : '#212121',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(123, 31, 162, 0.2)' : 'rgba(76, 52, 211, 0.1)',
                      }
                    }}
                  >
                    Manage Templates
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleAdminNav("/admin/users")}
                    sx={{ 
                      color: darkMode ? '#f3e5f5' : '#212121',
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(123, 31, 162, 0.2)' : 'rgba(76, 52, 211, 0.1)',
                      }
                    }}
                  >
                    Manage Users
                  </MenuItem>
                </Menu>
              </>
            )}
            <Button
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/audiences")}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              Audiences
            </Button>
            <Button
              startIcon={<CampaignIcon />}
              onClick={() => navigate("/campaigns")}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              Campaigns
            </Button>
            <Button
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
