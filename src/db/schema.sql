CREATE TABLE guild_settings (
                                id SERIAL PRIMARY KEY,
                                guild_id TEXT UNIQUE NOT NULL,
                                language TEXT DEFAULT 'en',
                                officer_role_ids TEXT[],                 -- Массив Discord Role ID
                                recruit_category_id TEXT,               -- ID категории для каналов рекрутов
                                ping_channel_id TEXT,                   -- Канал для флит-пингов
                                recruit_accepted_role_id TEXT,          -- Роль, выдаваемая при принятии
                                set_nickname BOOLEAN DEFAULT TRUE,      -- Устанавливать ли ник на имя персонажа
                                active_until TIMESTAMP,                 -- До какой даты бот активен на сервере
                                created_at TIMESTAMP DEFAULT NOW(),
                                updated_at TIMESTAMP
);

CREATE TABLE recruits (
                          id SERIAL PRIMARY KEY,
                          guild_id TEXT NOT NULL,
                          user_id TEXT NOT NULL,                   -- Discord ID пользователя
                          character_name TEXT NOT NULL,
                          source TEXT,                             -- Откуда узнал
                          experience TEXT,                         -- Игровой опыт
                          timezone TEXT,                           -- Часовой пояс
                          channel_id TEXT,                         -- ID приватного канала
                          status TEXT DEFAULT 'pending',          -- 'pending', 'accepted', 'rejected'
                          decided_by TEXT,                         -- Кто принял/отклонил (Discord ID)
                          decision_reason TEXT,                    -- Причина отказа (если есть)
                          decided_at TIMESTAMP,
                          created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ops (
                     id SERIAL PRIMARY KEY,
                     guild_id TEXT NOT NULL,
                     name TEXT NOT NULL,
                     description TEXT,
                     start_time TIMESTAMP NOT NULL,
                     ping_sent BOOLEAN DEFAULT FALSE,
                     created_by TEXT NOT NULL,               -- Discord ID FC
                     created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE op_responses (
                              id SERIAL PRIMARY KEY,
                              op_id INTEGER NOT NULL REFERENCES ops(id) ON DELETE CASCADE,
                              user_id TEXT NOT NULL,                  -- Discord ID
                              response TEXT CHECK (response IN ('yes', 'no', 'maybe')),
                              responded_at TIMESTAMP DEFAULT NOW(),
                              UNIQUE(op_id, user_id)                  -- Один пользователь — один ответ на оп
);

CREATE TABLE pings (
                       id SERIAL PRIMARY KEY,
                       guild_id TEXT NOT NULL,
                       message TEXT NOT NULL,
                       created_by TEXT NOT NULL,               -- Discord ID
                       created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ping_responses (
                                id SERIAL PRIMARY KEY,
                                ping_id INTEGER NOT NULL REFERENCES pings(id) ON DELETE CASCADE,
                                user_id TEXT NOT NULL,
                                response TEXT CHECK (response IN ('yes', 'no', 'maybe')),
                                responded_at TIMESTAMP DEFAULT NOW(),
                                UNIQUE(ping_id, user_id)
);
