export const en = {
    setup: {
        title: 'Guild Settings',
        editButton: 'Edit Settings',
        modalTitle: 'Edit Guild Settings',
        fields: {
            language: 'Language (en, ru, cz)',
            officerRoleIds: 'Officer Role IDs (comma separated)',
            recruitCategoryId: 'Recruit Category ID',
            pingChannelId: 'Ping Channel ID',
            recruitAcceptedRoleId: 'Accepted Role ID',
            setNickname: 'Set Nickname? (true / false)',
        },
        success: '✅ Settings updated.',
        error: '❌ Something went wrong.',
    },
    recruit: {
        title: 'Join Our Corporation',
        description: 'Click the button below to apply for recruitment.',
        buttonLabel: 'Apply to Corp',

        accept: 'Accept',
        reject: 'Reject',
        submitted: '✅ Your application has been submitted!',
        accepted: '✅ Recruit accepted and role assigned.',
        rejected: '❌ Recruit rejected.',

        errors: {
            noAcceptedRole: '❌ Recruit accepted role is not set in guild settings.',
            notFound: '❌ Recruit not found.',
            addRoleFail: '❌ Failed to add role to user.',
            noPermission: '❌ You do not have permission to reject recruits.',
        },

        modal: {
            title: 'Recruitment Application',
            characterName: 'Character Name',
            experience: 'Experience (e.g. PvP, mining)',
            timezone: 'Timezone (e.g. EUTZ, USTZ)',
            source: 'How did you find us?',
        },

        rejectModal: {
            title: 'Reject Recruit',
            label: 'Reason for rejection',
        },

        fields: {
            characterName: 'Character',
            links: 'Links',
        },

        history: {
            title: '📋 Recruit History',
            noData: '⚠️ No recruit data found.',
            empty: '⚠️ No recruit data found.',
            statusFilter: 'Filter by status',
            page: (current: number, total: number) => `Page ${current} of ${total}`,
            statuses: {
                all: 'All',
                accepted: 'Accepted',
                rejected: 'Rejected',
                pending: 'Pending',
            }
        },
    },
    ops: {
        created: '✅ Operation created and posted.',
        invalidDate: '❌ Invalid date format. Use something like 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id is not set in guild settings.',
        invalidPingChannel: '❌ Cannot post in the configured ping_channel_id.',
        startTime: 'Start Time',
        footer: 'Click a button to respond to this op.',
        expired: '⏳ You cannot respond to a finished operation.',
        noPermission: '❌ You do not have permission to create ops.',
        ping: (name: string) => `Op **${name}** is starting now!`,
        responses: {
            yes: '✅ Going',
            no: '❌ Not Going',
            maybe: '❓ Maybe',
        },
        list: {
            title: '📅 Upcoming Ops',
            noUpcoming: '⚠️ No upcoming operations found.',
            page: (current: number, total: number) => `Page ${current} of ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Ping: ${name}`,
        description: 'Click a button to respond.',
        footer: 'You can respond within 15 minutes.',
        noPermission: '❌ You do not have permission to create ops.',
        notFound: '❌ This ping no longer exists.',
        expired: '⌛ You can no longer respond to this ping.',
        saved: (resp: string) => `✅ Your response **${resp}** has been saved.`,
    },
    common: {
        notAllowed: '❌ You are not allowed to use this command.',
    },
    activity: {
        title: (username: string) => `Activity for ${username}`,
        since: 'Since',
        ignored: 'Ignored',
        topMonth: 'Top 10 this month',
        topAll: 'Top 10 of all time',
        noData: 'No activity data found.',
    }




};
