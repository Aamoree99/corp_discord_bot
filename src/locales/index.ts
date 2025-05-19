import { en } from './en';
import { ru } from './ru';
import { de } from './de';
import { fr } from './fr';
import { es } from './es';
import { cz } from './cz';

export const locales = {
    en,
    ru,
    de,
    fr,
    es,
    cz,
};

export type LocaleCode = keyof typeof locales;

export function getLocale(code: string | null | undefined) {
    if (!code || !(code in locales)) return locales.en;
    return locales[code as LocaleCode];
}
