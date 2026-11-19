import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme/tokens';

/** Temporary content for tabs whose screens aren't built yet. */
export function ComingSoon({ title, message }: { title: string; message: string }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={[typography.h1, styles.title]} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.body}>
        <Text style={[typography.body, styles.center]}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  title: { paddingHorizontal: spacing.screen, paddingVertical: 12 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.screen },
  center: { textAlign: 'center' },
});
