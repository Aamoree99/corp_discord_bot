export const cz = {
    setup: {
        title: 'Nastavení gildy',
        editButton: 'Upravit nastavení',
        modalTitle: 'Upravit nastavení gildy',
        fields: {
            language: 'Jazyk (en, ru, cz)',
            officerRoleIds: 'ID rolí důstojníků (oddělené čárkou)',
            recruitCategoryId: 'ID kategorie náboru',
            pingChannelId: 'ID kanálu pro pingy',
            recruitAcceptedRoleId: 'ID role pro přijaté náboráře',
            setNickname: 'Nastavit přezdívku? (true / false)',
        },
        success: '✅ Nastavení aktualizováno.',
        error: '❌ Něco se pokazilo.',
    },
    recruit: {
        title: 'Přidejte se k naší korporaci',
        description: 'Klikněte na tlačítko níže a přihlaste se do náboru.',
        buttonLabel: 'Přihlásit se',

        accept: 'Přijmout',
        reject: 'Odmítnout',
        submitted: '✅ Vaše přihláška byla odeslána!',
        accepted: '✅ Náborář přijat a role přiřazena.',
        rejected: '❌ Náborář odmítnut.',

        errors: {
            noAcceptedRole: '❌ Role přijatých náborářů není nastavena.',
            notFound: '❌ Náborář nenalezen.',
            addRoleFail: '❌ Nepodařilo se přidat roli uživateli.',
            noPermission: '❌ Nemáte oprávnění odmítnout náboráře.',
        },

        modal: {
            title: 'Náborová přihláška',
            characterName: 'Jméno postavy',
            experience: 'Zkušenosti (např. PvP, těžba)',
            timezone: 'Časové pásmo (např. EUTZ, USTZ)',
            source: 'Jak jste nás našli?',
        },

        rejectModal: {
            title: 'Odmítnout náboráře',
            label: 'Důvod odmítnutí',
        },

        fields: {
            characterName: 'Postava',
            links: 'Odkazy',
        },

        history: {
            title: '📋 Historie náboru',
            noData: '⚠️ Nebyly nalezeny žádné údaje o náboru.',
            empty: '⚠️ Nebyly nalezeny žádné údaje o náboru.',
            statusFilter: 'Filtr podle stavu',
            page: (current: number, total: number) => `Stránka ${current} z ${total}`,
            statuses: {
                all: 'Vše',
                accepted: 'Přijati',
                rejected: 'Odmítnuti',
                pending: 'Čekající',
            }
        },
    },
    ops: {
        created: '✅ Operace vytvořena a zveřejněna.',
        invalidDate: '❌ Neplatný formát data. Použijte např. 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id není nastaven v nastavení gildy.',
        invalidPingChannel: '❌ Nelze odeslat zprávu do nastaveného ping_channel_id.',
        startTime: 'Čas začátku',
        footer: 'Klikněte na tlačítko pro odpověď na operaci.',
        expired: '⏳ Nemůžete odpovídat na ukončené operace.',
        noPermission: '❌ Nemáte oprávnění vytvářet operace.',
        ping: (name: string) => `Operace **${name}** právě začíná!`,
        responses: {
            yes: '✅ Jdu',
            no: '❌ Nejdu',
            maybe: '❓ Možná',
        },
        list: {
            title: '📅 Nadcházející operace',
            noUpcoming: '⚠️ Nebyly nalezeny žádné nadcházející operace.',
            page: (current: number, total: number) => `Stránka ${current} z ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Ping: ${name}`,
        description: 'Klikněte na tlačítko pro odpověď.',
        footer: 'Odpovědi jsou možné do 15 minut.',
        noPermission: '❌ Nemáte oprávnění vytvářet operace.',
        notFound: '❌ Tento ping již neexistuje.',
        expired: '⌛ Už nemůžete odpovědět na tento ping.',
        saved: (resp: string) => `✅ Vaše odpověď **${resp}** byla uložena.`,
    },
    common: {
        notAllowed: '❌ Nemáte oprávnění používat tento příkaz.',
    },
    activity: {
        title: (username: string) => `Aktivita uživatele ${username}`,
        since: 'Od',
        ignored: 'Ignorováno',
        topMonth: 'Top 10 tento měsíc',
        topAll: 'Top 10 za všecky časy',
        noData: 'Nebyly nalezeny žádné údaje o aktivitě.',
    }
};
