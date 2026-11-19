import { Contact, ContactField, requestPermissionsAsync } from 'expo-contacts';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import type { Person } from './TribesContext';

/** Shown on web, or when contacts access is denied, so the flow stays testable. */
const DEMO_CONTACTS: Person[] = [
  { id: 'demo-1', name: 'Robert Genoux' },
  { id: 'demo-2', name: 'Ton ton Pierre' },
  { id: 'demo-3', name: 'Anna Martin' },
  { id: 'demo-4', name: 'Shura Petrova' },
  { id: 'demo-5', name: 'Maman' },
  { id: 'demo-6', name: 'Léo Dupont' },
];

type State =
  | { status: 'loading'; contacts: Person[] }
  | { status: 'ready' | 'demo'; contacts: Person[] };

const FIELDS = [ContactField.FULL_NAME, ContactField.PHONES, ContactField.IMAGE] as const;

export function useDeviceContacts(): State {
  const [state, setState] = useState<State>({ status: 'loading', contacts: [] });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (Platform.OS === 'web') {
        setState({ status: 'demo', contacts: DEMO_CONTACTS });
        return;
      }
      try {
        const { granted } = await requestPermissionsAsync();
        if (!granted) throw new Error('denied');
        const details = await Contact.getAllDetails(FIELDS);
        const contacts = details
          .filter((c) => c.fullName && c.phones && c.phones.length > 0)
          .map<Person>((c) => ({
            id: c.id,
            name: c.fullName as string,
            phone: c.phones?.[0]?.number,
            imageUri: c.image ?? null,
          }))
          .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
        if (!cancelled) setState({ status: 'ready', contacts });
      } catch {
        if (!cancelled) setState({ status: 'demo', contacts: DEMO_CONTACTS });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
