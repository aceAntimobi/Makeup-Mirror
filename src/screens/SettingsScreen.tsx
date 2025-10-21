import { StyleSheet, Switch, Text, View } from 'react-native';
import { useState } from 'react';
import { spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

export type SettingsState = {
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
  autoDelete: boolean;
};

export const SettingsScreen = ({
  onToggleTheme
}: {
  onToggleTheme: () => void;
}) => {
  const { theme } = useTheme();
  const [state, setState] = useState<SettingsState>({
    notificationsEnabled: true,
    theme: 'light',
    autoDelete: false
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>设置</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }]}
      >
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>通知提醒</Text>
          <Switch
            value={state.notificationsEnabled}
            onValueChange={(value) => setState((prev) => ({ ...prev, notificationsEnabled: value }))}
            thumbColor={theme.accent}
            trackColor={{ true: theme.primary, false: '#DDD' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>主题模式</Text>
          <Switch
            value={state.theme === 'dark'}
            onValueChange={(value) => {
              setState((prev) => ({ ...prev, theme: value ? 'dark' : 'light' }));
              onToggleTheme();
            }}
            thumbColor={theme.accent}
            trackColor={{ true: theme.primary, false: '#DDD' }}
          />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>自动清除数据</Text>
          <Switch
            value={state.autoDelete}
            onValueChange={(value) => setState((prev) => ({ ...prev, autoDelete: value }))}
            thumbColor={theme.accent}
            trackColor={{ true: theme.primary, false: '#DDD' }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(3),
    gap: spacing(2)
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  card: {
    borderRadius: spacing(2),
    padding: spacing(2),
    gap: spacing(2)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600'
  }
});
