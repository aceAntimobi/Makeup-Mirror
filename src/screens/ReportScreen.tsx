import { StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

const trendData = [
  { label: '周一', value: 82 },
  { label: '周三', value: 85 },
  { label: '周五', value: 88 },
  { label: '周日', value: 90 }
];

export const ReportScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>肤质趋势</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>保持补水节奏，肌肤状态稳步提升</Text>
      <View style={[styles.chart, { backgroundColor: theme.surface }]}>
        {trendData.map((item) => (
          <View key={item.label} style={styles.barWrapper}>
            <View style={[styles.bar, { height: `${item.value}%`, backgroundColor: theme.accent }]} />
            <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>AI 检测今日评分</Text>
        <Text style={[styles.score, { color: theme.accent }]}>88</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>高于历史平均 6 分，继续保持光感保湿</Text>
      </View>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>护理建议</Text>
        <Text style={[styles.tip, { color: theme.textSecondary }]}>• 夜间加入玻尿酸精华，增强锁水</Text>
        <Text style={[styles.tip, { color: theme.textSecondary }]}>• 避免长时间空调环境，保持面部喷雾</Text>
        <Text style={[styles.tip, { color: theme.textSecondary }]}>• 每周一次温和去角质，维持肌肤细腻</Text>
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
    fontSize: 22,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 14
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: spacing(2),
    borderRadius: spacing(2)
  },
  barWrapper: {
    alignItems: 'center'
  },
  bar: {
    width: spacing(1.5),
    borderRadius: spacing(1),
    marginBottom: spacing(1)
  },
  barLabel: {
    fontSize: 12
  },
  card: {
    borderRadius: spacing(2),
    padding: spacing(2),
    gap: spacing(1)
  },
  cardTitle: {
    fontWeight: '700'
  },
  score: {
    fontSize: 48,
    fontWeight: '800'
  },
  cardSubtitle: {
    fontSize: 14
  },
  tip: {
    fontSize: 14
  }
});
