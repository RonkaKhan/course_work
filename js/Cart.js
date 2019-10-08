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
                this.element.insertAdjacentHTML('beforeend', this.renderItem(item))
            })

    }

    delete() {

    }

    update() {

    }

    renderItem(item) {
        return `<div class="cart__item" data-id="${item.id}"> 
            <img src="${item.img = 'https://via.placeholder.com/72x85.png'}" alt="man" class="cart__item__img">
            <div class="cart__box__text"> 
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

            this.element.innerHTML = this.items.map(this.renderItem).join('');
        }

        return this.element;
    }

    total() {
//         return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    }
}

const cart = new Cart();
cart.fetchItems().then(() => {
    document.querySelector('.cart__items').appendChild(cart.render());
});

document.querySelector('.products').addEventListener('click', (event) => {
    if (event.target.classList.contains('buy')) {
        cart.add(event.target.dataset);
    }
});