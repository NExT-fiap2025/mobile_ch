import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Moon, Sun, Bell } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { useTheme } from '@/src/hooks/useTheme';
import DataService, { Profile } from '@/src/services/DataService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [darkMode, setDarkMode] = useState(theme.isDark);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const profileData = await DataService.getProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja sair da sua conta?')) {
        logout().then(() => router.replace('/auth'));
      }
    } else {
      Alert.alert('Sair', 'Tem certeza que deseja sair da sua conta?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]);
    }
  };

  const getRiskLevelColor = (riskProfile: string) => {
    switch (riskProfile.toLowerCase()) {
      case 'conservador':
        return theme.colors.success;
      case 'moderado':
        return theme.colors.warning;
      case 'agressivo':
        return theme.colors.error;
      default:
        return theme.colors.info;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Perfil
          </Text>
          <TouchableOpacity>
            <Settings size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              <User size={32} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user?.name}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {user?.email}
              </Text>
            </View>
          </View>
        </Card>

        {/* Profile Info */}
        {profile && (
          <Card style={styles.profileCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Perfil de Investimento
            </Text>
            {/* risk, experience, horizon, income, investments */}
            <View style={styles.profileItem}>
              <Text
                style={[
                  styles.profileLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Perfil de Risco
              </Text>
              <View style={styles.profileValueContainer}>
                <View
                  style={[
                    styles.riskIndicator,
                    {
                      backgroundColor: getRiskLevelColor(
                        profile.suitability.riskProfile,
                      ),
                    },
                  ]}
                />
                <Text
                  style={[styles.profileValue, { color: theme.colors.text }]}
                >
                  {profile.suitability.riskProfile}
                </Text>
              </View>
            </View>
            <View style={styles.profileItem}>
              <Text
                style={[
                  styles.profileLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Experiência
              </Text>
              <Text style={[styles.profileValue, { color: theme.colors.text }]}>
                {profile.suitability.investmentExperience}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text
                style={[
                  styles.profileLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Horizonte Temporal
              </Text>
              <Text style={[styles.profileValue, { color: theme.colors.text }]}>
                {profile.suitability.timeHorizon}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text
                style={[
                  styles.profileLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Renda Mensal
              </Text>
              <Text style={[styles.profileValue, { color: theme.colors.text }]}>
                R$ {profile.suitability.monthlyIncome.toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.profileItem}>
              <Text
                style={[
                  styles.profileLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Investimentos Atuais
              </Text>
              <Text style={[styles.profileValue, { color: theme.colors.text }]}>
                R${' '}
                {profile.suitability.currentInvestments.toLocaleString('pt-BR')}
              </Text>
            </View>
          </Card>
        )}

        {/* Goals */}
        {profile?.goals?.map((goal) => (
          <Card key={goal.id} style={styles.goalsCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Objetivos de Investimento
            </Text>
            <View style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={[styles.goalName, { color: theme.colors.text }]}>
                  {goal.name}
                </Text>
                <Text
                  style={[
                    styles.goalPriority,
                    {
                      color:
                        goal.priority === 'alta'
                          ? theme.colors.error
                          : theme.colors.warning,
                    },
                  ]}
                >
                  {goal.priority}
                </Text>
              </View>
              <Text
                style={[
                  styles.goalAmount,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Meta: R$ {goal.targetAmount.toLocaleString('pt-BR')}
              </Text>
              <Text
                style={[styles.goalDate, { color: theme.colors.textSecondary }]}
              >
                Prazo: {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </Card>
        ))}

        {/* Settings */}
        <Card style={styles.settingsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Configurações
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {theme.isDark ? (
                <Moon size={20} color={theme.colors.text} />
              ) : (
                <Sun size={20} color={theme.colors.text} />
              )}
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Modo Escuro
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Notificações
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Sair da Conta"
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
          textStyle={{ color: theme.colors.error }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userCard: {
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  profileCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileLabel: {
    fontSize: 14,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  profileValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalsCard: {
    marginBottom: 20,
  },
  goalItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalPriority: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  goalAmount: {
    fontSize: 14,
    marginBottom: 4,
  },
  goalDate: {
    fontSize: 14,
  },
  settingsCard: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginBottom: 24,
  },
});
