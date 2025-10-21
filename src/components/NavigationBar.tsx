import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { shadows, spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

type TabKey = 'mirror' | 'report' | 'settings';

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'mirror', label: '镜子' },
  { key: 'report', label: '报告' },
  { key: 'settings', label: '设置' }
];

const NavigationBarComponent = ({ activeTab, onTabChange }: Props) => {
  const { theme } = useTheme();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: theme.surface, shadowColor: theme.primary }]}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={[styles.item, active && { backgroundColor: theme.surfaceVariant }]}
            >
              <Text style={[styles.label, { color: active ? theme.accent : theme.textSecondary }]}>{tab.label}</Text>
              {active ? <View style={[styles.indicator, { backgroundColor: theme.accent }]} /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const NavigationBar = memo(NavigationBarComponent);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing(2),
    paddingBottom: spacing(2)
  },
  container: {
    flexDirection: 'row',
    borderRadius: spacing(3),
    padding: spacing(1),
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.floating
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing(1),
    borderRadius: spacing(2)
  },
  label: {
    fontWeight: '600'
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: spacing(0.5)
  }
});
