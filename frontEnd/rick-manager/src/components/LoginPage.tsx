import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const FormContainer = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-bottom: 32px;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  z-index: 10;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
`;

const SwitchText = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const SwitchButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: 16px;
`;

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in for the Rick & Morty Hauffe experience</Subtitle>

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />
          
          <PasswordContainer>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </PasswordToggle>
          </PasswordContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            type="submit"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <SwitchText>
          <span style={{ color: '#666' }}>Don't have an account? </span>
          <SwitchButton onClick={onSwitchToRegister}>
            Sign up
          </SwitchButton>
        </SwitchText>
      </FormContainer>
    </PageContainer>
  );
};