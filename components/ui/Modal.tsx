import { Modal as RNModal, View, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode, memo } from 'react';
import { useTheme } from '../../common/styles/themes/useTheme';
import { LAYOUT, SPACING, RADIUS, SHADOW } from '../../constants';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: ViewStyle;
}

function Modal({ visible, onClose, children, contentStyle }: ModalProps) {
  const { theme } = useTheme();
  
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface }, contentStyle]}>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.XXL,
    borderRadius: RADIUS.XXXL,
    width: LAYOUT.MODAL_WIDTH,
    ...SHADOW.MEDIUM,
  },
});

export default memo(Modal);
