import { View, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { updateProfile, updatePreferences } from '../../services/user/userSlice';
import { updateTheme } from '../../services/theme/themeSlice';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileEditModal, { ProfileData } from '../../components/profile/ProfileEditModal';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const theme = useAppSelector(state => state.theme);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSave = (data: ProfileData) => {
    dispatch(updateProfile({ name: data.name }));
    dispatch(updatePreferences({ favoriteColor: data.favoriteColor }));
    dispatch(updateTheme({ mode: data.theme }));
    setShowEditModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <ProfileCard
        name={user.profile.name}
        isAnonymous={user.profile.isAnonymous}
        rating={user.rating.current}
        gamesPlayed={user.statistics.gamesPlayed}
        wins={user.statistics.wins}
        favoriteColor={user.preferences.favoriteColor}
        theme={theme.current.mode}
        onEdit={() => setShowEditModal(true)}
      />

      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        initialData={{
          name: user.profile.name,
          favoriteColor: user.preferences.favoriteColor,
          theme: theme.current.mode,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});