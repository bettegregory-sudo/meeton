import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  /** Delay in ms, handy to stagger several blocks. */
  delay?: number;
  /** Vertical offset the content slides up from. */
  offset?: number;
  style?: StyleProp<ViewStyle>;
};

/** Fades + slides its content in on mount (V1 retro: "animations"). */
export function FadeIn({ children, delay = 0, offset = 12, style }: Props) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: 380,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
