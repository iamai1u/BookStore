class OrderService {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem("orders")) || [];
    }

    createOrder(cart, user) {
        if (!user) {
            alert("Сначала войдите в аккаунт!");
            return;
        }

        if (cart.items.length === 0) {
            alert("Корзина пуста!");
            return;
        }

        const items = cart.items.map(item => ({
            title: item.book.title,
            price: item.book.price,
            quantity: item.quantity
        }));

        const order = new Order(
            Date.now(),
            items,
            cart.getTotal(),
            new Date().toLocaleString("ru-RU")
        );

        order.userId = user.id;
        order.userEmail = user.email;

        this.orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(this.orders)
        );

        cart.items = [];

        return order;
    }

    getOrders(user) {
        if (!user) {
            return [];
        }

        if (user.role === "Администратор") {
            return this.orders;
        }

        return this.orders.filter(
            order => order.userId === user.id
        );
    }

    updateStatus(orderId, status) {
        const order = this.orders.find(
            order => order.id === orderId
        );

        if (order) {
            order.status = status;

            localStorage.setItem(
                "orders",
                JSON.stringify(this.orders)
            );
        }
    }
}