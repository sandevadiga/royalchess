import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { memo } from 'react';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

interface ProfileCardProps {
  name: string;
  isAnonymous: boolean;
  rating: number;
  gamesPlayed: number;
  wins: number;
  favoriteColor: string;
  theme: string;
  computerDifficulty?: number;
  onEdit: () => void;
}

function ProfileCard({
  name,
  isAnonymous,
  rating,
  gamesPlayed,
  wins,
  favoriteColor,
  theme,
  computerDifficulty,
  onEdit,
}: ProfileCardProps) {
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar name={name} size={70} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {isAnonymous ? '👤 Anonymous' : '✓ Verified'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onEdit} style={styles.editIcon}>
          <Text style={styles.editIconText}>✏️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, styles.ratingCard]}>
          <Text style={styles.statValue}>{rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{winRate}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
        </View>
      </View>
      
      {computerDifficulty !== undefined && (
        <View style={styles.aiCard}>
          <Text style={styles.aiIcon}>🤖</Text>
          <View style={styles.aiInfo}>
            <Text style={styles.aiLabel}>AI Difficulty</Text>
            <Text style={styles.aiValue}>{computerDifficulty} ELO</Text>
          </View>
        </View>
      )}
      
      <View style={styles.prefsGrid}>
        <View style={styles.prefCard}>
          <Text style={styles.prefIcon}>♟️</Text>
          <Text style={styles.prefLabel}>Color</Text>
          <Text style={styles.prefValue}>{favoriteColor}</Text>
        </View>
        <View style={styles.prefCard}>
          <Text style={styles.prefIcon}>{theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '🔄'}</Text>
          <Text style={styles.prefLabel}>Theme</Text>
          <Text style={styles.prefValue}>{theme}</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  avatar: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  headerInfo: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.3,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  editIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ratingCard: {
    backgroundColor: '#007AFF15',
    borderColor: '#007AFF30',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B3515',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF6B3530',
    gap: 12,
  },
  aiIcon: {
    fontSize: 28,
  },
  aiInfo: {
    flex: 1,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  aiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
  prefsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  prefCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  prefIcon: {
    fontSize: 24,
  },
  prefLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  prefValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default memo(ProfileCard);
