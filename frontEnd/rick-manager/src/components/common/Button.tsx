import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${props => 
    props.size === 'small' ? '8px 16px' :
    props.size === 'large' ? '16px 32px' : '12px 24px'
  };
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: ${props => 
    props.size === 'small' ? '14px' :
    props.size === 'large' ? '18px' : '16px'
  };
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${props => 
    props.variant === 'primary' ? '#667eea' :
    props.variant === 'danger' ? '#dc3545' : '#f8f9fa'
  };
  
  color: ${props => 
    props.variant === 'primary' ? 'white' :
    props.variant === 'danger' ? 'white' : '#333'
  };
  
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
  }
  
  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};