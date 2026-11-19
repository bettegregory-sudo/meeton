import type { ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, typography, webInputReset } from '@/theme/tokens';

const FIELD_HEIGHT = 48;

/** Outlined container shared by inputs and select-like fields (Figma "Input", size L). */
function FieldFrame({ children, onPress }: { children: ReactNode; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.frame}>
        {children}
      </Pressable>
    );
  }
  return <View style={styles.frame}>{children}</View>;
}

type TextFieldProps = TextInputProps & { leading?: ReactNode };

export function TextField({ leading, style, ...props }: TextFieldProps) {
  return (
    <FieldFrame>
      {leading}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        selectionColor={colors.accent}
        style={[styles.input, style]}
        {...props}
      />
    </FieldFrame>
  );
}

type SelectFieldProps = {
  leading?: ReactNode;
  trailing?: ReactNode;
  value: ReactNode;
  onPress: () => void;
};

export function SelectField({ leading, trailing, value, onPress }: SelectFieldProps) {
  return (
    <FieldFrame onPress={onPress}>
      {leading}
      <View style={styles.flex}>{value}</View>
      {trailing}
    </FieldFrame>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: FIELD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.control,
    backgroundColor: colors.background,
    alignSelf: 'stretch',
  },
  flex: { flex: 1 },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    ...webInputReset,
  },
});
