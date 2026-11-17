class OnlinePayment extends IPayment {
    pay(order, amount) {
        return new Payment(
            Date.now(),
            order.id,
            amount,
            "Онлайн-оплата"
        );
    }
}