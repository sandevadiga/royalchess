import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [showColorModal, setShowColorModal] = useState(false);
  const [difficulty, setDifficulty] = useState(3);

  const handlePlayWithComputer = () => {
    setShowColorModal(true);
  };

  const selectColor = (color: string) => {
    setShowColorModal(false);
    const selectedColor = color === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : color;
    router.push(`/chess-game?color=${selectedColor}&difficulty=${difficulty}`);
  };

  const getDifficultyLabel = () => {
    const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
    return labels[difficulty - 1];
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePlayWithComputer}>
        <Text style={styles.buttonText}>Play with Computer</Text>
      </TouchableOpacity>

      <Modal visible={showColorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Your Team</Text>
            
            <TouchableOpacity style={[styles.colorButton, styles.whiteButton]} onPress={() => selectColor('white')}>
              <Text style={styles.colorButtonText}>Play as White</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.colorButton, styles.blackButton]} onPress={() => selectColor('black')}>
              <Text style={[styles.colorButtonText, styles.whiteText]}>Play as Black</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.colorButton, styles.randomButton]} onPress={() => selectColor('random')}>
              <Text style={styles.colorButtonText}>Random Color</Text>
            </TouchableOpacity>
            
            <View style={styles.difficultyContainer}>
              <Text style={styles.difficultyTitle}>Difficulty: {getDifficultyLabel()}</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={difficulty}
                onValueChange={setDifficulty}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#007AFF"
              />
            </View>
            
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowColorModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
    padding: 30,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  colorButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  whiteButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  blackButton: {
    backgroundColor: '#333',
  },
  randomButton: {
    backgroundColor: '#007AFF',
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  whiteText: {
    color: 'white',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
  difficultyContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});