import { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

const MENU_ITEMS = [
  '镜像翻转',
  '屏幕补光',
  '主题配色',
  '帮助与反馈'
];

type Props = {
  visible: boolean;
  animation: Animated.Value;
  onClose: () => void;
};

const BottomSheetMenuComponent = ({ visible, animation, onClose }: Props) => {
  const { theme } = useTheme();
  if (!visible) {
    return null;
  }

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: theme.surface },
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [260, 0] })
              }
            ]
          }
        ]}
      >
        <View style={[styles.grabber, { backgroundColor: theme.surfaceVariant }]} />
        {MENU_ITEMS.map((item) => (
          <Pressable key={item} style={[styles.item, { backgroundColor: theme.surfaceVariant }]}>
            <Text style={[styles.itemText, { color: theme.textPrimary }]}>{item}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </Pressable>
  );
};

export const BottomSheetMenu = memo(BottomSheetMenuComponent);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: spacing(3),
    borderTopRightRadius: spacing(3),
    paddingBottom: spacing(4),
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1.5),
    gap: spacing(1.5)
  },
  grabber: {
    alignSelf: 'center',
    width: spacing(4),
    height: 4,
    borderRadius: 999,
    marginBottom: spacing(1)
  },
  item: {
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    borderRadius: spacing(2)
  },
  itemText: {
    fontWeight: '600'
  }
});
