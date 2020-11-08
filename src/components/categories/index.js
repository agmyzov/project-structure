export default class CategoryPanel {
  element = null; // HTMLElement;

  constructor(id, name, items) {
    this.id = id;
    this.name = name;
    this.items = items;
    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    this.element.addEventListener('click', this.onClick);
  }

  onClick = (event) => {
    const category = event.target.closest('[data-category]');
    if (category) {
      category.classList.toggle("category_open");
    }
  }

  render() {
    const div = document.createElement('div');
    div.dataset.id = this.id;
    div.setAttribute("data-category", '');
    div.className = "category category_open";
    div.innerHTML = `<header class="category__header">
        ${this.name}
      </header>
      <div class="category__body">
        <div class="subcategory-list"></div>
      </div>`;
    const subcategoryList = div.querySelector('.subcategory-list');
    subcategoryList.append(this.items);
    this.element = div;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('click', this.onClick);
  }
}
