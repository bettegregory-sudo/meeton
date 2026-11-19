import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { COUNTRIES, type Country } from './countries';

type SignupState = {
  country: Country;
  setCountry: (country: Country) => void;
  phone: string;
  setPhone: (phone: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  avatarUri: string | null;
  setAvatarUri: (uri: string | null) => void;
};

const SignupContext = createContext<SignupState | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [phone, setPhone] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const value = useMemo(
    () => ({ country, setCountry, phone, setPhone, nickname, setNickname, avatarUri, setAvatarUri }),
    [country, phone, nickname, avatarUri],
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used inside <SignupProvider>');
  return ctx;
}

/** Digits only, without a leading 0 (national trunk prefix). */
export function normalizePhone(raw: string) {
  return raw.replace(/\D/g, '').replace(/^0+/, '');
}

export function isPhoneValid(raw: string) {
  const digits = normalizePhone(raw);
  return digits.length >= 6 && digits.length <= 14;
}
