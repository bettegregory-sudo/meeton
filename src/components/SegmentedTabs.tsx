import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

type Props<T extends string> = {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
};

/** Figma "Tabs" size S: text tabs with an accent underline on the selected one. */
export function SegmentedTabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  return (
    <View style={styles.row} accessibilityRole="tablist">
      {tabs.map((tab) => {
        const selected = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.label, { color: selected ? colors.accent : colors.textPrimary }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  tab: { paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  tabSelected: { borderBottomColor: colors.accent },
  label: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20 },
});
