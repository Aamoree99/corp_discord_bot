export const de = {
    setup: {
        title: 'Gilde Einstellungen',
        editButton: 'Einstellungen bearbeiten',
        modalTitle: 'Gildeinstellungen bearbeiten',
        fields: {
            language: 'Sprache (en, ru, cz)',
            officerRoleIds: 'Offiziersrollen IDs (Komma getrennt)',
            recruitCategoryId: 'Rekrut-Kategorie ID',
            pingChannelId: 'Ping-Kanal ID',
            recruitAcceptedRoleId: 'Akzeptierte Rolle ID',
            setNickname: 'Nickname setzen? (true / false)',
        },
        success: '✅ Einstellungen aktualisiert.',
        error: '❌ Ein Fehler ist aufgetreten.',
    },
    recruit: {
        title: 'Tritt unserer Corporation bei',
        description: 'Klicke unten, um dich zu bewerben.',
        buttonLabel: 'Bewerben',

        accept: 'Annehmen',
        reject: 'Ablehnen',
        submitted: '✅ Deine Bewerbung wurde gesendet!',
        accepted: '✅ Rekrut angenommen und Rolle vergeben.',
        rejected: '❌ Rekrut abgelehnt.',

        errors: {
            noAcceptedRole: '❌ Akzeptierte Rolle ist nicht eingestellt.',
            notFound: '❌ Rekrut nicht gefunden.',
            addRoleFail: '❌ Rolle konnte nicht vergeben werden.',
            noPermission: '❌ Du hast keine Berechtigung, Rekruten abzulehnen.',
        },

        modal: {
            title: 'Rekrutierungsantrag',
            characterName: 'Charaktername',
            experience: 'Erfahrung (z.B. PvP, Bergbau)',
            timezone: 'Zeitzone (z.B. EUTZ, USTZ)',
            source: 'Wie hast du uns gefunden?',
        },

        rejectModal: {
            title: 'Rekrut ablehnen',
            label: 'Ablehnungsgrund',
        },

        fields: {
            characterName: 'Charakter',
            links: 'Links',
        },

        history: {
            title: '📋 Rekrutierungshistorie',
            noData: '⚠️ Keine Rekrutdaten gefunden.',
            empty: '⚠️ Keine Rekrutdaten gefunden.',
            statusFilter: 'Nach Status filtern',
            page: (current: number, total: number) => `Seite ${current} von ${total}`,
            statuses: {
                all: 'Alle',
                accepted: 'Akzeptiert',
                rejected: 'Abgelehnt',
                pending: 'Ausstehend',
            }
        },
    },
    ops: {
        created: '✅ Operation erstellt und veröffentlicht.',
        invalidDate: '❌ Ungültiges Datumsformat. Beispiel: 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id ist nicht eingestellt.',
        invalidPingChannel: '❌ Nachricht konnte nicht im Ping-Kanal gesendet werden.',
        startTime: 'Startzeit',
        footer: 'Klicke eine Schaltfläche, um auf diese Operation zu antworten.',
        expired: '⏳ Antworten auf abgeschlossene Operationen nicht möglich.',
        noPermission: '❌ Keine Berechtigung, Operationen zu erstellen.',
        ping: (name: string) => `Operation **${name}** beginnt jetzt!`,
        responses: {
            yes: '✅ Gehe',
            no: '❌ Gehe nicht',
            maybe: '❓ Vielleicht',
        },
        list: {
            title: '📅 Kommende Operationen',
            noUpcoming: '⚠️ Keine kommenden Operationen gefunden.',
            page: (current: number, total: number) => `Seite ${current} von ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Ping: ${name}`,
        description: 'Klicke eine Schaltfläche, um zu antworten.',
        footer: 'Antworten innerhalb von 15 Minuten möglich.',
        noPermission: '❌ Keine Berechtigung, Operationen zu erstellen.',
        notFound: '❌ Dieser Ping existiert nicht mehr.',
        expired: '⌛ Antwortzeit für diesen Ping ist abgelaufen.',
        saved: (resp: string) => `✅ Deine Antwort **${resp}** wurde gespeichert.`,
    },
    common: {
        notAllowed: '❌ Du darfst diesen Befehl nicht verwenden.',
    },
    activity: {
        title: (username: string) => `Aktivität von ${username}`,
        since: 'Seit',
        ignored: 'Ignoriert',
        topMonth: 'Top 10 diesen Monat',
        topAll: 'Top 10 aller Zeiten',
        noData: 'Keine Aktivitätsdaten gefunden.',
    }
};
