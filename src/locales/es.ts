export const es = {
    setup: {
        title: 'Configuración de la guild',
        editButton: 'Editar configuración',
        modalTitle: 'Editar configuración de la guild',
        fields: {
            language: 'Idioma (en, ru, cz)',
            officerRoleIds: 'IDs de roles de oficiales (separados por coma)',
            recruitCategoryId: 'ID de categoría de reclutamiento',
            pingChannelId: 'ID de canal de ping',
            recruitAcceptedRoleId: 'ID de rol aceptado',
            setNickname: '¿Establecer apodo? (true / false)',
        },
        success: '✅ Configuración actualizada.',
        error: '❌ Algo salió mal.',
    },
    recruit: {
        title: 'Únete a nuestra corporación',
        description: 'Haz clic en el botón para postularte.',
        buttonLabel: 'Postular',

        accept: 'Aceptar',
        reject: 'Rechazar',
        submitted: '✅ Tu solicitud ha sido enviada.',
        accepted: '✅ Recluta aceptado y rol asignado.',
        rejected: '❌ Recluta rechazado.',

        errors: {
            noAcceptedRole: '❌ El rol de recluta aceptado no está configurado.',
            notFound: '❌ Recluta no encontrado.',
            addRoleFail: '❌ No se pudo asignar el rol al usuario.',
            noPermission: '❌ No tienes permiso para rechazar reclutas.',
        },

        modal: {
            title: 'Solicitud de reclutamiento',
            characterName: 'Nombre del personaje',
            experience: 'Experiencia (ej. PvP, minería)',
            timezone: 'Zona horaria (ej. EUTZ, USTZ)',
            source: '¿Cómo nos encontraste?',
        },

        rejectModal: {
            title: 'Rechazar recluta',
            label: 'Motivo del rechazo',
        },

        fields: {
            characterName: 'Personaje',
            links: 'Enlaces',
        },

        history: {
            title: '📋 Historial de reclutas',
            noData: '⚠️ No se encontraron datos de reclutas.',
            empty: '⚠️ No se encontraron datos de reclutas.',
            statusFilter: 'Filtrar por estado',
            page: (current: number, total: number) => `Página ${current} de ${total}`,
            statuses: {
                all: 'Todos',
                accepted: 'Aceptados',
                rejected: 'Rechazados',
                pending: 'Pendientes',
            }
        },
    },
    ops: {
        created: '✅ Operación creada y publicada.',
        invalidDate: '❌ Formato de fecha inválido. Usa por ejemplo 2025-06-01T18:00.',
        noPingChannel: '❌ ping_channel_id no está configurado.',
        invalidPingChannel: '❌ No se puede enviar mensaje al canal de ping configurado.',
        startTime: 'Hora de inicio',
        footer: 'Haz clic en un botón para responder a esta operación.',
        expired: '⏳ No puedes responder a una operación finalizada.',
        noPermission: '❌ No tienes permiso para crear operaciones.',
        ping: (name: string) => `¡La operación **${name}** empieza ahora!`,
        responses: {
            yes: '✅ Voy',
            no: '❌ No voy',
            maybe: '❓ Quizás',
        },
        list: {
            title: '📅 Próximas operaciones',
            noUpcoming: '⚠️ No se encontraron próximas operaciones.',
            page: (current: number, total: number) => `Página ${current} de ${total}`,
        }
    },
    pings: {
        title: (name: string) => `Ping: ${name}`,
        description: 'Haz clic en un botón para responder.',
        footer: 'Puedes responder dentro de 15 minutos.',
        noPermission: '❌ No tienes permiso para crear operaciones.',
        notFound: '❌ Este ping ya no existe.',
        expired: '⌛ Ya no puedes responder a este ping.',
        saved: (resp: string) => `✅ Tu respuesta **${resp}** ha sido guardada.`,
    },
    common: {
        notAllowed: '❌ No tienes permiso para usar este comando.',
    },
    activity: {
        title: (username: string) => `Actividad de ${username}`,
        since: 'Desde',
        ignored: 'Ignorado',
        topMonth: 'Top 10 este mes',
        topAll: 'Top 10 de todos los tiempos',
        noData: 'No se encontraron datos de actividad.',
    }
};
