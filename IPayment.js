class IPayment {
    pay(order, amount) {
        throw new Error(
            "Метод pay() должен быть реализован"
        );
    }
}