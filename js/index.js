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
            return `<div>Ничего не найдено</div>`;
        }

        return this.items.map((item) => new Item(item.id, item.img).render()).join('');
    }
}

class Item {
    constructor(id, img) {
        this.id = id;
        this.img = img;
    }

    render() {
        return `<div class="item">
            <a href="#" class="item__img"> 
                <img src="${this.img}" alt="Product_photo"> 
            </a>
            <div class="item__content"> 
                <a href="#" class="item__name">Mango People T-shirt</a>
                <p class="item__price">$52.00</p>
            </div>
            <a href="#" class="item__add">
                <div class="mini_cart buy" data-id="${this.id}"> <img src="img/cart__bottom.png" alt="cart"> Add to Cart</div></a>
            </div>`
    }
}

class Cart {
    constructor() {
        this.items = [];
        this.element = null;
    }

    fetchItems() {
        return fetch('/cart')
            .then(response => response.json())
            .then((items) => {
                this.items = items;
            });
    }

    add(item) {
        fetch('/cart', {
            method: 'POST',
            body: JSON.stringify({...item, qty: 1}),
            headers: {
                'Content-type': 'application/json'
            },
        })
            .then((response) => response.json())
            .then((item) => {
                this.element.insertAdjacentHTML('beforeend', this.renderItem())
            })

    }

    delete() {

    }

    update() {

    }

    renderItem(item) {
        return `<div class="cart__item" data-id="${item.id}"> 
            <img src="img/cart__man.jpg" alt="man" class="cart__item__img">
            <div class="${item.img = 'https://via.placeholder.com/72x85.png'}"> 
                <a href="#" class="cart__item__h2">Rebox Zane</a> 
                <span class="cart__stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </span>
                <p class="cart__price__text">${item.qty} x $250</p>
            </div> 
            <a href="#" class="cart__circle__del">
                <i class="fas fa-times-circle"></i>
            </a> 
            </div>`
    }

    render() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.class = 'cart__items';

            this.element.innerHTML = this.items.map(this.renderItem).join('');
        }

        return this.element;
    }

    total() {
//         return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    }
}

const items = new GoodList();
items.fetchItems().then(() => {
    document.querySelector('.products').innerHTML = items.render();
});

document.querySelector('.products').addEventListener('click', (event) => {
    if (event.target.classList.contains('buy')) {
        cart.add(event.target.dataset);
    }
});

const cart = new Cart();
cart.fetchItems().then(() => {
    document.querySelector('.cart__box').appendChild(cart.render());
});
