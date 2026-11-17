class CardPayment extends IPayment {
    pay(order, amount) {
        return new Payment(
            Date.now(),
            order.id,
            amount,
            "Банковская карта"
        );
    }
}