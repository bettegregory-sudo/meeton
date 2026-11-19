// Mes tribus — empty state (Figma 80:2325) and list (Figma 67:3908), dark theme.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { SearchField } from '@/components/SearchField';
import { FadeIn } from '@/components/FadeIn';
import { formatTime, tribeActivity, useTribes, type Tribe } from '@/features/tribes/TribesContext';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const addIcon = require('../../../assets/icons/add-small.svg');
const bellIcon = require('../../../assets/icons/notifications.svg');
const filterIcon = require('../../../assets/icons/filter.svg');
const teamwork = require('../../../assets/tribes/illustration-teamwork.svg');

type Sort = 'recent' | 'alpha';

export default function TribesScreen() {
  const { tribes } = useTribes();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('recent');

  const unread = tribes.reduce((n, t) => n + t.unread, 0);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fr');
    const filtered = q ? tribes.filter((t) => t.name.toLocaleLowerCase('fr').includes(q)) : tribes;
    return sort === 'alpha'
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      : [...filtered].sort((a, b) => tribeActivity(b).at.getTime() - tribeActivity(a).at.getTime());
  }, [tribes, query, sort]);

  const createTribe = () => router.push('/tribe/new');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={typography.h1} accessibilityRole="header">
            Mes tribus
          </Text>
          {unread > 0 && (
            <View style={styles.badgeSoft}>
              <Text style={[typography.badge, { color: colors.badgeSoftText }]}>{unread} new</Text>
            </View>
          )}
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={createTribe}
            accessibilityRole="button"
            accessibilityLabel="Créer une tribu"
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          >
            <Image source={addIcon} style={styles.addIcon} accessible={false} />
          </Pressable>
          {tribes.length > 0 && (
            <Image source={bellIcon} style={styles.icon} tintColor={colors.textPrimary} accessibilityLabel="Notifications" />
          )}
        </View>
      </View>

      {tribes.length === 0 ? (
        <View style={styles.empty}>
          <FadeIn style={styles.emptyText}>
            <Text style={[typography.h1, styles.center]}>Prêt à rejoindre{'\n'}vos tribus !</Text>
            <Text style={[typography.body, styles.center]}>
              Une tribu, c’est votre cercle de proches : la famille, les amis, l’équipe du jeudi… Un endroit
              pour discuter, vous organiser et garder vos souvenirs.
            </Text>
          </FadeIn>
          <FadeIn delay={120}>
            <Image source={teamwork} style={styles.illustration} contentFit="contain" accessible={false} />
          </FadeIn>
          <FadeIn delay={240}>
            <Button label="Créer ma tribu" onPress={createTribe} />
          </FadeIn>
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(t) => t.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.searchRow}>
              <SearchField value={query} onChangeText={setQuery} />
              <Pressable
                onPress={() => setSort((s) => (s === 'recent' ? 'alpha' : 'recent'))}
                accessibilityRole="button"
                accessibilityLabel={sort === 'recent' ? 'Trier par nom' : 'Trier par date'}
                hitSlop={8}
              >
                <Image
                  source={filterIcon}
                  style={styles.icon}
                  tintColor={sort === 'alpha' ? colors.accent : colors.textPrimary}
                  accessible={false}
                />
              </Pressable>
            </View>
          }
          ListEmptyComponent={<Text style={[typography.bodyS, styles.noResult]}>Aucune tribu ne correspond.</Text>}
          renderItem={({ item, index }) => (
            <FadeIn delay={Math.min(index, 8) * 50}>
              <TribeRow tribe={item} />
            </FadeIn>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function TribeRow({ tribe }: { tribe: Tribe }) {
  const activity = tribeActivity(tribe);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/tribe/[id]', params: { id: tribe.id } })}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir la tribu ${tribe.name}`}
    >
      <Avatar uri={tribe.photoUri} name={tribe.name} />
      <View style={styles.rowText}>
        <Text style={typography.bodySStrong} numberOfLines={1}>
          {tribe.name}
        </Text>
        <Text style={typography.bodyS} numberOfLines={1}>
          <Text style={{ color: colors.textPrimary }}>{activity.author} :</Text> {activity.text}
        </Text>
      </View>
      <View style={styles.rowMeta}>
        <Text style={typography.bodyS}>{formatTime(activity.at)}</Text>
        {tribe.unread > 0 && (
          <View style={styles.badge}>
            <Text style={[typography.badge, { color: colors.onAccent }]}>{tribe.unread}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingVertical: 12,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    backgroundColor: colors.iconButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  addIcon: { width: 20, height: 20 },
  icon: { width: 24, height: 24 },
  badgeSoft: { height: 24, paddingHorizontal: 8, borderRadius: 6, justifyContent: 'center', backgroundColor: colors.badgeSoftBg },
  badge: { height: 24, minWidth: 24, paddingHorizontal: 8, borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.accent },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32, padding: spacing.screen },
  emptyText: { gap: 12, alignItems: 'center' },
  center: { textAlign: 'center' },
  // The artwork ships with its own light square background (designed for the light theme): round it into a card.
  illustration: { width: 250, height: 250, borderRadius: 24, overflow: 'hidden' },
  list: { paddingVertical: 20 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: spacing.screen, marginBottom: 20 },
  noResult: { textAlign: 'center', paddingTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.screen, paddingVertical: 12 },
  rowPressed: { backgroundColor: 'rgba(255,255,255,0.04)' },
  rowText: { flex: 1, gap: 4 },
  rowMeta: { alignItems: 'flex-end', gap: 4 },
});
