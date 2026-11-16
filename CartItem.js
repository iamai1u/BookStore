class CartItem {
    constructor(book, quantity = 1) {
        this.book = book;
        this.quantity = quantity;
    }

    getSubtotal() {
        return this.book.price * this.quantity;
    }
}