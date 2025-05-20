import { data as setupData } from './setup/builder.js';
import { execute as setupExecute } from './setup/execute.js';

import { data as recruitMsgData } from './recruitMessage/builder.js';
import { execute as recruitMsgExecute } from './recruitMessage/execute.js';

import { buildRecruitHistoryCommand } from './recruitHistory/builder.js';
import { execute as recruitHistoryExecute } from './recruitHistory/execute.js';

import { data as createOpData } from './ops/createOp.js';
import { execute as createOpExecute } from './ops/createOp.js';

import { data as listOpsData } from './ops/listOps.js';
import { execute as listOpsExecute } from './ops/listOps.js';

import { data as pingData } from './pings/builder.js';
import { execute as pingExecute } from './pings/execute.js';

import { data as activityData } from './activity/builder.js';
import { execute as activityExecute } from './activity/execute.js';

import { data as activityTopData } from './activityTop/builder.js';
import { execute as activityTopExecute } from './activityTop/execute.js';


// используем язык по умолчанию — 'en'
const recruitHistoryData = buildRecruitHistoryCommand('en');

export const commands = [
    setupData.toJSON(),
    recruitMsgData.toJSON(),
    recruitHistoryData.toJSON(),
    createOpData.toJSON(),
    listOpsData.toJSON(),
    pingData.toJSON(),
    activityData.toJSON(),
    activityTopData.toJSON(),
];

export const commandHandlers = {
    [setupData.name]: setupExecute,
    [recruitMsgData.name]: recruitMsgExecute,
    [recruitHistoryData.name]: recruitHistoryExecute,
    [createOpData.name]: createOpExecute,
    [listOpsData.name]: listOpsExecute,
    [pingData.name]: pingExecute,
    [activityData.name]: activityExecute,
    [activityTopData.name]: activityTopExecute,
};
