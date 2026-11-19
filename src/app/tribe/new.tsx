// Tribe creation — step "Créer" (Figma 106:4061), dark theme.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components/Field';
import { PhotoPicker } from '@/components/PhotoPicker';
import { StepScreen } from '@/components/StepScreen';
import { TRIBE_STEPS, useTribes } from '@/features/tribes/TribesContext';
import { typography } from '@/theme/tokens';

export default function NewTribe() {
  const { draft, setDraft } = useTribes();

  return (
    <StepScreen
      title="Créez votre tribu"
      steps={{ labels: TRIBE_STEPS, current: 0 }}
      progress={{ step: 1, total: TRIBE_STEPS.length }}
      nextLabel="Créez"
      onBack={() => router.back()}
      onNext={() => router.push('/tribe/invite')}
      nextDisabled={draft.name.trim().length === 0}
    >
      <View style={styles.content}>
        <Text style={[typography.body, styles.center, styles.subtitle]}>La famille, la bande d’amis, le club du jeudi… Donnez un nom et une photo à votre cercle.</Text>
        <PhotoPicker uri={draft.photoUri} onChange={(photoUri) => setDraft({ photoUri })} label="Choisir une photo de tribu" />
        <TextField
          value={draft.name}
          onChangeText={(name) => setDraft({ name })}
          placeholder="Nom de ma tribu"
          autoCapitalize="sentences"
          autoFocus
          returnKeyType="done"
          maxLength={40}
          accessibilityLabel="Nom de ma tribu"
        />
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, alignItems: 'center', alignSelf: 'stretch' },
  center: { textAlign: 'center' },
  subtitle: { marginTop: -8 },
});
