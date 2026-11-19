// Sign in — Step 3 (Figma node 97:4146, restyled to the dark theme of steps 1–2): avatar + nickname.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components/Field';
import { PhotoPicker } from '@/components/PhotoPicker';
import { StepScreen } from '@/components/StepScreen';
import { useSignup } from '@/features/signup/SignupContext';
import { typography } from '@/theme/tokens';

export default function ProfileStep() {
  const { nickname, setNickname, avatarUri, setAvatarUri } = useSignup();

  return (
    <StepScreen
      title="Votre profil"
      progress={{ step: 3, total: 3 }}
      onBack={() => router.back()}
      onNext={() => router.replace('/tribes')}
      nextDisabled={nickname.trim().length === 0}
    >
      <View style={styles.content}>
        <Text style={[typography.body, styles.center]}>
          Votre nom et une photo de profil aideront vos proches à vous retrouver sur l’application.
        </Text>

        <PhotoPicker uri={avatarUri} onChange={setAvatarUri} />

        <TextField
          value={nickname}
          onChangeText={setNickname}
          placeholder="Votre petit nom"
          autoCapitalize="words"
          textContentType="nickname"
          autoFocus
          returnKeyType="done"
          maxLength={40}
          accessibilityLabel="Votre petit nom"
        />
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, alignItems: 'center', alignSelf: 'stretch', paddingTop: 17 },
  center: { textAlign: 'center' },
});
