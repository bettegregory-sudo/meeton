import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, fonts, spacing, typography } from '@/theme/tokens';

type Props = {
  title: string;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  /** Position in the flow, drawn as a segmented progress bar at the top. */
  progress?: { step: number; total: number };
  /** Optional "Créer . Inviter" style progress line above the title; the current step is highlighted. */
  steps?: { labels: string[]; current: number };
  /** Set to false when the content manages its own scrolling (e.g. a FlatList). */
  scroll?: boolean;
};

/** Layout shared by multi-step flows: progress, centered title, content, and a Retour / Suivant row above the keyboard. */
export function StepScreen({
  title,
  children,
  onBack,
  onNext,
  nextLabel = 'Suivant',
  nextDisabled,
  progress,
  steps,
  scroll = true,
}: Props) {
  const header = (
    <View style={[styles.header, !steps && styles.headerNoSteps]}>
      {steps && (
        <Text style={styles.steps}>
          {steps.labels.map((label, i) => (
            <Text key={label}>
              {i > 0 && <Text style={styles.stepSeparator}> . </Text>}
              <Text style={i === steps.current ? styles.stepCurrent : styles.stepOther}>{label}</Text>
            </Text>
          ))}
        </Text>
      )}
      <Text style={[typography.h1, styles.title]} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {progress && (
        <View style={styles.progress}>
          <ProgressBar step={progress.step} total={progress.total} />
        </View>
      )}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <FadeIn>{header}</FadeIn>
            <FadeIn delay={90} style={styles.content}>
              {children}
            </FadeIn>
          </ScrollView>
        ) : (
          <View style={styles.flex}>
            <FadeIn style={styles.fixedHeader}>{header}</FadeIn>
            <FadeIn delay={90} style={styles.flex}>
              {children}
            </FadeIn>
          </View>
        )}
        <View style={styles.actions}>
          <Button label="Retour" variant="ghost" onPress={onBack} style={styles.flex} />
          <Button label={nextLabel} onPress={onNext} disabled={nextDisabled} style={styles.flex} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  progress: { paddingHorizontal: spacing.screen, paddingTop: 8 },
  scroll: { paddingHorizontal: spacing.screen },
  fixedHeader: { paddingHorizontal: spacing.screen },
  header: { alignItems: 'center', paddingTop: 8 },
  headerNoSteps: { paddingTop: 25 }, // sign-in steps: title sits 25px below the status bar
  steps: { ...typography.body, color: colors.textPrimary, textAlign: 'center' },
  stepCurrent: { fontFamily: fonts.bold, color: colors.accent },
  stepOther: { fontFamily: fonts.regular, color: colors.textPrimary },
  stepSeparator: { fontFamily: fonts.bold, color: colors.textPrimary },
  title: { textAlign: 'center', paddingVertical: 12 },
  content: { gap: 40, alignItems: 'center' },
  actions: { flexDirection: 'row', gap: 8, padding: spacing.screen },
});
