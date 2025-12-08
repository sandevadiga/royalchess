import { View, Text, StyleSheet } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
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

  const handleOpenModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const handleSave = useCallback((data: ProfileData) => {
    dispatch(updateProfile({ name: data.name }));
    dispatch(updatePreferences({ 
      favoriteColor: data.favoriteColor,
      boardColorScheme: data.boardColorScheme 
    }));
    dispatch(updateTheme({ mode: data.theme }));
    setShowEditModal(false);
  }, [dispatch]);

  const initialData = useMemo(() => ({
    name: user.profile.name,
    favoriteColor: user.preferences.favoriteColor,
    theme: theme.current.mode,
    boardColorScheme: user.preferences.boardColorScheme,
  }), [user.profile.name, user.preferences.favoriteColor, theme.current.mode, user.preferences.boardColorScheme]);

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
        computerDifficulty={user.computerDifficulty}
        onEdit={handleOpenModal}
      />

      <ProfileEditModal
        visible={showEditModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={initialData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
});