import React from 'react';
import styled from 'styled-components';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const StyledInput = styled.input<{ hasIcon: boolean }>`
  width: 100%;
  padding: ${props => props.hasIcon ? '12px 12px 12px 44px' : '12px'};
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #667eea;
  }
  
  &:disabled {
    background-color: #f8f9fa;
    opacity: 0.6;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

export const Input: React.FC<InputProps> = ({ icon: Icon, ...props }) => {
  return (
    <InputContainer>
      {Icon && (
        <IconWrapper>
          <Icon size={20} />
        </IconWrapper>
      )}
      <StyledInput hasIcon={!!Icon} {...props} />
    </InputContainer>
  );
};