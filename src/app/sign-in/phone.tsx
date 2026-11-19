// Sign in — Step 2 (Figma node 240:5356): country + phone number.
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SelectField, TextField } from '@/components/Field';
import { StepScreen } from '@/components/StepScreen';
import { CountryPicker } from '@/features/signup/CountryPicker';
import { isPhoneValid, useSignup } from '@/features/signup/SignupContext';
import { colors, typography } from '@/theme/tokens';

const flagIcon = require('../../../assets/signin/icon-flag.svg');
const chevronIcon = require('../../../assets/signin/icon-chevron-right.svg');

export default function PhoneStep() {
  const { country, setCountry, phone, setPhone } = useSignup();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <StepScreen
      title="Renseigner mon numéro"
      progress={{ step: 2, total: 3 }}
      onBack={() => router.back()}
      onNext={() => router.push('/sign-in/profile')}
      nextDisabled={!isPhoneValid(phone)}
    >
      <Text style={[typography.body, styles.center]}>
        Avec votre numéro, vos proches pourront vous retrouver et vous ajouter à une tribu.
      </Text>

      <View style={styles.fields}>
        <SelectField
          onPress={() => setPickerOpen(true)}
          leading={<Image source={flagIcon} style={styles.icon} accessible={false} />}
          value={<Text style={styles.value}>{country.name}</Text>}
          trailing={<Image source={chevronIcon} style={styles.icon} accessible={false} />}
        />
        <TextField
          leading={<Text style={styles.dialCode}>{country.dialCode}</Text>}
          value={phone}
          onChangeText={setPhone}
          placeholder="6 12 34 56 78"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoFocus
          maxLength={18}
          accessibilityLabel="Numéro de téléphone"
        />
      </View>

      <CountryPicker
        visible={pickerOpen}
        selected={country}
        onSelect={setCountry}
        onClose={() => setPickerOpen(false)}
      />
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  fields: { gap: 16, alignSelf: 'stretch' },
  icon: { width: 24, height: 24 },
  value: { ...typography.body, color: colors.textSecondary },
  dialCode: { ...typography.body, color: colors.textSecondary },
});
