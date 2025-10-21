import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { shadows, spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

const AI_OPTIONS = [
  '肤质检测',
  '妆容顾问',
  '虚拟试妆',
  'AI日志'
];

type Props = {
  visible: boolean;
  animation: Animated.Value;
  onClose: () => void;
};

const AIMenuComponent = ({ visible, animation, onClose }: Props) => {
  const { theme } = useTheme();
  if (!visible) {
    return null;
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.surface, shadowColor: theme.primary },
          {
            opacity: animation,
            transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }]
          }
        ]}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>AI 助手</Text>
        {AI_OPTIONS.map((option) => (
          <Pressable key={option} style={[styles.option, { backgroundColor: theme.surfaceVariant }]}
          >
            <Text style={[styles.optionText, { color: theme.textSecondary }]}>{option}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </Pressable>
  );
};

export const AIMenu = memo(AIMenuComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing(2),
    bottom: spacing(16),
    padding: spacing(2),
    borderRadius: spacing(2),
    gap: spacing(1),
    ...shadows.floating
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing(0.5)
  },
  option: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2),
    borderRadius: spacing(1.5)
  },
  optionText: {
    fontWeight: '600'
  }
});
