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
                this.element.insertAdjacentHTML('beforeend', this.renderItem(item));
            });
            this.items.push({...item, qty: 1});
    }

    delete(id) {
        fetch(`/cart/${id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then((item) => {
                const $item = document.querySelector(`.cart__items div[data-id="${id}"]`);
                if($item) {
                    $item.remove();
                }
            });
        const idx = this.items.findIndex(entity => entity.id === id);
        this.items.splice(idx, 1);
    }

    update(id, newQty) {
        fetch(`/cart/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({qty: newQty}),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then(response => response.json())
            .then((item) => {
                console.log('Обновление количества прошло успешно!');
            });

        const idx = this.items.findIndex(entity => entity.id === id);
        this.items[idx].qty = newQty;
    }

    change(container, action) {

    }

    renderItem(item) {
        return `<div class="cart__item" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-qty="${item.qty}"> 
            <img src="${item.img = 'https://via.placeholder.com/72x85.png'}" alt="man" class="cart__item__img">
            <div class="cart__box__text"> 
                <a href="#" class="cart__item__h2">${item.title}</a> 
                <span class="cart__stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                </span>
                <p class="cart__price__text"><span class="qty">${item.qty}</span> x $${item.price}</p>
            </div> 
            <a href="#" class="cart__circle__del">
                <i class="fas fa-times-circle del" data-id="${item.id}"></i>
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
        return this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    }
}

const cart = new Cart();
cart.fetchItems().then(() => {
    document.querySelector('.cart__items').appendChild(cart.render());
    document.querySelector('.total').innerHTML = `$${cart.total()}.00`;
});

document.querySelector('.products').addEventListener('click', (event) => {
    console.log(event.target);
    if (event.target.classList.contains('buy')) {
        const id = event.target.dataset.id;
        const $item = document.querySelector(`.cart__items div[data-id="${id}"]`);
        if ($item) {
            const $currentQty = $item.querySelector('.qty');
            $currentQty.textContent = +$currentQty.textContent + 1;
            cart.update(id, +$currentQty.textContent);
        } else {
            cart.add(event.target.dataset);
        }
        document.querySelector('.total').innerHTML = `$${cart.total()}.00`;
    }
});

document.querySelector('.cart__items').addEventListener('click', (event) => {
    if (event.target.classList.contains('del')) {
        const id = event.target.dataset.id;
        const $item = document.querySelector(`.cart__items div[data-id="${id}"]`);
        const $currentQty = $item.querySelector('.qty');
        if (+$currentQty.textContent === 1) {
            if(confirm('Вы действительно хотите удалить товар из корзины?')) {
                cart.delete(id);
            } else {
                return false;
            }
        } else {
            $currentQty.textContent = +$currentQty.textContent - 1;
            cart.update(id, +$currentQty.textContent);
        }
        document.querySelector('.total').innerHTML = `$${cart.total()}.00`;
    }
});
