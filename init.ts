import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';

const folders = [
    'src',
    'src/commands/recruit',
    'src/commands/ops',
    'src/commands/pings',
    'src/commands/activity',
    'src/components/buttons',
    'src/components/modals',
    'src/components/embeds',
    'src/db/queries',
    'src/events',
    'src/settings',
    'src/utils',
    'src/config'
];

const files: Record<string, string> = {
    'src/index.ts': `console.log('✅ Бот стартует...');`,
    '.env': `BOT_TOKEN=\nDATABASE_URL=\n`,
    'src/commands/index.ts': `// Регистрируем все команды здесь`,
    'src/commands/recruit/startRecruit.ts': `// Команда /recruit с модалкой и созданием канала`,
    'src/commands/recruit/handleResponse.ts': `// Обработка кнопок Принять/Отклонить`,
    'src/commands/ops/createOp.ts': `// /op start`,
    'src/commands/ops/listOps.ts': `// /op list`,
    'src/commands/ops/respondToOp.ts': `// Обработка кнопок на опсе`,
    'src/commands/pings/sendPing.ts': `// /ping`,
    'src/commands/pings/respondToPing.ts': `// Ответы на флит-пинг`,
    'src/commands/activity/logUser.ts': `// /log user`,
    'src/components/index.ts': `// Экспорт UI компонентов`,
    'src/db/client.ts': `// Подключение к PostgreSQL`,
    'src/db/schema.sql': `-- SQL таблицы сюда`,
    'src/events/interactionCreate.ts': `// Обработка interactionCreate`,
    'src/events/guildCreate.ts': `// onGuildCreate`,
    'src/events/ready.ts': `// onReady`,
    'src/settings/manager.ts': `// Работа с guild_settings`,
    'src/settings/types.ts': `// Типы для настроек`,
    'src/utils/esi.ts': `// Поиск character_id через ESI`,
    'src/utils/logger.ts': `// Логгер`,
    'src/utils/time.ts': `// Хелперы времени`,
    'src/config/env.ts': `import dotenv from 'dotenv';\ndotenv.config();\n\nexport const config = {\n  token: process.env.BOT_TOKEN!,\n  db: process.env.DATABASE_URL!\n};`
};

const pkg = {
    name: 'eve-discord-bot',
    version: '1.0.0',
    main: 'src/index.ts',
    type: 'module',
    scripts: {
        dev: 'ts-node src/index.ts',
        start: 'node build/index.js',
        build: 'tsc'
    },
    dependencies: {
        'discord.js': '^14.14.1',
        'dotenv': '^16.4.5',
        'pg': '^8.11.5'
    },
    devDependencies: {
        'ts-node': '^10.9.2',
        'typescript': '^5.4.5',
        '@types/node': '^20.11.30'
    }
};

const tsconfig = {
    compilerOptions: {
        target: 'ES2022',
        module: 'ES2022',
        moduleResolution: 'node',
        outDir: 'build',
        esModuleInterop: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        skipLibCheck: true
    },
    include: ['src']
};

console.log('📁 Создаём директории...');
folders.forEach(dir => mkdirSync(dir, { recursive: true }));

console.log('📄 Создаём файл package.json...');
writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('📄 Создаём файл tsconfig.json...');
writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

console.log('📄 Создаём файлы проекта...');
for (const [filePath, content] of Object.entries(files)) {
    writeFileSync(filePath, content);
}

console.log('📦 Устанавливаем зависимости...');
execSync('npm install', { stdio: 'inherit' });

console.log('✅ Всё готово!');
