import Sortable from 'sortablejs';

window.Sortable = Sortable;

if (typeof window.Livewire === 'undefined') {
    throw 'Livewire Sortable.js Plugin: window.Livewire is undefined. Make sure @livewireScripts is placed above this script include';
}

window.Livewire.directive('sortable', (el, directive, component) => {
    // Only fire this handler on the "root" directive.
    if (directive.modifiers.length > 0) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:sortable.options')) {
        options = (new Function(`return ${el.getAttribute('wire:sortable.options')};`))();
    }

    el.livewire_sortable = window.Sortable.create(el, {
        ...options,
        draggable: '[wire\\:sortable\\.item]',
        handle: el.querySelector('[wire\\:sortable\\.handle]') ? '[wire\\:sortable\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:sortable.item',
        group: {
            name: el.getAttribute('wire:sortable'),
            pull: false,
            put: false,
        },
        store: {
            set: function (sortable) {
                let items = sortable.toArray().map((value, index) => {
                    return {
                        order: index + 1,
                        value: value,
                    };
                });

                component.call(directive.method, items);
            },
        },
    });
});

window.Livewire.directive('sortable-group', (el, directive, component) => {
    // Only fire this handler on the "root" group directive.
    if (! directive.modifiers.includes('item-group')) {
        return;
    }

    let options = {};

    if (el.hasAttribute('wire:sortable-group.options')) {
        options = (new Function(`return ${el.getAttribute('wire:sortable-group.options')};`))();
    }

    el.livewire_sortable = window.Sortable.create(el, {
        ...options,
        draggable: '[wire\\:sortable-group\\.item]',
        handle: el.querySelector('[wire\\:sortable-group\\.handle]') ? '[wire\\:sortable-group\\.handle]' : null,
        sort: true,
        dataIdAttr: 'wire:sortable-group.item',
        group: {
            name: el.closest('[wire\\:sortable-group]').getAttribute('wire:sortable-group'),
            pull: true,
            put: true,
        },
        onSort: (e) => {
            let masterEl = el.closest('[wire\\:sortable-group]');

            var itemId        = e.item.id;
            var fromParentId  = e.from.id;
            var toParentId    = e.to.id;
            var oldIndex      = e.oldIndex;
            var newIndex      = e.newIndex;
        
            component.call(masterEl.getAttribute('wire:sortable-group'),itemId, oldIndex, newIndex, fromParentId, toParentId);
        },
    });
});
