export type Country = { code: string; name: string; dialCode: string };

export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'BE', name: 'Belgique', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', dialCode: '+41' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352' },
  { code: 'MC', name: 'Monaco', dialCode: '+377' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'ES', name: 'Espagne', dialCode: '+34' },
  { code: 'IT', name: 'Italie', dialCode: '+39' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'MA', name: 'Maroc', dialCode: '+212' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225' },
];
