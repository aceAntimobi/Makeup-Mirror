import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useThemePreference } from './src/hooks/useThemePreference';
import { MirrorScreen } from './src/screens/MirrorScreen';
import { ReportScreen } from './src/screens/ReportScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { NavigationBar } from './src/components/NavigationBar';
import { SubscriptionModal } from './src/components/SubscriptionModal';
import { ThemeProvider } from './src/theme/ThemeContext';

export type TabKey = 'mirror' | 'report' | 'settings';

export default function App() {
  const { scheme, theme, toggleScheme } = useThemePreference();
  const [tab, setTab] = useState<TabKey>('mirror');
  const [showSubscription, setShowSubscription] = useState(false);
  const subscriptionAnimation = useRef(new Animated.Value(0)).current;

  const screen = useMemo(() => {
    switch (tab) {
      case 'report':
        return <ReportScreen />;
      case 'settings':
        return <SettingsScreen onToggleTheme={toggleScheme} />;
      default:
        return <MirrorScreen onShowSubscription={() => setShowSubscription(true)} />;
    }
  }, [tab, toggleScheme]);

  useEffect(() => {
    Animated.timing(subscriptionAnimation, {
      toValue: showSubscription ? 1 : 0,
      duration: 260,
      useNativeDriver: true
    }).start();
  }, [showSubscription, subscriptionAnimation]);

  return (
    <ThemeProvider value={{ scheme, theme, toggleScheme }}>
      <SafeAreaView style={[styles.root, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
        {screen}
        <NavigationBar activeTab={tab} onTabChange={setTab} />
        <SubscriptionModal
          visible={showSubscription}
          animation={subscriptionAnimation}
          onClose={() => setShowSubscription(false)}
        />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1
  }
});
