class UserService {
    constructor() {
        this.users = JSON.parse(localStorage.getItem("users")) || [];

        this.currentUser =
            JSON.parse(localStorage.getItem("currentUser")) || null;

        // Создание демонстрационного администратора
        if (!this.users.some(user => user.role === "Администратор")) {
            this.users.push({
                id: 1,
                name: "Администратор",
                email: "admin@bookstore.com",
                password: "admin123",
                role: "Администратор"
            });

            localStorage.setItem("users", JSON.stringify(this.users));
        }
    }

    register(name, email, password) {
        if (!name || !email || !password) {
            alert("Заполните все поля!");
            return false;
        }

        if (this.users.some(user => user.email === email)) {
            alert("Этот email уже зарегистрирован!");
            return false;
        }

        const user = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: "Покупатель"
        };

        this.users.push(user);

        localStorage.setItem("users", JSON.stringify(this.users));

        alert("Регистрация успешна!");

        return true;
    }

    login(email, password) {
        const user = this.users.find(user =>
            user.email === email &&
            user.password === password
        );

        if (!user) {
            alert("Неверный email или пароль!");
            return false;
        }

        this.currentUser = user;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        return true;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem("currentUser");
    }
}