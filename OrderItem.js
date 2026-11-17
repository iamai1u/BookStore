class OrderItem {
    constructor(id, bookId, title, quantity, unitPrice) {
        this.id = id;
        this.bookId = bookId;
        this.title = title;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    getTotal() {
        return this.quantity * this.unitPrice;
    }
}