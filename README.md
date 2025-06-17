# Integrantes

- Eduardo Gomes Pinho Junior - 97919
- Gustavo Ferreira Lopes - 98887
- Pedro Henrique Salvitti - 88166
- Enzo de Oliveira Cunha - 550985

# XP Assessor Virtual

A React Native mobile application built with Expo and TypeScript that provides personalized investment portfolio recommendations using AI-powered explanations.

## Features

- **Authentication**: Secure login and signup with AsyncStorage persistence
- **Dashboard**: Portfolio overview with performance metrics and gamification elements
- **AI Recommendations**: Personalized portfolio suggestions with XAI (Explainable AI) reasoning
- **Portfolio Management**: Detailed portfolio view with asset allocation charts
- **Gamification**: Badges, levels, and achievements to engage users
- **Profile Management**: User profile and investment goals tracking
- **Dark Mode**: Automatic theme switching based on system preferences

## Tech Stack

- **React Native 0.79** with Expo SDK 53
- **TypeScript** for type safety
- **Expo Router** for navigation
- **Victory Native** for charts and data visualization
- **AsyncStorage** for local data persistence
- **Jest & React Testing Library** for unit testing
- **Detox** for E2E testing
- **ESLint & Prettier** for code quality

## Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── recommendations/   # Portfolio recommendations
│   └── portfolio/         # Portfolio detail screens
├── assets/
│   └── data/              # Mock JSON data files
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Data service layer
│   └── theme/             # Theme configuration
├── __tests__/             # Unit tests
└── e2e/                   # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd xp-assessor-virtual
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Run on your preferred platform:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

### Demo Credentials

Use these credentials to test the app:

- **Email**: demo@xp.com
- **Password**: password123

## Data Architecture

The app uses a mock data service (`DataService.ts`) that simulates API calls by reading from local JSON files. This allows for easy development and testing without requiring a backend.

### Mock Data Files

- `users.json` - User authentication data
- `profiles.json` - User investment profiles and goals
- `recommendations.json` - AI-generated portfolio recommendations
- `portfolio.json` - User portfolio holdings and performance
- `gamification.json` - User levels, badges, and achievements
- `notifications.json` - System notifications

### Replacing with Real APIs

To connect to real APIs, simply replace the `DataService` methods with actual HTTP calls:

```typescript
// Before (mock)
async getUser(email: string, password: string): Promise<User | null> {
  await simulateLatency();
  const user = usersData.find(u => u.email === email && u.password === password);
  return user || null;
}

// After (real API)
async getUser(email: string, password: string): Promise<User | null> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.ok ? await response.json() : null;
}
```

## Testing

### Unit Tests

Run unit tests with Jest:

```bash
npm test
# or
yarn test
```

### E2E Tests

1. Build the app for testing:

```bash
npm run test:e2e:build
```

2. Run E2E tests:

```bash
npm run test:e2e
```

## Building for Production

### Development Build

```bash
expo prebuild
```

### Production Build

For iOS:

```bash
expo build:ios
```

For Android:

```bash
expo build:android
```

## Key Features Explained

### XAI (Explainable AI) Recommendations

The app provides transparent investment recommendations with:

- **Reasoning**: Clear explanation of why a portfolio is recommended
- **Factors**: List of user profile factors considered
- **Confidence Score**: AI confidence level in the recommendation

### Gamification System

Engages users through:

- **Levels**: User progression based on investment activities
- **Badges**: Achievement rewards for milestones
- **Points**: Scoring system for various actions
- **Progress Tracking**: Visual progress indicators

### Theme System

Supports both light and dark modes with:

- Automatic system preference detection
- Consistent color palette across all screens
- Accessible contrast ratios
- Smooth theme transitions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Code Quality

The project uses:

- **ESLint** with Airbnb configuration
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **TypeScript** for type checking

Run linting:

```bash
npm run lint
```

## License
