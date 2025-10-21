import { memo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { shadows, spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  brightness: number;
  zoom: number;
  frozen: boolean;
  captureInProgress: boolean;
  onToggleFreeze: () => void;
  onIncreaseBrightness: () => void;
  onIncreaseZoom: () => void;
};

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const BottomToolbarComponent = ({
  brightness,
  zoom,
  frozen,
  captureInProgress,
  onToggleFreeze,
  onIncreaseBrightness,
  onIncreaseZoom
}: Props) => {
  const { theme } = useTheme();
  const brightnessLabel = `${clampValue(Math.round(brightness * 100), 30, 150)}%`;
  const zoomLabel = `${clampValue(Number(zoom.toFixed(1)), 1, 3)}x`;
  const primaryLabel = frozen ? '解冻' : captureInProgress ? '处理中…' : '拍照';

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.secondaryButton, styles.shadowed, { backgroundColor: theme.surface }]}
        onPress={onIncreaseBrightness}
      >
        <Text style={[styles.secondaryText, { color: theme.textSecondary }]}>亮度+</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          styles.shadowed,
          { backgroundColor: frozen ? theme.primary : theme.accent },
          pressed && styles.primaryButtonPressed,
          captureInProgress && styles.primaryButtonDisabled
        ]}
        onPress={onToggleFreeze}
        disabled={captureInProgress && !frozen}
      >
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </Pressable>
      <Pressable
        style={[styles.secondaryButton, styles.shadowed, { backgroundColor: theme.surface }]}
        onPress={onIncreaseZoom}
      >
        <Text style={[styles.secondaryText, { color: theme.textSecondary }]}>缩放+</Text>
      </Pressable>
      <View style={[styles.statusBar, { backgroundColor: theme.surface, shadowColor: theme.primary }]}>
        <Text style={[styles.statusText, { color: theme.textSecondary }]}>亮度 {brightnessLabel}</Text>
        <Text style={[styles.statusDivider, { color: theme.accent }]}>•</Text>
        <Text style={[styles.statusText, { color: theme.textSecondary }]}>缩放 {zoomLabel}</Text>
      </View>
    </View>
  );
};

export const BottomToolbar = memo(BottomToolbarComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(1),
    paddingVertical: spacing(1.5)
  },
  shadowed: {
    borderRadius: 999,
    ...shadows.soft
  },
  primaryButton: {
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(4),
    borderRadius: 999,
    minWidth: spacing(12)
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center'
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.95 }]
  },
  primaryButtonDisabled: {
    opacity: 0.8
  },
  secondaryButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(2.5),
    borderRadius: 999
  },
  secondaryText: {
    fontWeight: '600'
  },
  statusBar: {
    marginTop: spacing(1),
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(3),
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(0.5),
    ...shadows.soft
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  statusDivider: {
    fontSize: 12
  }
});
