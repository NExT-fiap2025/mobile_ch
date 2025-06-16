import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../app/(tabs)/index';
import { AuthProvider } from '../src/context/AuthContext';

// Mock the DataService
jest.mock('../src/services/DataService', () => ({
  __esModule: true,
  default: {
    getPortfolio: jest.fn().mockResolvedValue({
      id: 'test-portfolio',
      userId: 'test-user',
      totalValue: 50000,
      performance: {
        daily: 1.2,
        monthly: 2.8,
        yearly: 12.5,
      },
      holdings: [],
    }),
    getGamification: jest.fn().mockResolvedValue({
      id: 'test-gamification',
      userId: 'test-user',
      level: 3,
      totalPoints: 2850,
      pointsToNextLevel: 1150,
      badges: [],
      achievements: [],
    }),
  },
}));

// Mock the auth context
jest.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: {
      id: 'test-user',
      name: 'Test User',
      email: 'test@example.com',
    },
    logout: jest.fn(),
  }),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

describe('DashboardScreen', () => {
  it('renders dashboard and shows balance', async () => {
    const { getByText } = render(<DashboardScreen />);
    
    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('R$ 50.000,00')).toBeTruthy();
    });
  });
});