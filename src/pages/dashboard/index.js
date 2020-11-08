import RangePicker from '../../components/range-picker/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import ColumnChart from '../../components/column-chart/index.js';
import header from './bestsellers-header.js';
import ProductForm from '../../components/product-form';

//import fetchJson from './utils/fetch-json.js';

const PREFIX_URL = 'api/dashboard/';

export default class Page {
  element; // HTMLElement
  subElements = {};

  constructor () {
    this.to = new Date();
    this.from = new Date();
    this.from.setMonth(this.to.getMonth()-1);
  }

  async render () {
    this.initComponents();

    const div = document.createElement('div');
    div.innerHTML = this.template();
    this.element = div;
    this.element.append(this.sortableTable.element);

    this.installComponent(this.rangePicker.element,'rangepicker');
    this.installComponent(this.ordersChart.element,'dashboard__chart_orders');
    this.installComponent(this.salesChart.element,'dashboard__chart_sales');
    this.installComponent(this.customersChart.element,'dashboard__chart_customers');

    this.subElements = {
      sortableTable: this.sortableTable.element,
      rangePicker: this.rangePicker.element,
      ordersChart: this.ordersChart.element,
      salesChart: this.salesChart.element,
      customersChart: this.customersChart.element,
    };

    this.initEventListeners();

    return this.element;
  }

  initComponents() {
    const range = {from: this.from, to: this.to};

    this.rangePicker = new RangePicker(range);

    this.sortableTable = new SortableTable(header, {
      url: PREFIX_URL + 'bestsellers',
      loadParams: {from: this.from.toISOString(), to: this.to.toISOString()},
    });

    this.ordersChart = new ColumnChart({label: 'Заказы',
      link: '/sales',
      url: PREFIX_URL + 'orders',
      range: range,
    });

    this.salesChart = new ColumnChart({label: 'Продажи',
      link: '',
      url: PREFIX_URL + 'sales',
      range: range,
    });

    this.customersChart = new ColumnChart({label: 'Клиенты',
      link: '',
      url: PREFIX_URL + 'customers',
      range: range,
    });
  }

  installComponent (element, className) {
    const place = this.element.querySelector(`.${className}`);
    place.after(element);
    place.remove();
    element.classList.add(className);
  }

  template () {
    return `<div class="dashboard full-height flex-column">
      <div class="content__top-panel"><h2 class="page-title">Панель управления</h2>
      <div class="rangepicker">Вместо этого встанет rangePicker</div>
    </div></div>
    <div class="dashboard__charts">
        <div class="column-chart dashboard__chart_orders">Вместо этого встанет ordersChart</div>
        <div class="column-chart dashboard__chart_sales">Вместо этого встанет salesChart</div>
        <div class="column-chart dashboard__chart_customers">Вместо этого встанет customersChart</div>
    </div>
    <h3 class="block-title">Лидеры продаж</h3>`;
  }

  initEventListeners () {
    document.addEventListener('date-select', this.onDateSelect);
  }

  onDateSelect = (event) => {
    const from = event.detail.from;
    const to = event.detail.to;
    this.ordersChart.update(from, to);
    this.customersChart.update(from, to);
    this.salesChart.update(from, to);
    this.sortableTable.updateLoadParams({from: from.toISOString(), to: to.toISOString()});
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();

    document.removeEventListener('date-select', this.onDateSelect);

    this.rangePicker.destroy();
    this.sortableTable.destroy();
    this.ordersChart.destroy();
    this.salesChart.destroy();
    this.customersChart.destroy();
  }

}
