import { SORT_DIRECTION } from './generic-todo-store.mjs';
import { BaseComponent } from '../core/base-component.mjs';

export class GenericTodoComponent extends BaseComponent {
    listConfig = null;
    store = null;

    constructor(store) {
        super();
        this.store = store;
        this.store.refreshCb = this.refresh;
        this.listConfig = store.listConfig;
    }

    renderList = () => {
        const rows = this.store.getItems().map(item => this.renderLi(item));
        const list = { tagName: 'ul', attributes: this.listConfig.attributes, children: rows };
        return { tagName: 'div', attributes: { className: 'list-container' }, children: [list] };
    }

    renderLi = (item) => {

        const liAttributes = {};
        const spans = this.listConfig.components.map(component => {
            if(component.id == 'dueDate' && new Date(component.getCellValue(item)) < new Date()) {
                liAttributes.className = 'expired';
            } 
            component.attributes.className = component.id;
            const span = this.renderSpan(component.attributes, [component.getCellValue(item)]);
            return span;
        });

        const deleteAction = { tagName: 'button', attributes: { className: 'delete-btn', onclick: () => this.store.delete(item) }, children: ['delete'] };

        const actions = [deleteAction];
        const action = this.renderSpan({}, actions);
        return { tagName: 'li', attributes: liAttributes, children: [...spans, action] };
    }

    renderSpan = (attributes, children) => {
        return { tagName: 'span', attributes, children };
    }

    renderSortBy = () => {
        const options = this.listConfig.components.map(component => {
             return { tagName: 'option', attribtues: component.attributes, children: [component.id]}
        }); 

        const attributes = { className: 'sortable' };
        attributes.onchange = (evt) => {
            this.store.setSort(evt.target.value);
        }
        const select = { tagName: 'select', attributes: attributes, children: options};
        const label = { tagName: 'label', children: ["sort by:"]};

        return { 
            tagName: 'div', 
            attribtues: { className: 'sort-container' }, 
            children: [label, select]
        };
    }

    render() {
        const children = [
            this.renderSortBy(),
            //this.renderHeadRow(),
            // this.renderAddButton(),
            this.renderList()
        ];
        return this.renderElement({ tagName: 'div', attributes: { className: 'generic-todo' }, children });
    }
}
