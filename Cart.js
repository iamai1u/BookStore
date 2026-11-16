class Cart {
    constructor() {
        this.items = [];
    }

    addBook(book) {
        const item = this.items.find(
            item => item.book.id === book.id
        );

        if (item) {
            item.quantity++;
        } else {
            this.items.push(new CartItem(book));
        }
    }

    removeBook(bookId) {
        this.items = this.items.filter(
            item => item.book.id !== bookId
        );
    }

    changeQuantity(bookId, quantity) {
        const item = this.items.find(
            item => item.book.id === bookId
        );

        if (item && quantity > 0) {
            item.quantity = quantity;
        }
    }

    getCount() {
        return this.items.reduce(
            (sum, item) => sum + item.quantity, 0
        );
    }

    getTotal() {
        return this.items.reduce(
            (sum, item) => sum + item.getSubtotal(), 0
        );
    }
}