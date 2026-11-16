class CartService {
    constructor(cart) {
        this.cart = cart;
    }

    add(book) {
        this.cart.addBook(book);
    }

    remove(bookId) {
        this.cart.removeBook(bookId);
    }

    changeQuantity(bookId, quantity) {
        this.cart.changeQuantity(bookId, quantity);
    }

    getCount() {
        return this.cart.getCount();
    }

    getTotal() {
        return this.cart.getTotal();
    }
}