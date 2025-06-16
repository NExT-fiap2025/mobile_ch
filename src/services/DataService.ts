import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data imports
import usersData from '../../assets/data/users.json';
import profilesData from '../../assets/data/profiles.json';
import recommendationsData from '../../assets/data/recommendations.json';
import portfolioData from '../../assets/data/portfolio.json';
import gamificationData from '../../assets/data/gamification.json';
import notificationsData from '../../assets/data/notifications.json';

// Types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  token: string;
}

export interface Profile {
  id: string;
  userId: string;
  suitability: {
    riskProfile: string;
    investmentExperience: string;
    timeHorizon: string;
    investmentGoals: string[];
    monthlyIncome: number;
    currentInvestments: number;
  };
  goals: Goal[];
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  priority: string;
}

export interface Portfolio {
  id: string;
  name: string;
  riskLevel: string;
  expectedReturn: string;
  allocation: Record<string, number>;
  xaiExplanation: {
    reasoning: string;
    factors: string[];
    confidence: number;
  };
}

export interface UserPortfolio {
  id: string;
  userId: string;
  selectedPortfolioId: string;
  totalValue: number;
  performance: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  holdings: Holding[];
}

export interface Holding {
  id: string;
  name: string;
  type: string;
  value: number;
  percentage: number;
  performance: number;
}

export interface Gamification {
  id: string;
  userId: string;
  level: number;
  totalPoints: number;
  pointsToNextLevel: number;
  badges: Badge[];
  achievements: Achievement[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  progress: number;
  target: number;
  description: string;
  reward: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// Simulate network latency
const simulateLatency = () => new Promise(resolve => setTimeout(resolve, 300));

class DataService {
  // Authentication
  async getUser(email: string, password: string): Promise<User | null> {
    await simulateLatency();
    
    const user = usersData.find(u => u.email === email && u.password === password);
    return user || null;
  }

  async createUser(email: string, password: string, name: string): Promise<User> {
    await simulateLatency();
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      token: `token-${Date.now()}`
    };
    
    // In a real app, this would be saved to the backend
    return newUser;
  }

  // Profile
  async getProfile(userId: string): Promise<Profile | null> {
    await simulateLatency();
    
    const profile = profilesData.find(p => p.userId === userId);
    return profile || null;
  }

  async updateProfile(userId: string, profileData: Partial<Profile>): Promise<Profile> {
    await simulateLatency();
    
    // Mock update - in real app, this would update the backend
    const existingProfile = profilesData.find(p => p.userId === userId);
    const updatedProfile = { ...existingProfile, ...profileData } as Profile;
    
    return updatedProfile;
  }

  // Recommendations
  async getRecommendations(userId: string): Promise<Portfolio[]> {
    await simulateLatency();
    
    const recommendation = recommendationsData.find(r => r.userId === userId);
    return recommendation?.portfolios || [];
  }

  // Portfolio
  async getPortfolio(userId: string): Promise<UserPortfolio | null> {
    await simulateLatency();
    
    const portfolio = portfolioData.find(p => p.userId === userId);
    return portfolio || null;
  }

  async acceptPortfolio(userId: string, portfolioId: string): Promise<boolean> {
    await simulateLatency();
    
    // Store the accepted portfolio locally
    await AsyncStorage.setItem(
      `user_portfolio_${userId}`,
      JSON.stringify({
        selectedPortfolioId: portfolioId,
        acceptedAt: new Date().toISOString()
      })
    );
    
    return true;
  }

  // Gamification
  async getGamification(userId: string): Promise<Gamification | null> {
    await simulateLatency();
    
    const gamification = gamificationData.find(g => g.userId === userId);
    return gamification || null;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await simulateLatency();
    
    return notificationsData.filter(n => n.userId === userId);
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    await simulateLatency();
    
    // Mock implementation - would update backend in real app
    return true;
  }
}

export default new DataService();