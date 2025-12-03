import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const [showColorModal, setShowColorModal] = useState(false);
  const [difficulty, setDifficulty] = useState(3);
  const [selectedColor, setSelectedColor] = useState('white');
  const [timeControl, setTimeControl] = useState('blitz');

  const handlePlayWithComputer = () => {
    setShowColorModal(true);
  };

  const startGame = () => {
    setShowColorModal(false);
    const finalColor = selectedColor === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : selectedColor;
    router.push(`/chess-game?color=${finalColor}&difficulty=${difficulty}&timeControl=${timeControl}`);
  };

  const getDifficultyLabel = () => {
    try {
      const labels = ['Beginner', 'Easy', 'Medium', 'Hard', 'Expert'];
      const index = difficulty - 1;
      if (index >= 0 && index < labels.length) {
        return labels[index];
      }
      return 'Medium'; // Default fallback
    } catch (error) {
      console.warn('Error getting difficulty label:', error);
      return 'Medium';
    }
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
            
            <View style={styles.colorRow}>
              <TouchableOpacity 
                style={[styles.colorOption, selectedColor === 'white' && styles.selectedOption]} 
                onPress={() => setSelectedColor('white')}
              >
                <Text style={[styles.colorOptionText, selectedColor === 'white' && styles.selectedText]}>White</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.colorOption, selectedColor === 'black' && styles.selectedOption]} 
                onPress={() => setSelectedColor('black')}
              >
                <Text style={[styles.colorOptionText, selectedColor === 'black' && styles.selectedText]}>Black</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.colorOption, selectedColor === 'random' && styles.selectedOption]} 
                onPress={() => setSelectedColor('random')}
              >
                <Text style={[styles.colorOptionText, selectedColor === 'random' && styles.selectedText]}>Random</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timeControlContainer}>
              <Text style={styles.sectionTitle}>Time Control</Text>
              <View style={styles.timeRow}>
                <TouchableOpacity 
                  style={[styles.timeOption, timeControl === 'blitz' && styles.selectedOption]} 
                  onPress={() => setTimeControl('blitz')}
                >
                  <Text style={[styles.timeOptionText, timeControl === 'blitz' && styles.selectedText]}>Blitz 5min</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.timeOption, timeControl === 'rapid' && styles.selectedOption]} 
                  onPress={() => setTimeControl('rapid')}
                >
                  <Text style={[styles.timeOptionText, timeControl === 'rapid' && styles.selectedText]}>Rapid 10min</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeRow}>
                <TouchableOpacity 
                  style={[styles.timeOption, timeControl === 'classical' && styles.selectedOption]} 
                  onPress={() => setTimeControl('classical')}
                >
                  <Text style={[styles.timeOptionText, timeControl === 'classical' && styles.selectedText]}>Classical 30min</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.timeOption, timeControl === 'timeless' && styles.selectedOption]} 
                  onPress={() => setTimeControl('timeless')}
                >
                  <Text style={[styles.timeOptionText, timeControl === 'timeless' && styles.selectedText]}>Timeless</Text>
                </TouchableOpacity>
              </View>
            </View>
            
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
            
            <TouchableOpacity style={styles.playButton} onPress={startGame}>
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
            
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
    padding: 25,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
  },
  colorOption: {
    flex: 1,
    padding: 15,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
    transform: [{ scale: 1.05 }],
  },
  colorOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  selectedText: {
    color: 'white',
  },
  playButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  playButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  timeControlContainer: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeOption: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  timeOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  difficultyContainer: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
  },
  difficultyTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});