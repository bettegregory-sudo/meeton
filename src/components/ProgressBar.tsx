import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/tokens';

type Props = { step: number; total: number };

/**
 * Segmented progress bar for multi-step flows (V1 retro: "progress bar").
 * The current segment fills with an animation; previous ones are already full.
 */
export function ProgressBar({ step, total }: Props) {
  const [fill] = useState(() => new Animated.Value(0));
  const [segmentWidth, setSegmentWidth] = useState(0);

  useEffect(() => {
    fill.setValue(0);
    Animated.timing(fill, {
      toValue: 1,
      duration: 500,
      delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fill, step]);

  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Étape ${step} sur ${total}`}
      accessibilityValue={{ min: 0, max: total, now: step }}
    >
      {Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        return (
          <View
            key={index}
            style={styles.track}
            onLayout={index === 1 ? (e) => setSegmentWidth(e.nativeEvent.layout.width) : undefined}
          >
            {index < step && <View style={[styles.fill, { width: '100%' }]} />}
            {index === step && (
              <Animated.View
                style={[styles.fill, { width: fill.interpolate({ inputRange: [0, 1], outputRange: [0, segmentWidth] }) }]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignSelf: 'stretch' },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.divider, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2, backgroundColor: colors.accent },
});
