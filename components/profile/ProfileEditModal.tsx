import { View, Text, StyleSheet } from 'react-native';
import { useState, useCallback, memo, useMemo } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import OptionSelector from '../common/OptionSelector';

interface ProfileEditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => void;
  initialData: ProfileData;
}

export interface ProfileData {
  name: string;
  favoriteColor: 'white' | 'black' | 'random';
  theme: 'light' | 'dark' | 'auto';
}

function ProfileEditModal({ 
  visible, 
  onClose, 
  onSave, 
  initialData 
}: ProfileEditModalProps) {
  const [name, setName] = useState(initialData.name);
  const [favoriteColor, setFavoriteColor] = useState(initialData.favoriteColor);
  const [theme, setTheme] = useState(initialData.theme);

  const colorOptions = useMemo(() => [
    { value: 'white', label: 'White' },
    { value: 'black', label: 'Black' },
    { value: 'random', label: 'Random' },
  ], []);

  const themeOptions = useMemo(() => [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto' },
  ], []);

  const handleSave = useCallback(() => {
    onSave({ name, favoriteColor, theme });
  }, [name, favoriteColor, theme, onSave]);

  const handleColorSelect = useCallback((value: string) => {
    setFavoriteColor(value as any);
  }, []);

  const handleThemeSelect = useCallback((value: string) => {
    setTheme(value as any);
  }, []);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Text style={styles.title}>Edit Profile</Text>
      
      <Text style={styles.label}>Name</Text>
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />
      
      <Text style={styles.label}>Favorite Color</Text>
      <OptionSelector
        options={colorOptions}
        selected={favoriteColor}
        onSelect={handleColorSelect}
        style={styles.section}
      />
      
      <Text style={styles.label}>Theme</Text>
      <OptionSelector
        options={themeOptions}
        selected={theme}
        onSelect={handleThemeSelect}
        style={styles.section}
      />
      
      <View style={styles.buttons}>
        <Button 
          title="Cancel" 
          variant="outline" 
          onPress={onClose}
          style={styles.button}
        />
        <Button 
          title="Save" 
          onPress={handleSave}
          style={styles.button}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

export default memo(ProfileEditModal);
