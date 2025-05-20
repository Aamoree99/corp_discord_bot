import { en } from './en.js';
import { ru } from './ru.js';
import { de } from './de.js';
import { fr } from './fr.js';
import { es } from './es.js';
import { cz } from './cz.js';

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
