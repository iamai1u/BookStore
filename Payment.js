class Payment {
    constructor(id, orderId, amount, method) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.method = method;
        this.status = "Ожидает оплаты";
        this.paidAt = null;
    }

    completePayment() {
        this.status = "Оплачено";
        this.paidAt = new Date().toLocaleString("ru-RU");
    }
}