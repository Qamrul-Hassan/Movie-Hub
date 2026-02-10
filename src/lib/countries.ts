export const countryCategories = [
  { key: 'bn', label: 'Bangla' },
  { key: 'hi', label: 'Hindi' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: 'Japanese' },
  { key: 'zh', label: 'Chinese' },
  { key: 'fr', label: 'French' },
  { key: 'es', label: 'Spanish' },
  { key: 'ms', label: 'Malay' },
  { key: 'ko', label: 'Korean' },
  { key: 'tr', label: 'Turkish' },
  { key: 'ur', label: 'Pakistani' },
] as const

export type CountryKey = (typeof countryCategories)[number]['key']

export const countryLabelMap: Record<CountryKey, string> = {
  bn: 'Bangla',
  hi: 'Hindi',
  en: 'English',
  ja: 'Japanese',
  zh: 'Chinese',
  fr: 'French',
  es: 'Spanish',
  ms: 'Malay',
  ko: 'Korean',
  tr: 'Turkish',
  ur: 'Pakistani',
}

export const isCountryKey = (value: string): value is CountryKey =>
  countryCategories.some((country) => country.key === value)
