export interface Multilingual {
    french: string;
    spanish: string;
    italian: string;
    portuguese: string;
    english: string;
    german: string;
    russian: string;
    japanese: string;
}

export function createMultilingual(
    value: string,
    defaultLanguage: 'english' | 'french' = 'english'
): Multilingual {
    const multilingual: Partial<Multilingual> = {};
    multilingual[defaultLanguage] = value;
    return {
        french: '',
        spanish: '',
        italian: '',
        portuguese: '',
        english: '',
        german: '',
        russian: '',
        japanese: '',
        ...multilingual,
    } as Multilingual;
}
