import { ReactNode, memo } from 'react';
import { Modal as RNModal, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../common/styles/themes/useTheme';
import { RADIUS, SHADOW, SPACING } from '../../constants';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
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
    padding: SPACING.SM,
    borderRadius: RADIUS.XL,
    width: '95%' as const,
    ...SHADOW.MEDIUM,
  },
});

export default memo(Modal);
