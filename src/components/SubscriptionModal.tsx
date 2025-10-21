import { memo } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  visible: boolean;
  animation: Animated.Value;
  onClose: () => void;
};

const plans = [
  { title: '月度会员', price: '$4.99/月', description: '解锁 AI 功能 + 去广告' },
  { title: '年度会员', price: '$39.99/年', description: '立省 33%，全年美颜体验' }
];

const SubscriptionModalComponent = ({ visible, animation, onClose }: Props) => {
  const { theme } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            { backgroundColor: theme.surface },
            {
              opacity: animation,
              transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }]
            }
          ]}
        >
          <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
            <Text style={styles.headerTitle}>升级 AI Makeup Mirror</Text>
            <Text style={styles.headerSubtitle}>粉色渐变，让美丽随行</Text>
          </LinearGradient>
          <View style={styles.planList}>
            {plans.map((plan) => (
              <View key={plan.title} style={[styles.planCard, { backgroundColor: theme.surfaceVariant }]}>
                <Text style={[styles.planTitle, { color: theme.textPrimary }]}>{plan.title}</Text>
                <Text style={[styles.planPrice, { color: theme.accent }]}>{plan.price}</Text>
                <Text style={[styles.planDescription, { color: theme.textSecondary }]}>{plan.description}</Text>
              </View>
            ))}
          </View>
          <Pressable style={[styles.ctaButton, { backgroundColor: theme.accent }]}
            onPress={onClose}
          >
            <Text style={styles.ctaText}>立即订阅</Text>
          </Pressable>
          <Pressable onPress={onClose}>
            <Text style={[styles.dismiss, { color: theme.textSecondary }]}>稍后再说</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

export const SubscriptionModal = memo(SubscriptionModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '85%',
    borderRadius: spacing(3),
    overflow: 'hidden',
    backgroundColor: '#fff'
  },
  header: {
    paddingVertical: spacing(4),
    paddingHorizontal: spacing(3)
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700'
  },
  headerSubtitle: {
    color: '#fff',
    marginTop: spacing(0.5)
  },
  planList: {
    padding: spacing(2),
    gap: spacing(1.5)
  },
  planCard: {
    borderRadius: spacing(2),
    padding: spacing(2)
  },
  planTitle: {
    fontWeight: '700'
  },
  planPrice: {
    fontWeight: '700',
    marginTop: spacing(0.5)
  },
  planDescription: {
    marginTop: spacing(0.5)
  },
  ctaButton: {
    marginHorizontal: spacing(2),
    marginBottom: spacing(2),
    paddingVertical: spacing(1.5),
    borderRadius: spacing(2),
    alignItems: 'center'
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700'
  },
  dismiss: {
    textAlign: 'center',
    paddingBottom: spacing(2),
    fontWeight: '600'
  }
});
