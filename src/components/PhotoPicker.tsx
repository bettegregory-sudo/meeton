import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';

type Props = { uri: string | null; onChange: (uri: string) => void; label?: string };

/** 80px round photo + "Modifier" link, used by the profile and tribe-creation steps. */
export function PhotoPicker({ uri, onChange, label = 'Choisir une photo' }: Props) {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={pick} accessibilityRole="imagebutton" accessibilityLabel={label}>
        <Avatar uri={uri} size={80} />
      </Pressable>
      <Button label="Modifier" variant="ghost" size="s" onPress={pick} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8, alignItems: 'center' },
});
