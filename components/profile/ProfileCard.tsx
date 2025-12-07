import { View, Text, StyleSheet } from 'react-native';
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
  onEdit: () => void;
}

export default function ProfileCard({
  name,
  isAnonymous,
  rating,
  gamesPlayed,
  wins,
  favoriteColor,
  theme,
  onEdit,
}: ProfileCardProps) {
  return (
    <Card>
      <Avatar name={name} size={80} style={styles.avatar} />
      
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>
        {isAnonymous ? 'Anonymous Player' : 'Registered Player'}
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
      </View>
      
      <View style={styles.preferences}>
        <Text style={styles.prefLabel}>
          Favorite Color: <Text style={styles.prefValue}>{favoriteColor}</Text>
        </Text>
        <Text style={styles.prefLabel}>
          Theme: <Text style={styles.prefValue}>{theme}</Text>
        </Text>
      </View>
      
      <Button 
        title="Edit Profile" 
        onPress={onEdit}
        style={styles.editButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  preferences: {
    marginBottom: 20,
    alignItems: 'center',
  },
  prefLabel: {
    fontSize: 16,
    color: '#333',
  },
  prefValue: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  editButton: {
    borderRadius: 25,
    paddingVertical: 12,
  },
});
