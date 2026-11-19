// Tribe creation — step "Inviter" (Figma 106:4181), dark theme.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Checkbox } from '@/components/Checkbox';
import { SearchField } from '@/components/SearchField';
import { StepScreen } from '@/components/StepScreen';
import { TRIBE_STEPS, useTribes, type Person } from '@/features/tribes/TribesContext';
import { useDeviceContacts } from '@/features/tribes/useDeviceContacts';
import { colors, spacing, typography } from '@/theme/tokens';

const filterIcon = require('../../../assets/icons/filter.svg');

export default function InviteTribe() {
  const { createTribe } = useTribes();
  const { status, contacts } = useDeviceContacts();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [selectedFirst, setSelectedFirst] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('fr');
    const list = q ? contacts.filter((c) => c.name.toLocaleLowerCase('fr').includes(q)) : contacts;
    return selectedFirst ? [...list].sort((a, b) => Number(selected.has(b.id)) - Number(selected.has(a.id))) : list;
  }, [contacts, query, selectedFirst, selected]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const finish = () => {
    createTribe(contacts.filter((c) => selected.has(c.id)));
    router.dismissTo('/tribes');
  };

  return (
    <StepScreen
      title="Invitez votre tribu"
      steps={{ labels: TRIBE_STEPS, current: 1 }}
      progress={{ step: 2, total: TRIBE_STEPS.length }}
      nextLabel={selected.size > 0 ? `Invitez-les (${selected.size})` : 'Passer'}
      onBack={() => router.back()}
      onNext={finish}
      scroll={false}
    >
      <Text style={[typography.body, styles.subtitle]}>Invitez vos proches à vous rejoindre</Text>

      <View style={styles.searchRow}>
        <SearchField value={query} onChangeText={setQuery} />
        <Pressable
          onPress={() => setSelectedFirst((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={selectedFirst ? 'Afficher par ordre alphabétique' : 'Afficher la sélection en premier'}
          hitSlop={8}
        >
          <Image
            source={filterIcon}
            style={styles.icon}
            tintColor={selectedFirst ? colors.accent : colors.textPrimary}
            accessible={false}
          />
        </Pressable>
      </View>

      {status === 'demo' && (
        <Text style={[typography.description, styles.demo]}>Contacts de démonstration (accès aux contacts indisponible)</Text>
      )}

      {status === 'loading' ? (
        <ActivityIndicator color={colors.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={[typography.bodyS, styles.empty]}>Aucun contact trouvé.</Text>}
          renderItem={({ item }) => (
            <ContactRow person={item} checked={selected.has(item.id)} onPress={() => toggle(item.id)} />
          )}
        />
      )}
    </StepScreen>
  );
}

function ContactRow({ person, checked, onPress }: { person: Person; checked: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={person.name}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <Avatar uri={person.imageUri} name={person.name} />
      <Text style={[typography.bodySStrong, styles.name]} numberOfLines={1}>
        {person.name}
      </Text>
      <Checkbox checked={checked} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  subtitle: { textAlign: 'center', paddingHorizontal: spacing.screen, marginTop: -8, marginBottom: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingHorizontal: spacing.screen },
  icon: { width: 24, height: 24 },
  demo: { paddingHorizontal: spacing.screen, paddingTop: 8 },
  loader: { marginTop: 40 },
  list: { paddingVertical: 20 },
  empty: { textAlign: 'center', paddingTop: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.screen, paddingVertical: 12 },
  rowPressed: { backgroundColor: 'rgba(255,255,255,0.04)' },
  name: { flex: 1 },
});
