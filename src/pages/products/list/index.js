import SortableTable from '../../../components/sortable-table/index.js';
import DoubleSlider from '../../../components/double-slider/index.js';
import header from './products-header.js';

export default class Page {
  element; // HTMLElement

  constructor () {
    this.loadParams = {
      price_gte: 0,
      price_lte: 4000,
    }
  }

  async render () {
    this.sortableTable = new SortableTable(header, {
      url: 'api/rest/products',
      loadParams: this.loadParams,
      href: '/products/'
    });

    const div = document.createElement('div');
    div.className = "products-list";
    div.innerHTML = this.template();
    this.element = div;
    this.element.append(this.sortableTable.element);

    this.doubleSlider = new DoubleSlider({
      min: this.loadParams.price_gte,
      max: this.loadParams.price_lte,
    });
    this.installComponent(this.doubleSlider.element,'range-slider');

    this.filterName = this.element.querySelector('[data-elem="filterName"]');
    this.filterStatus = this.element.querySelector('[data-elem="filterStatus"]');

    this.initEventListeners();

    return this.element;
  }

  installComponent (element, className) {
    const place = this.element.querySelector(`.${className}`);
    place.replaceWith(element);
    element.classList.add(className);
  }

  template () {
    return `<div class="content__top-panel">
        <h1 class="page-title">Товары</h1>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
            <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
          </div>
          <div class="form-group" data-elem="sliderContainer">
            <label class="form-label">Цена:</label>
          <div class="range-slider"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Статус:</label>
            <select class="form-control" data-elem="filterStatus">
              <option value="" selected="">Любой</option>
              <option value="1">Активный</option>
              <option value="0">Неактивный</option>
            </select>
          </div>
        </form>
      </div>`;
  }

  initEventListeners () {
    document.addEventListener('range-select', this.onRangeSelect);

    this.filterName.addEventListener("input", this.onFilterChange);

    this.filterStatus.addEventListener("change", this.onStatusChange);
  }

  onFilterChange = () => {
    this.loadParams.title_like = this.filterName.value;
    this.sortableTable.updateLoadParams(this.loadParams);
  }

  onStatusChange = () => {
    this.loadParams.status = this.filterStatus.selectedIndex;
    this.sortableTable.updateLoadParams(this.loadParams);
  }

  onRangeSelect = (event) => {
    this.loadParams.price_lte = event.detail.to;
    this.loadParams.price_gte = event.detail.from;
    this.sortableTable.updateLoadParams(this.loadParams);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();

    document.removeEventListener('range-select', this.onRangeSelect);
    document.removeEventListener('input', this.onFilterChange);
    document.removeEventListener('change', this.onStatusChange);

    this.sortableTable.destroy();
    this.doubleSlider.destroy();
  }

}
