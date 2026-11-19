import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

type Props = { uri?: string | null; name?: string; size?: number };

/** Round avatar (Figma "Avatar"): photo when available, otherwise initials on the placeholder grey. */
export function Avatar({ uri, name, size = 40 }: Props) {
  const initials = (name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
      ) : (
        initials.length > 0 && <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: colors.avatarPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { fontFamily: fonts.bold, color: colors.background },
});
