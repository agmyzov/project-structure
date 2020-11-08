import CategoryPanel from '../../components/categories/index.js';
import SortableList from '../../components/sortable-list/index.js';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element; // HTMLElement

  async render () {
    this.categories = await fetchJson(`https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory`);

    this.categorys = this.categories.map(item => {
      const subcategories = this.getItems(item.subcategories);
      const sortableList = new SortableList({items: subcategories});
      return new CategoryPanel(item.id, item.title, sortableList.element);
    })

    const div = document.createElement('div');
    div.className = "categories";
    div.innerHTML = this.template();
    this.element = div;

    this.categoriesContainer = div.querySelector('[data-elem="categoriesContainer"]');

    this.categorys.forEach(item => {
      this.categoriesContainer.append(item.element);
    })

    return this.element;
  }

  getItems(data) {
    const items = data.map(item => {
      const element = document.createElement('li');
      element.className = "categories__sortable-list-item";
      element.setAttribute("data-grab-handle", '');
      element.setAttribute("data-id", item.id);

      element.innerHTML = `
          <strong>${item.title}</strong>
          <span><b>${item.count}</b> products</span>
        `
      return element;
    });
    return items;
  }

  template () {
    return `<div class="content__top-panel">
        <h1 class="page-title">Категории товаров</h1>
      </div><div data-elem="categoriesContainer"></div>`;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();

    this.categorys.forEach(item => item.destroy());
  }

}
