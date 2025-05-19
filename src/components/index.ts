import * as setupEdit from './buttons/setupEdit';
import * as toggleNickname from './buttons/toggleNickname';
import * as recruitApply from './buttons/recruitApply';
import * as recruitAccept from './buttons/recruitAccept';
import * as recruitReject from './buttons/recruitReject';
import * as opResponse from './buttons/opResponse';
import * as pingResponse from './buttons/pingResponse'; // 🆕

import * as setupModal from './modals/setupModal';
import * as recruitForm from './modals/recruitForm';
import * as recruitRejectReason from './modals/recruitRejectReason';

function match(customId: string, handlers: Record<string, (i: any) => any>) {
    return Object.entries(handlers).find(([key]) => customId.startsWith(key))?.[1];
}

export function getButtonHandler(customId: string) {
    const map = {
        'setup:edit': setupEdit.handle,
        'setup:toggle-nickname': toggleNickname.handle,
        'recruit:apply': recruitApply.handle,
        'recruit:accept': recruitAccept.handle,
        'recruit:reject': recruitReject.handle,
        'op:': opResponse.handle,
        'ping:': pingResponse.handle, // ✅ добавлено
    };
    return match(customId, map);
}

export function getModalHandler(customId: string) {
    const map = {
        'setup:modal': setupModal.handle,
        'recruit:form': recruitForm.handle,
        'recruit:reject:reason': recruitRejectReason.handle,
    };
    return match(customId, map);
}
