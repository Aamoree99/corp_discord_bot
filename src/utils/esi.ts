import fetch from 'node-fetch';

type ESIResponse = {
    characters?: {
        id: number;
        name: string;
    }[];
};

export async function getCharacterId(name: string): Promise<number | null> {
    try {
        const response = await fetch('https://esi.evetech.net/latest/universe/ids/?datasource=tranquility&language=en', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([name])
        });

        if (!response.ok) return null;

        const data = await response.json() as ESIResponse;

        const char = data.characters?.find(c => c.name.toLowerCase() === name.toLowerCase());
        return char?.id ?? null;
    } catch (err) {
        console.error('❌ ESI request failed:', err);
        return null;
    }
}
