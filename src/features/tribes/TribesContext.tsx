import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Person = { id: string; name: string; phone?: string; imageUri?: string | null };

/** The current user's id in messages/reactions until real accounts exist. */
export const ME = 'me';

export const REACTIONS = ['❤️', '😂', '👍', '🎉', '😮', '😢'] as const;
export type Reaction = (typeof REACTIONS)[number];

export type Message = {
  id: string;
  /** `ME`, a member id, or 'system' for MeetOn notices. */
  authorId: string;
  authorName: string;
  text?: string;
  imageUri?: string;
  createdAt: Date;
  /** emoji → ids of people who reacted. */
  reactions: Partial<Record<Reaction, string[]>>;
};

export type Album = {
  id: string;
  title: string;
  photos: string[];
  authorId: string;
  authorName: string;
  createdAt: Date;
  likes: string[];
};

export type Tribe = {
  id: string;
  name: string;
  photoUri: string | null;
  members: Person[];
  createdAt: Date;
  messages: Message[];
  albums: Album[];
  unread: number;
};

type Draft = { name: string; photoUri: string | null };

/** Progress labels of the tribe-creation flow ("Créer . Inviter"). */
export const TRIBE_STEPS = ['Créer', 'Inviter'];

type TribesState = {
  tribes: Tribe[];
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  /** Creates a tribe from the current draft + invitees, resets the draft and returns the new tribe. */
  createTribe: (invitees: Person[]) => Tribe;
  sendMessage: (tribeId: string, author: { id: string; name: string }, content: { text?: string; imageUri?: string }) => void;
  toggleReaction: (tribeId: string, messageId: string, reaction: Reaction) => void;
  addAlbum: (tribeId: string, author: { id: string; name: string }, title: string, photos: string[]) => Album;
  toggleAlbumLike: (tribeId: string, albumId: string) => void;
};

const EMPTY_DRAFT: Draft = { name: '', photoUri: null };
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const TribesContext = createContext<TribesState | null>(null);

export function TribesProvider({ children }: { children: ReactNode }) {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [draft, setDraftState] = useState<Draft>(EMPTY_DRAFT);

  const setDraft = useCallback((patch: Partial<Draft>) => setDraftState((d) => ({ ...d, ...patch })), []);

  const updateTribe = useCallback(
    (tribeId: string, update: (t: Tribe) => Tribe) => setTribes((list) => list.map((t) => (t.id === tribeId ? update(t) : t))),
    [],
  );

  const createTribe = useCallback(
    (invitees: Person[]) => {
      const now = new Date();
      const count = invitees.length;
      const tribe: Tribe = {
        id: uid(),
        name: draft.name.trim(),
        photoUri: draft.photoUri,
        members: invitees,
        createdAt: now,
        messages: [
          {
            id: uid(),
            authorId: 'system',
            authorName: 'MeetOn',
            text:
              count === 0
                ? 'Bienvenue dans votre tribu ! Invitez vos proches pour commencer à échanger.'
                : `Bienvenue dans votre tribu ! ${count} ${count > 1 ? 'proches ont été invités' : 'proche a été invité'}.`,
            createdAt: now,
            reactions: {},
          },
          {
            id: uid(),
            authorId: 'system',
            authorName: 'MeetOn',
            text: 'Astuce : restez appuyé sur un message pour y réagir d’un emoji.',
            createdAt: now,
            reactions: {},
          },
        ],
        albums: [],
        unread: 0,
      };
      setTribes((list) => [tribe, ...list]);
      setDraftState(EMPTY_DRAFT);
      return tribe;
    },
    [draft],
  );

  const sendMessage = useCallback<TribesState['sendMessage']>(
    (tribeId, author, content) =>
      updateTribe(tribeId, (t) => ({
        ...t,
        messages: [
          ...t.messages,
          { id: uid(), authorId: author.id, authorName: author.name, ...content, createdAt: new Date(), reactions: {} },
        ],
      })),
    [updateTribe],
  );

  const toggleReaction = useCallback<TribesState['toggleReaction']>(
    (tribeId, messageId, reaction) =>
      updateTribe(tribeId, (t) => ({
        ...t,
        messages: t.messages.map((m) => {
          if (m.id !== messageId) return m;
          const current = m.reactions[reaction] ?? [];
          const next = current.includes(ME) ? current.filter((id) => id !== ME) : [...current, ME];
          return { ...m, reactions: { ...m.reactions, [reaction]: next } };
        }),
      })),
    [updateTribe],
  );

  const addAlbum = useCallback<TribesState['addAlbum']>(
    (tribeId, author, title, photos) => {
      const album: Album = {
        id: uid(),
        title,
        photos,
        authorId: author.id,
        authorName: author.name,
        createdAt: new Date(),
        likes: [],
      };
      updateTribe(tribeId, (t) => ({ ...t, albums: [album, ...t.albums] }));
      return album;
    },
    [updateTribe],
  );

  const toggleAlbumLike = useCallback<TribesState['toggleAlbumLike']>(
    (tribeId, albumId) =>
      updateTribe(tribeId, (t) => ({
        ...t,
        albums: t.albums.map((a) =>
          a.id !== albumId ? a : { ...a, likes: a.likes.includes(ME) ? a.likes.filter((id) => id !== ME) : [...a.likes, ME] },
        ),
      })),
    [updateTribe],
  );

  const value = useMemo(
    () => ({ tribes, draft, setDraft, createTribe, sendMessage, toggleReaction, addAlbum, toggleAlbumLike }),
    [tribes, draft, setDraft, createTribe, sendMessage, toggleReaction, addAlbum, toggleAlbumLike],
  );

  return <TribesContext.Provider value={value}>{children}</TribesContext.Provider>;
}

export function useTribes() {
  const ctx = useContext(TribesContext);
  if (!ctx) throw new Error('useTribes must be used inside <TribesProvider>');
  return ctx;
}

export function useTribe(id: string | undefined) {
  const { tribes } = useTribes();
  return tribes.find((t) => t.id === id);
}

/** Latest activity of a tribe, used for the preview line and sorting in "Mes tribus". */
export function tribeActivity(tribe: Tribe): { author: string; text: string; at: Date } {
  const lastMessage = tribe.messages[tribe.messages.length - 1];
  const lastAlbum = tribe.albums[0];
  if (lastAlbum && (!lastMessage || lastAlbum.createdAt > lastMessage.createdAt)) {
    return { author: authorLabel(lastAlbum.authorId, lastAlbum.authorName), text: `a partagé l’album « ${lastAlbum.title} »`, at: lastAlbum.createdAt };
  }
  if (lastMessage) {
    return {
      author: authorLabel(lastMessage.authorId, lastMessage.authorName),
      text: lastMessage.text ?? '📷 Photo',
      at: lastMessage.createdAt,
    };
  }
  return { author: 'MeetOn', text: 'Tribu créée', at: tribe.createdAt };
}

function authorLabel(authorId: string, name: string) {
  return authorId === ME ? 'Vous' : name;
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDay(date: Date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}
