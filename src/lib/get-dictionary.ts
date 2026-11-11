export type Locale = "ru" | "kk";

const dictionaries = {
  ru: () => import("@/dictionaries/ru.json").then((module) => module.default),
  kk: () => import("@/dictionaries/kk.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  if (locale === "kk") {
    return dictionaries.kk();
  }
  return dictionaries.ru();
};
