import { Image } from 'expo-image';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, typography, webInputReset } from '@/theme/tokens';

const searchIcon = require('../../assets/icons/search.svg');

type Props = { value: string; onChangeText: (text: string) => void; placeholder?: string };

/** Figma "Input" size M with the search icon. */
export function SearchField({ value, onChangeText, placeholder = 'Recherche' }: Props) {
  return (
    <View style={styles.frame}>
      <Image source={searchIcon} style={styles.icon} accessible={false} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.accent}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.fieldBorderSoft,
    borderRadius: radius.control,
    backgroundColor: colors.background,
  },
  icon: { width: 20, height: 20 },
  input: {
    ...typography.bodyS,
    color: colors.textPrimary,
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    ...webInputReset,
  },
});
