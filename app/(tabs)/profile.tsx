import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { updateProfile, updatePreferences } from '../../services/user/userSlice';
import { toggleTheme, updateTheme } from '../../services/theme/themeSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const theme = useAppSelector(state => state.theme);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.profile.name);
  const [editColor, setEditColor] = useState(user.preferences.favoriteColor);
  const [editTheme, setEditTheme] = useState(theme.current.mode);

  const handleSave = () => {
    dispatch(updateProfile({ name: editName }));
    dispatch(updatePreferences({ favoriteColor: editColor }));
    dispatch(updateTheme({ mode: editTheme }));
    setShowEditModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(() => {
              try {
                return user.profile.name && user.profile.name.length > 0 
                  ? user.profile.name.charAt(0).toUpperCase() 
                  : 'A';
              } catch (error) {
                console.warn('Error generating avatar text:', error);
                return 'A';
              }
            })()}
          </Text>
        </View>
        
        <Text style={styles.name}>{user.profile.name}</Text>
        <Text style={styles.status}>{user.profile.isAnonymous ? 'Anonymous Player' : 'Registered Player'}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.rating.current}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.statistics.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.statistics.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
        </View>
        
        <View style={styles.preferences}>
          <Text style={styles.prefLabel}>Favorite Color: <Text style={styles.prefValue}>{user.preferences.favoriteColor}</Text></Text>
          <Text style={styles.prefLabel}>Theme: <Text style={styles.prefValue}>{theme.current.mode}</Text></Text>
        </View>
        
        <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
            />
            
            <Text style={styles.inputLabel}>Favorite Color</Text>
            <View style={styles.colorRow}>
              {['white', 'black', 'random'].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, editColor === color && styles.selectedColor]}
                  onPress={() => setEditColor(color as any)}
                >
                  <Text style={[styles.colorText, editColor === color && styles.selectedColorText]}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.inputLabel}>Theme</Text>
            <View style={styles.colorRow}>
              {['light', 'dark', 'auto'].map((themeMode) => (
                <TouchableOpacity
                  key={themeMode}
                  style={[styles.colorOption, editTheme === themeMode && styles.selectedColor]}
                  onPress={() => setEditTheme(themeMode as any)}
                >
                  <Text style={[styles.colorText, editTheme === themeMode && styles.selectedColorText]}>
                    {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
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
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  colorOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedColor: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  colorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedColorText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});