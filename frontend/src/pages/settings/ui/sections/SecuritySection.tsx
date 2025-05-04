'use client';

import { useState } from 'react';
import { FiSave, FiShield, FiSmartphone, FiTrash2 } from 'react-icons/fi';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Checkbox } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';

interface SecuritySectionProps {
  locale: Locale;
}

export const SecuritySection = ({ locale }: SecuritySectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Mock active sessions data
  const activeSessions = [
    {
      id: '1',
      device: 'MacBook Pro',
      location: 'New York, USA',
      lastActive: 'Just now',
      isCurrent: true
    },
    {
      id: '2',
      device: 'iPhone 13',
      location: 'New York, USA',
      lastActive: '2 hours ago',
      isCurrent: false
    },
    {
      id: '3',
      device: 'Chrome - Windows',
      location: 'Boston, USA',
      lastActive: '3 days ago',
      isCurrent: false
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success notification
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Here you would typically show a setup flow for 2FA
  };

  const handleSessionTerminate = (sessionId: string) => {
    // Handle terminating a session
    console.log('Terminate session:', sessionId);
    // You would typically make an API call to invalidate the session
  };

  // Password strength indicator logic
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength(passwordData.newPassword);
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = [
      'bg-error', 
      'bg-warning', 
      'bg-yellow-500', 
      'bg-success', 
      'bg-success'
    ];
    
    if (!passwordData.newPassword) return null;
    
    return (
      <div className="mt-1">
        <div className="flex gap-1 mb-1 h-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-full flex-1 rounded-full ${
                level <= strength ? colors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Password strength: {strength > 0 ? labels[strength - 1] : 'Too weak'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Change Password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input 
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
            />
            
            <Input 
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handleInputChange}
              placeholder="Enter your new password"
              helperText="Use 8+ characters with a mix of letters, numbers & symbols"
            />
            {renderPasswordStrength()}
            
            <Input 
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your new password"
              error={
                passwordData.confirmPassword && 
                passwordData.newPassword !== passwordData.confirmPassword 
                  ? "Passwords don't match" 
                  : undefined
              }
            />
          </form>
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button 
            variant="primary" 
            leftIcon={<FiSave />}
            isLoading={isLoading}
            onClick={handlePasswordSubmit}
            disabled={
              !passwordData.currentPassword || 
              !passwordData.newPassword || 
              !passwordData.confirmPassword ||
              passwordData.newPassword !== passwordData.confirmPassword ||
              getPasswordStrength(passwordData.newPassword) < 3
            }
          >
            Update Password
          </Button>
        </CardFooter>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
            <FiShield className="text-primary-500 w-5 h-5" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enhance your account security</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Two-factor authentication adds an extra layer of security to your account
              </p>
            </div>
            
            <Checkbox
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
          </div>
          
          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-md border border-primary-200 dark:border-primary-800">
              <div className="flex items-center">
                <FiSmartphone className="text-primary-500 w-5 h-5 mr-2" />
                <span className="font-medium">Two-factor authentication is enabled</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is now more secure with an additional layer of protection
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Active Sessions</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div 
                key={session.id} 
                className="flex justify-between items-center p-3 border border-border rounded-md"
              >
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{session.device}</span>
                    {session.isCurrent && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{session.location}</span>
                    <span className="mx-2">•</span>
                    <span>{session.lastActive}</span>
                  </div>
                </div>
                
                {!session.isCurrent && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    leftIcon={<FiTrash2 className="text-error" />}
                    onClick={() => handleSessionTerminate(session.id)}
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => activeSessions.forEach(s => !s.isCurrent && handleSessionTerminate(s.id))}
          >
            Log out from all other devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}; 