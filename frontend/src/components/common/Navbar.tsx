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
    <AppBar position="static">
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
          <Typography variant="h6">
            SafeBait
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Box>
            {isAdmin && (
              <>
                <Button
                  color="inherit"
                  onClick={handleAdminMenuOpen}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Admin
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAdminMenuClose}
                >
                  <MenuItem onClick={() => handleAdminNav("/admin")}>
                    Admin Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => handleAdminNav("/admin/templates")}>
                    Manage Templates
                  </MenuItem>
                  <MenuItem onClick={() => handleAdminNav("/admin/users")}>
                    Manage Users
                  </MenuItem>
                </Menu>
              </>
            )}
            <Button color="inherit" onClick={() => navigate("/audiences")}>
              Audiences
            </Button>
            <Button color="inherit" onClick={() => navigate("/campaigns")}>
              Campaigns
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
