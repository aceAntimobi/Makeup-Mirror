import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type CameraCapturedPicture } from 'expo-camera';
import { BottomToolbar } from '../components/BottomToolbar';
import { AIMenu } from '../components/AIMenu';
import { BottomSheetMenu } from '../components/BottomSheetMenu';
import { shadows, spacing } from '../theme/palette';
import { useTheme } from '../theme/ThemeContext';

type Props = {
  onShowSubscription: () => void;
};

export const MirrorScreen = ({ onShowSubscription }: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [brightness, setBrightness] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [frozen, setFrozen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const { theme } = useTheme();

  const aiAnimation = useRef(new Animated.Value(0)).current;
  const sheetAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    Animated.timing(aiAnimation, {
      toValue: showMenu ? 1 : 0,
      duration: 220,
      useNativeDriver: true
    }).start();
  }, [aiAnimation, showMenu]);

  useEffect(() => {
    Animated.timing(sheetAnimation, {
      toValue: showSheet ? 1 : 0,
      duration: 280,
      useNativeDriver: true
    }).start();
  }, [sheetAnimation, showSheet]);

  const brightnessOverlay = useMemo(() => {
    const normalized = Math.max(0.3, Math.min(1.5, brightness));
    if (normalized === 1) {
      return { backgroundColor: 'transparent', opacity: 0 };
    }

    if (normalized > 1) {
      const intensity = (normalized - 1) / 0.5;
      return {
        backgroundColor: 'rgba(255, 240, 245, 1)',
        opacity: Math.min(0.6, intensity * 0.6)
      };
    }

    const dimIntensity = (1 - normalized) / 0.7;
    return {
      backgroundColor: 'rgba(0, 0, 0, 1)',
      opacity: Math.min(0.55, dimIntensity * 0.55)
    };
  }, [brightness]);

  const handleToggleFreeze = useCallback(async () => {
    if (frozen) {
      setFrozen(false);
      setPhoto(null);
      return;
    }

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result?.granted) {
        return;
      }
    }

    if (!cameraRef.current || capturing) {
      return;
    }

    try {
      setCapturing(true);
      const captured = await (cameraRef.current as any).takePictureAsync({
        quality: 0.8,
        skipProcessing: true
      });
      setPhoto(captured);
      setFrozen(true);
    } catch (error) {
      console.warn('Failed to capture frame', error);
    } finally {
      setCapturing(false);
    }
  }, [capturing, frozen, permission, requestPermission]);

  const handleBrightnessIncrease = useCallback(() => {
    setBrightness((prev) => {
      const next = prev + 0.2;
      if (next > 1.5 + 1e-3) {
        return 0.3;
      }
      return Number(Math.min(next, 1.5).toFixed(1));
    });
  }, []);

  const handleZoomIncrease = useCallback(() => {
    setZoom((prev) => {
      const next = Number((prev + 0.5).toFixed(1));
      return next > 3 ? 1 : Math.min(next, 3);
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {permission?.granted ? (
        <View style={styles.previewWrapper}>
          {!frozen ? (
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="front"
              zoom={Math.min(1, (zoom - 1) / 2)}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.frozenFrame]}>
              {photo?.uri ? (
                <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              ) : (
                <Text style={styles.frozenText}>已冻结画面</Text>
              )}
            </View>
          )}
          <Animated.View style={[styles.brightnessOverlay, brightnessOverlay]} pointerEvents="none" />
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionTitle, { color: theme.textPrimary }]}>需要相机权限</Text>
          <Text style={[styles.permissionDescription, { color: theme.textSecondary }]}>
            请允许访问前置摄像头以使用实时镜像体验。
          </Text>
          <Pressable
            style={[styles.permissionButton, { backgroundColor: theme.accent }]}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>去授权</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>柔粉光感镜面</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>亮度与缩放自由调节，发现你的最佳角度</Text>
        </View>
        <Pressable
          style={[styles.subscriptionBadge, { backgroundColor: theme.surface, shadowColor: theme.accent }]}
          onPress={onShowSubscription}
        >
          <Text style={[styles.subscriptionBadgeText, { color: theme.accent }]}>会员</Text>
        </Pressable>
      </View>
      <Pressable
        style={[styles.menuButton, { backgroundColor: theme.surface, shadowColor: theme.primary }]}
        onPress={() => setShowSheet(true)}
      >
        <Text style={[styles.menuButtonText, { color: theme.textPrimary }]}>⋮</Text>
      </Pressable>
      <Pressable
        style={[styles.aiButton, { backgroundColor: theme.accent, shadowColor: theme.accent }]}
        onPress={() => setShowMenu((prev) => !prev)}
      >
        <Text style={styles.aiButtonText}>AI</Text>
      </Pressable>
      <BottomToolbar
        brightness={brightness}
        zoom={zoom}
        frozen={frozen}
        captureInProgress={capturing}
        onToggleFreeze={handleToggleFreeze}
        onIncreaseBrightness={handleBrightnessIncrease}
        onIncreaseZoom={handleZoomIncrease}
      />
      <AIMenu visible={showMenu} animation={aiAnimation} onClose={() => setShowMenu(false)} />
      <BottomSheetMenu visible={showSheet} animation={sheetAnimation} onClose={() => setShowSheet(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing(6),
    paddingHorizontal: spacing(2)
  },
  previewWrapper: {
    flex: 1,
    borderRadius: spacing(3),
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  frozenFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f1f1f'
  },
  frozenText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  },
  brightnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFF0F5'
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing(1.5)
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  permissionDescription: {
    textAlign: 'center',
    paddingHorizontal: spacing(2)
  },
  permissionButton: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(1.5),
    borderRadius: spacing(2)
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '700'
  },
  header: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
    right: spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700'
  },
  headerSubtitle: {
    marginTop: spacing(0.5)
  },
  subscriptionBadge: {
    paddingVertical: spacing(0.5),
    paddingHorizontal: spacing(1.5),
    borderRadius: 999,
    ...shadows.soft
  },
  subscriptionBadgeText: {
    fontWeight: '700'
  },
  menuButton: {
    position: 'absolute',
    top: spacing(10),
    right: spacing(2),
    width: spacing(5),
    height: spacing(5),
    borderRadius: spacing(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft
  },
  menuButtonText: {
    fontSize: 22,
    fontWeight: '600'
  },
  aiButton: {
    position: 'absolute',
    bottom: spacing(16),
    right: spacing(2),
    width: spacing(6),
    height: spacing(6),
    borderRadius: spacing(3),
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating
  },
  aiButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  }
});
