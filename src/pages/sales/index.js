import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import header from './sales-header.js';

export default class Page {
  element; // HTMLElement

  constructor () {
    this.to = new Date();
    this.from = new Date();
    this.from.setMonth(this.to.getMonth()-1);
  }

  async render () {
    const range = {
      createdAt_gte: this.from.toISOString(),
      createdAt_lte: this.to.toISOString(),
    };

    this.rangePicker = new RangePicker({from: this.from, to: this.to});

    this.sortableTable = new SortableTable(header, {
      url: 'api/rest/orders',
      loadParams: range,
    });

    const div = document.createElement('div');
    div.innerHTML = this.template();
    this.element = div;
    this.element.append(this.sortableTable.element);

    this.installComponent(this.rangePicker.element,'rangepicker');

    this.initEventListeners();

    return this.element;
  }

  installComponent (element, className) {
    const place = this.element.querySelector(`.${className}`);
    place.replaceWith(element);
    element.classList.add(className);
  }

  template () {
    return `<div class="sales full-height flex-column">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>
      <div class="rangepicker">Вместо этого встанет rangePicker</div>`;
  }

  initEventListeners () {
    document.addEventListener('date-select', this.onDateSelect);
  }

  onDateSelect = (event) => {
    const from = event.detail.from.toISOString();
    const to = event.detail.to.toISOString();
    this.sortableTable.updateLoadParams({createdAt_gte: from, createdAt_lte: to});
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();

    document.removeEventListener('date-select', this.onDateSelect);

    this.rangePicker.destroy();
    this.sortableTable.destroy();
  }

}
