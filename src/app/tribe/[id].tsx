// Inside a tribe: header + Chat / Feed / Souvenirs tabs (Figma section "Tribut" 130:4783), dark theme.
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { SegmentedTabs } from '@/components/SegmentedTabs';
import { FeedTab, SouvenirsTab } from '@/features/tribes/AlbumsTabs';
import { ChatTab } from '@/features/tribes/ChatTab';
import { useTribe } from '@/features/tribes/TribesContext';
import { colors, fonts, spacing, typography } from '@/theme/tokens';

const backIcon = require('../../../assets/icons/chevron-left.svg');
const searchIcon = require('../../../assets/icons/search-24.svg');
const kebabIcon = require('../../../assets/icons/kebab.svg');

type Tab = 'chat' | 'feed' | 'souvenirs';
const TABS: { key: Tab; label: string }[] = [
  { key: 'chat', label: 'Chat' },
  { key: 'feed', label: 'Feed' },
  { key: 'souvenirs', label: 'Souvenirs' },
];

export default function TribeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tribe = useTribe(id);
  const [tab, setTab] = useState<Tab>('chat');

  const back = () => (router.canGoBack() ? router.back() : router.replace('/tribes'));

  if (!tribe) {
    // Data lives in memory for now: a reload loses it.
    return (
      <SafeAreaView style={[styles.safe, styles.missing]}>
        <Text style={[typography.subtitle, styles.center]}>Cette tribu est introuvable.</Text>
        <Button label="Retour à mes tribus" onPress={() => router.replace('/tribes')} />
      </SafeAreaView>
    );
  }

  const memberCount = tribe.members.length + 1;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={10} accessibilityRole="button" accessibilityLabel="Retour">
          <Image source={backIcon} style={styles.back} tintColor={colors.textPrimary} accessible={false} />
        </Pressable>
        <Avatar uri={tribe.photoUri} name={tribe.name} size={48} />
        <View style={styles.titleBlock}>
          <Text style={typography.bodySStrong} numberOfLines={1} accessibilityRole="header">
            {tribe.name}
          </Text>
          <Text style={styles.members}>
            {memberCount} membre{memberCount > 1 ? 's' : ''}
          </Text>
        </View>
        <Image source={searchIcon} style={styles.icon} accessibilityLabel="Rechercher" />
        <Image source={kebabIcon} style={styles.icon} accessibilityLabel="Options" />
      </View>

      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {tab === 'chat' && <ChatTab tribe={tribe} />}
        {tab === 'feed' && <FeedTab tribe={tribe} />}
        {tab === 'souvenirs' && <SouvenirsTab tribe={tribe} />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  missing: { alignItems: 'center', justifyContent: 'center', gap: 24, padding: spacing.screen },
  center: { textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  back: { width: 23, height: 24 },
  titleBlock: { flex: 1, gap: 2 },
  members: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.textSecondary },
  icon: { width: 24, height: 24, marginLeft: 4 },
});
