import { Combo, ResourceStore } from '@bryntum/calendar';

export default class InviteeSelector extends Combo {
    static $name = 'InviteeSelector';

    static type = 'inviteeSelector';

    static get configurable() {
        return {
            store        : new ResourceStore(),
            label        : 'Invitees',
            displayField : 'name',
            multiSelect  : true,
            editable     : false
        };
    }

    construct() {
        super.construct(...arguments);

        this.store = this.crudManager.resourceStore;
    }
}

// Register this type with its factory
InviteeSelector.initClass();
