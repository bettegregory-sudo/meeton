// Tribe chat (Figma 67:4332), dark theme + emoji reactions for the "Silencieux" persona.
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { FadeIn } from '@/components/FadeIn';
import { Sheet } from '@/components/Sheet';
import { useSignup } from '@/features/signup/SignupContext';
import { formatTime, ME, REACTIONS, useTribes, type Message, type Reaction, type Tribe } from '@/features/tribes/TribesContext';
import { colors, fonts, typography, webInputReset } from '@/theme/tokens';

const addIcon = require('../../../assets/icons/add-small-accent.svg');
const sendIcon = require('../../../assets/icons/send.svg');

export function ChatTab({ tribe }: { tribe: Tribe }) {
  const { sendMessage, toggleReaction } = useTribes();
  const { nickname } = useSignup();
  const [text, setText] = useState('');
  const [reactingTo, setReactingTo] = useState<Message | null>(null);
  const list = useRef<FlatList<Message>>(null);
  const me = { id: ME, name: nickname.trim() || 'Moi' };

  const send = () => {
    const value = text.trim();
    if (!value) return;
    sendMessage(tribe.id, me, { text: value });
    setText('');
  };

  const sendPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) sendMessage(tribe.id, me, { imageUri: result.assets[0].uri });
  };

  const react = (reaction: Reaction) => {
    if (reactingTo) toggleReaction(tribe.id, reactingTo.id, reaction);
    setReactingTo(null);
  };

  return (
    <View style={styles.flex}>
      <FlatList
        ref={list}
        data={tribe.messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <FadeIn offset={8}>
            <Bubble
              message={item}
              onLongPress={() => setReactingTo(item)}
              onToggle={(r) => toggleReaction(tribe.id, item.id, r)}
            />
          </FadeIn>
        )}
      />

      <View style={styles.inputBar}>
        <Pressable onPress={sendPhoto} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Envoyer une photo">
          <Image source={addIcon} style={styles.icon20} tintColor={colors.accent} accessible={false} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={send}
          placeholder="Votre message"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="send"
          style={[styles.input, webInputReset]}
          accessibilityLabel="Votre message"
        />
        <Pressable
          onPress={send}
          disabled={!text.trim()}
          style={[styles.iconButton, !text.trim() && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel="Envoyer"
        >
          <Image source={sendIcon} style={styles.icon20} tintColor={colors.accent} accessible={false} />
        </Pressable>
      </View>

      <Sheet visible={!!reactingTo} title="Réagir" onClose={() => setReactingTo(null)}>
        <View style={styles.reactionPicker}>
          {REACTIONS.map((r) => {
            const mine = reactingTo?.reactions[r]?.includes(ME);
            return (
              <Pressable
                key={r}
                onPress={() => react(r)}
                style={({ pressed }) => [styles.reactionOption, mine && styles.reactionMine, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Réagir ${r}`}
              >
                <Text style={styles.reactionEmoji}>{r}</Text>
              </Pressable>
            );
          })}
        </View>
      </Sheet>
    </View>
  );
}

function Bubble({ message, onLongPress, onToggle }: { message: Message; onLongPress: () => void; onToggle: (r: Reaction) => void }) {
  const mine = message.authorId === ME;
  const system = message.authorId === 'system';
  const reactions = (Object.entries(message.reactions) as [Reaction, string[]][]).filter(([, ids]) => ids.length > 0);

  if (system) {
    return (
      <View style={styles.systemRow}>
        <Text style={[typography.description, styles.systemText]}>{message.text}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, mine && styles.rowMine]}>
      {!mine && <Avatar name={message.authorName} size={36} />}
      <View style={[styles.column, mine && styles.columnMine]}>
        {!mine && <Text style={styles.author}>{message.authorName}</Text>}
        <Pressable
          onLongPress={onLongPress}
          delayLongPress={300}
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}
          accessibilityHint="Appui long pour réagir"
        >
          {message.imageUri && <Image source={{ uri: message.imageUri }} style={styles.photo} contentFit="cover" />}
          {message.text && <Text style={[styles.text, mine && styles.textMine]}>{message.text}</Text>}
          <Text style={[styles.time, mine && styles.timeMine]}>{formatTime(message.createdAt)}</Text>
        </Pressable>
        {reactions.length > 0 && (
          <View style={[styles.reactions, mine && styles.reactionsMine]}>
            {reactions.map(([r, ids]) => (
              <Pressable
                key={r}
                onPress={() => onToggle(r)}
                style={[styles.chip, ids.includes(ME) && styles.chipMine]}
                accessibilityRole="button"
                accessibilityLabel={`${r} ${ids.length}`}
              >
                <Text style={styles.chipText}>
                  {r} {ids.length}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingVertical: 16, gap: 16 },
  systemRow: { alignItems: 'center', paddingHorizontal: 32 },
  systemText: { textAlign: 'center' },
  row: { flexDirection: 'row', gap: 16, paddingHorizontal: 12, alignItems: 'flex-start' },
  rowMine: { justifyContent: 'flex-end' },
  column: { flex: 1, gap: 4, alignItems: 'flex-start' },
  columnMine: { alignItems: 'flex-end', paddingLeft: 52 },
  author: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  bubble: { padding: 12, paddingBottom: 20, gap: 8, maxWidth: '100%', minWidth: 72 },
  bubbleOther: {
    backgroundColor: 'rgba(71,173,255,0.1)',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bubbleMine: {
    backgroundColor: colors.accent,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  text: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  textMine: { color: colors.onAccent },
  time: { position: 'absolute', right: 8, bottom: 4, fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.textSecondary },
  timeMine: { color: 'rgba(0,0,0,0.55)' },
  photo: { width: 200, height: 200, borderRadius: 10 },
  reactions: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: -10, marginLeft: 8 },
  reactionsMine: { marginLeft: 0, marginRight: 8 },
  chip: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.sheet,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipMine: { borderColor: colors.accent, backgroundColor: colors.badgeSoftBg },
  chipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.textPrimary },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    backgroundColor: colors.background,
  },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  disabled: { opacity: 0.4 },
  icon20: { width: 20, height: 20 },
  input: {
    flex: 1,
    height: 36,
    borderWidth: 2,
    borderColor: colors.fieldBorderSoft,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
  },
  reactionPicker: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 12, paddingVertical: 16 },
  reactionOption: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  reactionMine: { backgroundColor: colors.badgeSoftBg },
  reactionEmoji: { fontSize: 28 },
  pressed: { transform: [{ scale: 1.15 }] },
});
