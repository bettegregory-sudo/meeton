import { Platform, type TextStyle } from 'react-native';

// Design tokens extracted from the MeetOn Figma file.

/** Web only: hide the browser focus ring on text inputs (the field frame already shows the border). */
export const webInputReset: TextStyle = Platform.select({
  // 'none' is valid CSS for react-native-web but missing from RN's types.
  web: { outlineStyle: 'none' } as unknown as TextStyle,
  default: {},
});
export const colors = {
  background: '#0C131F',
  textPrimary: '#FFFFFF',
  textSecondary: '#858FA3',
  accent: '#47ADFF',
  onAccent: '#000000',
  border: '#858FA3',
  avatarPlaceholder: '#B5B7C0',
  sheet: '#161F2E',
  fieldBorderSoft: 'rgba(133,143,163,0.35)',
  divider: 'rgba(133,143,163,0.25)',
  iconButton: '#445371',
  badgeSoftBg: 'rgba(25,152,255,0.15)',
  badgeSoftText: '#47ADFF',
} as const;

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
} as const;

export const radius = {
  control: 6,
} as const;

export const spacing = {
  screen: 20,
} as const;

export const typography = {
  h1: { fontFamily: fonts.extraBold, fontSize: 28, lineHeight: 32, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 24, color: colors.textPrimary },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.textSecondary },
  label: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 24 },
  labelSmall: { fontFamily: fonts.semiBold, fontSize: 12, lineHeight: 16 },
  bodyS: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  bodySStrong: { fontFamily: fonts.semiBold, fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  description: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.textSecondary },
  badge: { fontFamily: fonts.semiBold, fontSize: 10, lineHeight: 12, letterSpacing: 0.4 },
} as const;
