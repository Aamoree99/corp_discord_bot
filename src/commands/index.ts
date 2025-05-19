import { data as setupData } from './setup/builder';
import { execute as setupExecute } from './setup/execute';

import { data as recruitMsgData } from './recruitMessage/builder';
import { execute as recruitMsgExecute } from './recruitMessage/execute';

import { buildRecruitHistoryCommand } from './recruitHistory/builder';
import { execute as recruitHistoryExecute } from './recruitHistory/execute';

import { data as createOpData } from './ops/createOp';
import { execute as createOpExecute } from './ops/createOp';

import { data as listOpsData } from './ops/listOps';
import { execute as listOpsExecute } from './ops/listOps';

import { data as pingData } from './pings/builder';
import { execute as pingExecute } from './pings/execute';

import { data as activityData } from './activity/builder';
import { execute as activityExecute } from './activity/execute';

import { data as activityTopData } from './activityTop/builder';
import { execute as activityTopExecute } from './activityTop/execute';


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
