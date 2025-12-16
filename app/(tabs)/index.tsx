import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState, useCallback } from 'react';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';
import ModernButton from '../../components/ui/ModernButton';
import ModernCard from '../../components/ui/ModernCard';
import Surface from '../../components/ui/Surface';
import Badge from '../../components/ui/Badge';
import ModernGameSetupModal, { GameConfig } from '../../components/game/ModernGameSetupModal';
import { useAppSelector } from '../../services/hooks';

export default function HomeScreen() {
  const { theme } = useModernTheme();
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector(state => state.user);

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleStartGame = useCallback((config: GameConfig) => {
    setShowModal(false);
    const finalColor = config.color === 'random'
      ? (Math.random() > 0.5 ? 'white' : 'black')
      : config.color;
    router.push(`/chess-game?color=${finalColor}&difficulty=${config.difficulty}&timeControl=${config.timeControl}&undoEnabled=${config.undoEnabled}`);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.header, { marginBottom: theme.spacing.xxl }]}>
        <Text style={[
          styles.title,
          {
            fontSize: theme.typography.fontSize.huge,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.xs,
          }
        ]}>
          Royal Chess
        </Text>
        <Text style={[
          styles.subtitle,
          {
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.textSecondary,
          }
        ]}>
          Master the game, one move at a time
        </Text>
      </View>

      <Surface
        glass={true}
        elevation={2}
        padding={theme.spacing.xxl}
        style={{ marginBottom: theme.spacing.lg }}
      >
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[
              styles.statValue,
              {
                fontSize: theme.typography.fontSize.xxl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.textPrimary,
              }
            ]}>
              {user.rating.current}
            </Text>
            <Text style={[
              styles.statLabel,
              {
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }
            ]}>
              Rating
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={[
              styles.statValue,
              {
                fontSize: theme.typography.fontSize.xxl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.textPrimary,
              }
            ]}>
              {user.statistics.gamesPlayed}
            </Text>
            <Text style={[
              styles.statLabel,
              {
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }
            ]}>
              Games
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={[
              styles.statValue,
              {
                fontSize: theme.typography.fontSize.xxl,
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.success,
              }
            ]}>
              {user.statistics.wins}
            </Text>
            <Text style={[
              styles.statLabel,
              {
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }
            ]}>
              Wins
            </Text>
          </View>
        </View>
      </Surface>

      <ModernCard variant="elevated" padding="lg" style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[
          styles.cardTitle,
          {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
          }
        ]}>
          Quick Play
        </Text>
        <Text style={[
          styles.cardDescription,
          {
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.lg,
          }
        ]}>
          Challenge the computer and improve your skills
        </Text>
        <ModernButton onPress={handleOpenModal} size="lg" fullWidth>
          Play vs Computer
        </ModernButton>
      </ModernCard>

      <View style={{ gap: theme.spacing.md }}>
        <ModernCard variant="outlined" padding="lg" onPress={() => {}}>
          <View style={styles.featureCard}>
            <View style={{ flex: 1 }}>
              <Text style={[
                styles.featureTitle,
                {
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textPrimary,
                  marginBottom: theme.spacing.xxs,
                }
              ]}>
                Multiplayer
              </Text>
              <Text style={[
                styles.featureDescription,
                {
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                }
              ]}>
                Play against friends online
              </Text>
            </View>
            <Badge variant="info" size="sm">Coming Soon</Badge>
          </View>
        </ModernCard>

        <ModernCard variant="outlined" padding="lg" onPress={() => router.push('/puzzles')}>
          <View style={styles.featureCard}>
            <View style={{ flex: 1 }}>
              <Text style={[
                styles.featureTitle,
                {
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.textPrimary,
                  marginBottom: theme.spacing.xxs,
                }
              ]}>
                Chess Puzzles
              </Text>
              <Text style={[
                styles.featureDescription,
                {
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.textSecondary,
                }
              ]}>
                Train your tactical skills
              </Text>
            </View>
            <Badge variant="warning" size="sm">Coming Soon</Badge>
          </View>
        </ModernCard>
      </View>

      <ModernGameSetupModal
        visible={showModal}
        onClose={handleCloseModal}
        onStartGame={handleStartGame}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
  },
  title: {},
  subtitle: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {},
  statLabel: {},
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {},
  cardDescription: {},
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureTitle: {},
  featureDescription: {},
});