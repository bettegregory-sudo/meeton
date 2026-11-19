// Sign in — Step 1 (Figma node 234:5075): welcome + contact-sharing consent.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FadeIn } from '@/components/FadeIn';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, fonts, spacing, typography } from '@/theme/tokens';

const illustration = require('../../assets/signin/illustration-family.svg');

export default function Welcome() {
  const [showMore, setShowMore] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.progress}>
        <ProgressBar step={1} total={3} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <FadeIn style={styles.header}>
          <Text style={[typography.h1, styles.center]} accessibilityRole="header">
            MeetOn
          </Text>
          <Text style={[typography.subtitle, styles.center]}>
            Prêt à rejoindre la <Text style={styles.accent}>tribu</Text>
          </Text>
        </FadeIn>

        <FadeIn delay={120} style={styles.body}>
          {/* 300×300 illustration slot; the artwork sits inset inside it as in Figma. */}
          <View style={styles.illustrationSlot}>
            <Image source={illustration} style={styles.illustration} contentFit="contain" accessible={false} />
          </View>

          <Text style={[typography.body, styles.center, styles.copy]}>
            Votre famille, vos amis et les autres personnes qui utilisent notre service peuvent avoir importé
            votre numéro dans MeetOn. Si tel est le cas, ces personnes pourront vous voir dans leurs contacts
            après votre inscription.
            {showMore &&
              '\n\nVotre numéro sert uniquement à vous mettre en relation avec vos proches. Il n’est jamais affiché publiquement.'}
            {'\n\n'}
            <Text style={styles.link} accessibilityRole="link" onPress={() => setShowMore((v) => !v)}>
              {showMore ? 'Voir moins' : 'En savoir plus'}
            </Text>
          </Text>
        </FadeIn>

        <FadeIn delay={240} style={styles.cta}>
          <Button label="Accepter et continuer" onPress={() => router.push('/sign-in/phone')} />
        </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  progress: { paddingHorizontal: spacing.screen, paddingTop: 8 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    padding: spacing.screen,
  },
  header: { gap: 8, alignItems: 'center', alignSelf: 'stretch' },
  center: { textAlign: 'center' },
  accent: { fontFamily: fonts.bold, color: colors.accent },
  body: { gap: 21, alignItems: 'center', alignSelf: 'stretch' },
  illustrationSlot: { width: 300, height: 300, alignItems: 'center', justifyContent: 'center' },
  illustration: { width: 262, height: 212 },
  copy: { alignSelf: 'stretch' },
  link: { fontFamily: fonts.bold, color: colors.accent },
  cta: { alignSelf: 'stretch' },
});
