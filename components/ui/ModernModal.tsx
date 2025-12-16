/**
 * ModernModal - Refactored Modal with Glass Effect
 */

import { memo, ReactNode, useEffect } from 'react';
import { Modal as RNModal, StyleSheet, View, Pressable, Animated, ViewStyle } from 'react-native';
import { useModernTheme } from '../../common/styles/themes/useModernTheme';

interface ModernModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  contentStyle?: ViewStyle;
  glass?: boolean;
  dismissable?: boolean;
  position?: 'center' | 'bottom';
}

function ModernModal({
  visible,
  onClose,
  children,
  contentStyle,
  glass = false,
  dismissable = true,
  position = 'center',
}: ModernModalProps) {
  const { theme } = useModernTheme();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(position === 'bottom' ? 100 : 0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: theme.animation.duration.normal,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: theme.animation.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: position === 'bottom' ? 100 : 0,
          duration: theme.animation.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={dismissable ? onClose : undefined}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            backgroundColor: theme.colors.surfaceOverlay,
            opacity: fadeAnim,
          },
        ]}
      >
        <Pressable
          style={styles.backdrop}
          onPress={dismissable ? onClose : undefined}
        />

        <Animated.View
          style={[
            styles.container,
            position === 'bottom' && styles.bottomContainer,
            {
              transform: [
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor: glass ? theme.colors.glassLight : theme.colors.surface,
                borderRadius: position === 'bottom' ? theme.radius.xxl : theme.radius.xl,
                padding: theme.spacing.xl,
                borderWidth: glass ? 1 : 0,
                borderColor: glass ? theme.colors.glassLight : 'transparent',
                ...theme.shadows.xl,
              },
              position === 'bottom' && styles.bottomContent,
              contentStyle,
            ]}
          >
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    width: '90%',
    maxWidth: 500,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: undefined,
  },
  content: {
    width: '100%',
  },
  bottomContent: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default memo(ModernModal);
