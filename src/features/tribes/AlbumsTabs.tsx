// Tribe "Feed" (Figma 81:5005 / 108:4928) and "Souvenirs" (Figma 81:5184) tabs, dark theme.
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { FadeIn } from '@/components/FadeIn';
import { TextField } from '@/components/Field';
import { Sheet } from '@/components/Sheet';
import { useSignup } from '@/features/signup/SignupContext';
import { formatDay, ME, useTribes, type Album, type Tribe } from '@/features/tribes/TribesContext';
import { colors, fonts, spacing, typography } from '@/theme/tokens';

const feedIllustration = require('../../../assets/tribes/illustration-feed.svg');
const souvenirsIllustration = require('../../../assets/tribes/illustration-souvenirs.svg');

/** Feed: the latest albums shared in the tribe, newest first, with a like. */
export function FeedTab({ tribe }: { tribe: Tribe }) {
  const { toggleAlbumLike } = useTribes();

  if (tribe.albums.length === 0) {
    return (
      <EmptyState
        title="Retrouvez les derniers souvenirs partagés par vos proches."
        message="Dès qu’un album est partagé dans la tribu, il apparaît ici."
        illustration={feedIllustration}
        cardIllustration
      />
    );
  }

  return (
    <FlatList
      data={tribe.albums}
      keyExtractor={(a) => a.id}
      contentContainerStyle={styles.feed}
      renderItem={({ item, index }) => (
        <FadeIn delay={Math.min(index, 6) * 60}>
          <FeedCard album={item} onLike={() => toggleAlbumLike(tribe.id, item.id)} />
        </FadeIn>
      )}
    />
  );
}

function FeedCard({ album, onLike }: { album: Album; onLike: () => void }) {
  const liked = album.likes.includes(ME);
  const [cover, ...rest] = album.photos;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Avatar name={album.authorName} size={36} />
        <View style={styles.flex}>
          <Text style={typography.bodySStrong}>
            {album.authorId === ME ? 'Vous' : album.authorName}
            <Text style={typography.bodyS}> a partagé un album</Text>
          </Text>
          <Text style={typography.description}>{formatDay(album.createdAt)}</Text>
        </View>
      </View>
      <Image source={{ uri: cover }} style={styles.cover} contentFit="cover" />
      {rest.length > 0 && (
        <View style={styles.thumbs}>
          {rest.slice(0, 3).map((uri, i) => (
            <View key={uri} style={styles.thumbWrap}>
              <Image source={{ uri }} style={styles.thumb} contentFit="cover" />
              {i === 2 && rest.length > 3 && (
                <View style={styles.more}>
                  <Text style={typography.label}>+{rest.length - 3}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={[typography.label, styles.flex]} numberOfLines={1}>
          {album.title}
        </Text>
        <Pressable onPress={onLike} hitSlop={8} accessibilityRole="button" accessibilityLabel={liked ? 'Ne plus aimer' : 'J’aime'}>
          <Text style={styles.like}>
            {liked ? '❤️' : '🤍'} {album.likes.length > 0 ? album.likes.length : ''}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Souvenirs: grid of the tribe's albums + "Partager un Album". */
export function SouvenirsTab({ tribe }: { tribe: Tribe }) {
  const { addAlbum } = useTribes();
  const { nickname } = useSignup();
  const [photos, setPhotos] = useState<string[] | null>(null);
  const [title, setTitle] = useState('');

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 30,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotos(result.assets.map((a) => a.uri));
      setTitle('');
    }
  };

  const share = () => {
    if (!photos) return;
    addAlbum(tribe.id, { id: ME, name: nickname.trim() || 'Moi' }, title.trim() || `Souvenirs du ${formatDay(new Date())}`, photos);
    setPhotos(null);
  };

  return (
    <View style={styles.flex}>
      {tribe.albums.length === 0 ? (
        <EmptyState
          title="Partagez vos aventures avec vos proches"
          message="Rassemblez les photos d’un week-end, d’un anniversaire ou d’un simple apéro dans un album commun."
          illustration={souvenirsIllustration}
        />
      ) : (
        <FlatList
          data={tribe.albums}
          keyExtractor={(a) => a.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => (
            <FadeIn delay={Math.min(index, 6) * 60} style={styles.tile}>
              <Image source={{ uri: item.photos[0] }} style={styles.tileImage} contentFit="cover" />
              <Text style={typography.bodySStrong} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={typography.description}>
                {item.photos.length} photo{item.photos.length > 1 ? 's' : ''} · {formatDay(item.createdAt)}
              </Text>
            </FadeIn>
          )}
        />
      )}

      <View style={styles.footer}>
        <Button label="Partager un Album" onPress={pick} />
      </View>

      <Sheet visible={!!photos} title="Nouvel album" onClose={() => setPhotos(null)}>
        <View style={styles.sheetBody}>
          <FlatList
            horizontal
            data={photos ?? []}
            keyExtractor={(uri) => uri}
            contentContainerStyle={styles.preview}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <Image source={{ uri: item }} style={styles.previewImage} contentFit="cover" />}
          />
          <TextField value={title} onChangeText={setTitle} placeholder="Nom de l’album (ex : Week-end à Annecy)" autoFocus />
          <Button label={`Partager ${photos?.length ?? 0} photo${(photos?.length ?? 0) > 1 ? 's' : ''}`} onPress={share} />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  feed: { padding: spacing.screen, gap: 20 },
  card: { backgroundColor: colors.sheet, borderRadius: 12, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  cover: { width: '100%', aspectRatio: 4 / 3 },
  thumbs: { flexDirection: 'row', gap: 2, marginTop: 2 },
  thumbWrap: { flex: 1, aspectRatio: 1 },
  thumb: { width: '100%', height: '100%' },
  more: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  like: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.textPrimary },
  grid: { padding: spacing.screen, gap: 20 },
  gridRow: { gap: 12 },
  tile: { flex: 1, gap: 4, maxWidth: '50%' },
  tileImage: { width: '100%', aspectRatio: 1, borderRadius: 12, marginBottom: 4, backgroundColor: colors.sheet },
  footer: { padding: spacing.screen, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  sheetBody: { padding: spacing.screen, gap: 16 },
  preview: { gap: 8 },
  previewImage: { width: 72, height: 72, borderRadius: 8 },
});
