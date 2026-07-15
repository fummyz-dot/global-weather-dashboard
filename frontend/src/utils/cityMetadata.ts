export interface CityDisplayMetadata {
  englishName: string;
  countryCode: string;
  flag: string;
}

const CITY_METADATA: Record<string, CityDisplayMetadata> = {
  tokyo: { englishName: "Tokyo", countryCode: "JP", flag: "🇯🇵" },
  osaka: { englishName: "Osaka", countryCode: "JP", flag: "🇯🇵" },
  sapporo: { englishName: "Sapporo", countryCode: "JP", flag: "🇯🇵" },
  barcelona: { englishName: "Barcelona", countryCode: "ES", flag: "🇪🇸" },
  paris: { englishName: "Paris", countryCode: "FR", flag: "🇫🇷" },
  rome: { englishName: "Rome", countryCode: "IT", flag: "🇮🇹" },
};

const FALLBACK_METADATA: CityDisplayMetadata = {
  englishName: "Unknown city",
  countryCode: "--",
  flag: "🌍",
};

export function getCityMetadata(slug: string): CityDisplayMetadata {
  return CITY_METADATA[slug] ?? FALLBACK_METADATA;
}
