import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

/** Figma "Checkbox" size S (24×24 box, 2px border, 3px radius). Purely visual: the parent row handles presses. */
export function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={styles.container}>
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <Text style={styles.mark}>✓</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 24, height: 24, padding: 2 },
  box: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: colors.fieldBorderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.accent, borderColor: colors.accent },
  mark: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 14, color: colors.onAccent },
});
