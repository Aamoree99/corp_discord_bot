export const ru = {
    setup: {
        title: 'Настройки гильдии',
        editButton: 'Редактировать настройки',
        modalTitle: 'Редактировать настройки гильдии',
        fields: {
            language: 'Язык (en, ru, cz)',
            officerRoleIds: 'ID ролей офицеров (через запятую)',
            recruitCategoryId: 'ID категории для рекрутов',
            pingChannelId: 'ID канала для пингов',
            recruitAcceptedRoleId: 'ID роли для принятых рекрутов',
            setNickname: 'Устанавливать ник? (true / false)',
        },
        success: '✅ Настройки обновлены.',
        error: '❌ Что-то пошло не так.',
    },
    recruit: {
        title: 'Присоединяйтесь к нашей корпорации',
        description: 'Нажмите кнопку ниже, чтобы подать заявку на рекрутинг.',
        buttonLabel: 'Подать заявку',

        accept: 'Принять',
        reject: 'Отклонить',
        submitted: '✅ Ваша заявка отправлена!',
        accepted: '✅ Рекрут принят и роль назначена.',
        rejected: '❌ Рекрут отклонён.',

        errors: {
            noAcceptedRole: '❌ Роль принятых рекрутов не настроена в настройках гильдии.',
            notFound: '❌ Рекрут не найден.',
            addRoleFail: '❌ Не удалось выдать роль пользователю.',
            noPermission: '❌ У вас нет прав для отклонения рекрутов.',
        },

        modal: {
            title: 'Заявка на рекрутинг',
            characterName: 'Имя персонажа',
            experience: 'Опыт (например, PvP, майнинг)',
            timezone: 'Часовой пояс (например, EUTZ, USTZ)',
            source: 'Как вы нас нашли?',
        },

        rejectModal: {
            title: 'Отклонение рекрута',
            label: 'Причина отклонения',
        },

        fields: {
            characterName: 'Персонаж',
            links: 'Ссылки',
        },

        history: {
            title: '📋 История рекрутов',
            noData: '⚠️ Данные о рекрутах не найдены.',
            empty: '⚠️ Данные о рекрутах не найдены.',
            statusFilter: 'Фильтр по статусу',
            page: (current: number, total: number) => `Страница ${current} из ${total}`,
            statuses: {
                all: 'Все',
                accepted: 'Принятые',
                rejected: 'Отклонённые',
                pending: 'В ожидании',
            }
        },
    },
    ops: {
        created: '✅ Операция создана и опубликована.',
        invalidDate: '❌ Неверный формат даты. Используйте, например, 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id не настроен в настройках гильдии.',
        invalidPingChannel: '❌ Невозможно отправить сообщение в указанный ping_channel_id.',
        startTime: 'Время начала',
        footer: 'Нажмите кнопку, чтобы ответить на операцию.',
        expired: '⏳ Вы не можете отвечать на завершённую операцию.',
        noPermission: '❌ У вас нет прав создавать операции.',
        ping: (name: string) => `Операция **${name}** начинается сейчас!`,
        responses: {
            yes: '✅ Иду',
            no: '❌ Не иду',
            maybe: '❓ Возможно',
        },
        list: {
            title: '📅 Предстоящие операции',
            noUpcoming: '⚠️ Предстоящие операции не найдены.',
            page: (current: number, total: number) => `Страница ${current} из ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Пинг: ${name}`,
        description: 'Нажмите кнопку, чтобы ответить.',
        footer: 'Ответ можно дать в течение 15 минут.',
        noPermission: '❌ У вас нет прав создавать операции.',
        notFound: '❌ Этот пинг больше не существует.',
        expired: '⌛ Вы больше не можете отвечать на этот пинг.',
        saved: (resp: string) => `✅ Ваш ответ **${resp}** сохранён.`,
    },
    common: {
        notAllowed: '❌ У вас нет прав использовать эту команду.',
    },
    activity: {
        title: (username: string) => `Активность пользователя ${username}`,
        since: 'С',
        ignored: 'Игнорировано',
        topMonth: 'Топ-10 за этот месяц',
        topAll: 'Топ-10 за всё время',
        noData: 'Данные об активности не найдены.',
    }
};
