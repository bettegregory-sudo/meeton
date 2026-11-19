import { Image } from 'expo-image';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/tokens';

const ICONS: Record<string, number> = {
  tribes: require('../../assets/icons/tab-tribes.svg'),
  events: require('../../assets/icons/tab-events.svg'),
  albums: require('../../assets/icons/tab-albums.svg'),
  menu: require('../../assets/icons/tab-menu.svg'),
};

/** Figma "Tab Bar": 4 items, the active one gets a top accent line and accent tint. */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === 'string' ? options.title : route.name;
        const tint = focused ? colors.accent : colors.textSecondary;

        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            style={[styles.item, focused && styles.itemActive]}
          >
            <Image source={ICONS[route.name]} style={styles.icon} tintColor={tint} accessible={false} />
            <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.sheet,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  item: {
    width: 76,
    height: 49,
    alignItems: 'center',
    paddingTop: 6,
    gap: 3,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  itemActive: { borderTopColor: colors.accent },
  icon: { width: 24, height: 24 },
  label: { fontSize: 11, lineHeight: 13, letterSpacing: 0.066 },
});
