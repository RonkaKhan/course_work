class GoodList {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.loaded = false;
    }

    fetchItems() {
        return fetch('/goods')
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.loaded = true;
                this.filteredItems = items;
            });
    }

    filter(query) {
        this.filteredItems = this.items.filter((item) => {
            const regexp = new RegExp(query, 'i');

            return regexp.test(item.title);
        });
    }

    render() {
        if (this.loaded && this.filteredItems.length === 0) {
            return `<h1>Ничего не найдено</h1>`;
        }

        return this.items.map((item) => new Item(item.id, item.title, item.price, item.img).render()).join('');
    }
}

class Item {
    constructor(id, title, price, img) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.img = img;
    }

    render() {
        return `<div class="item">
            <a href="#" class="item__img"> 
                <img src="${this.img}" alt="Product_photo"> 
            </a>
            <div class="item__content"> 
                <a href="#" class="item__name">${this.title}</a>
                <p class="item__price">$${this.price}.00</p>
            </div>
            <a href="#" class="item__add">
                <div class="mini_cart buy" data-id="${this.id}" data-title="${this.title}" data-price="${this.price}"> 
                    <img src="img/cart__bottom.png" alt="cart"> Add to Cart
                </div>
            </a>
            </div>`
    }
}

const items = new GoodList();
items.fetchItems().then(() => {
    document.querySelector('.products').innerHTML = items.render();
});

document.querySelector('.search').addEventListener('click', (event) => {
    const $brother = document.querySelector('.search_input');
    const query = $brother.value;
    items.filter(query);
    document.querySelector('.searchResult').innerHTML = items.render();
});