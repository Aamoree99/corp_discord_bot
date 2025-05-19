export const fr = {
    setup: {
        title: 'Paramètres de la guilde',
        editButton: 'Modifier les paramètres',
        modalTitle: 'Modifier les paramètres de la guilde',
        fields: {
            language: 'Langue (en, ru, cz)',
            officerRoleIds: 'IDs des rôles officiers (séparés par des virgules)',
            recruitCategoryId: 'ID de la catégorie de recrutement',
            pingChannelId: 'ID du canal de ping',
            recruitAcceptedRoleId: 'ID du rôle accepté',
            setNickname: 'Définir le pseudo ? (true / false)',
        },
        success: '✅ Paramètres mis à jour.',
        error: '❌ Une erreur est survenue.',
    },
    recruit: {
        title: 'Rejoignez notre corporation',
        description: 'Cliquez sur le bouton ci-dessous pour postuler.',
        buttonLabel: 'Postuler',

        accept: 'Accepter',
        reject: 'Rejeter',
        submitted: '✅ Votre candidature a été envoyée !',
        accepted: '✅ Recrue acceptée et rôle attribué.',
        rejected: '❌ Recrue rejetée.',

        errors: {
            noAcceptedRole: '❌ Le rôle des recrues acceptées n\'est pas défini.',
            notFound: '❌ Recrue non trouvée.',
            addRoleFail: '❌ Échec de l\'attribution du rôle.',
            noPermission: '❌ Vous n\'avez pas la permission de rejeter des recrues.',
        },

        modal: {
            title: 'Formulaire de recrutement',
            characterName: 'Nom du personnage',
            experience: 'Expérience (ex. PvP, minage)',
            timezone: 'Fuseau horaire (ex. EUTZ, USTZ)',
            source: 'Comment nous avez-vous trouvé ?',
        },

        rejectModal: {
            title: 'Rejeter la recrue',
            label: 'Motif du rejet',
        },

        fields: {
            characterName: 'Personnage',
            links: 'Liens',
        },

        history: {
            title: '📋 Historique des recrues',
            noData: '⚠️ Aucune donnée de recrue trouvée.',
            empty: '⚠️ Aucune donnée de recrue trouvée.',
            statusFilter: 'Filtrer par statut',
            page: (current: number, total: number) => `Page ${current} sur ${total}`,
            statuses: {
                all: 'Tous',
                accepted: 'Acceptés',
                rejected: 'Rejetés',
                pending: 'En attente',
            }
        },
    },
    ops: {
        created: '✅ Opération créée et publiée.',
        invalidDate: '❌ Format de date invalide. Utilisez par exemple 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id non configuré.',
        invalidPingChannel: '❌ Impossible d\'envoyer un message dans le canal de ping configuré.',
        startTime: 'Heure de début',
        footer: 'Cliquez sur un bouton pour répondre à cette opération.',
        expired: '⏳ Vous ne pouvez pas répondre à une opération terminée.',
        noPermission: '❌ Vous n\'avez pas la permission de créer des opérations.',
        ping: (name: string) => `L'opération **${name}** commence maintenant !`,
        responses: {
            yes: '✅ Participe',
            no: '❌ Ne participe pas',
            maybe: '❓ Peut-être',
        },
        list: {
            title: '📅 Opérations à venir',
            noUpcoming: '⚠️ Aucune opération à venir trouvée.',
            page: (current: number, total: number) => `Page ${current} sur ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Ping : ${name}`,
        description: 'Cliquez sur un bouton pour répondre.',
        footer: 'Vous pouvez répondre dans les 15 minutes.',
        noPermission: '❌ Vous n\'avez pas la permission de créer des opérations.',
        notFound: '❌ Ce ping n\'existe plus.',
        expired: '⌛ Vous ne pouvez plus répondre à ce ping.',
        saved: (resp: string) => `✅ Votre réponse **${resp}** a été enregistrée.`,
    },
    common: {
        notAllowed: '❌ Vous n\'êtes pas autorisé à utiliser cette commande.',
    },
    activity: {
        title: (username: string) => `Activité de ${username}`,
        since: 'Depuis',
        ignored: 'Ignoré',
        topMonth: 'Top 10 ce mois-ci',
        topAll: 'Top 10 de tous les temps',
        noData: 'Aucune donnée d\'activité trouvée.',
    }
};
