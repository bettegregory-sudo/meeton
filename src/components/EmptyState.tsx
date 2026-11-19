import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { FadeIn } from '@/components/FadeIn';
import { spacing, typography } from '@/theme/tokens';

type Props = {
  title: string;
  message?: string;
  illustration: number;
  /** Set when the artwork ships with its own light background (designed for the light theme). */
  cardIllustration?: boolean;
};

/** Centered title + 250px illustration, as used by the tribe tabs' empty states. */
export function EmptyState({ title, message, illustration, cardIllustration }: Props) {
  return (
    <View style={styles.container}>
      <FadeIn style={styles.text}>
        <Text style={[typography.h1, styles.center]}>{title}</Text>
        {message && <Text style={[typography.body, styles.center]}>{message}</Text>}
      </FadeIn>
      <FadeIn delay={120}>
        <Image
          source={illustration}
          style={[styles.illustration, cardIllustration && styles.card]}
          contentFit="contain"
          accessible={false}
        />
      </FadeIn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32, padding: spacing.screen },
  text: { gap: 12, alignItems: 'center' },
  center: { textAlign: 'center' },
  illustration: { width: 250, height: 250 },
  card: { borderRadius: 24, overflow: 'hidden' },
});
