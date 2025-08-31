import React from 'react';
import { Button, ButtonProps, useTheme } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  variant = 'contained',
  size = 'medium',
  startIcon,
  endIcon,
  sx,
  ...props 
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const getBackgroundGradient = () => {
    if (variant !== 'contained') return undefined;
    return {
      background: isDark
        ? 'linear-gradient(135deg, #7b1fa2 0%, #6B3CDA 100%)'
        : 'linear-gradient(135deg, #4c34d3 0%, #6B3CDA 100%)',
      '&:hover': {
        background: isDark
          ? 'linear-gradient(135deg, #6b1f92 0%, #5B2CCA 100%)'
          : 'linear-gradient(135deg, #3c24c3 0%, #5B2CCA 100%)',
      },
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          py: 0.75,
          px: 2,
          fontSize: '0.875rem',
        };
      case 'large':
        return {
          py: 1.75,
          px: 4,
          fontSize: '1.2rem',
        };
      default: // medium
        return {
          py: 1.25,
          px: 3,
          fontSize: '1rem',
        };
    }
  };

  const getVariantStyles = () => {
    const styles = {
      outlined: {
        borderColor: isDark ? 'rgba(123, 31, 162, 0.5)' : 'rgba(76, 52, 211, 0.5)',
        color: isDark ? '#f3e5f5' : '#4c34d3',
        '&:hover': {
          borderColor: isDark ? '#7b1fa2' : '#4c34d3',
          backgroundColor: isDark 
            ? 'rgba(123, 31, 162, 0.1)' 
            : 'rgba(76, 52, 211, 0.1)',
        },
      },
      text: {
        color: isDark ? '#f3e5f5' : '#4c34d3',
        '&:hover': {
          backgroundColor: isDark 
            ? 'rgba(123, 31, 162, 0.1)' 
            : 'rgba(76, 52, 211, 0.1)',
        },
      },
      contained: {
        ...getBackgroundGradient(),
      }
    };
    
    return styles[variant] || styles.contained;
  };

  return (
    <Button
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        ...getSizeStyles(),
        ...getVariantStyles(),
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(107, 60, 218, 0.3)',
          ...(getVariantStyles()['&:hover'] || {}),
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
