const books = [
    new Book(1, "Маленький принц", "Антуан де Сент-Экзюпери", 500, "Сказка"),
    new Book(2, "Гордость и предубеждение", "Джейн Остин", 650, "Роман"),
    new Book(3, "1984", "Джордж Оруэлл", 700, "Фантастика"),
    new Book(4, "Алхимик", "Пауло Коэльо", 550, "Роман")
];

// Обложки книг
books[0].image = "https://covers.openlibrary.org/b/title/The%20Little%20Prince-M.jpg";
books[1].image = "https://covers.openlibrary.org/b/title/Pride%20and%20Prejudice-M.jpg";
books[2].image = "https://covers.openlibrary.org/b/title/1984-M.jpg";
books[3].image = "https://covers.openlibrary.org/b/title/The%20Alchemist-M.jpg";

// Создание объектов
const catalogService = new BookCatalogService(books);

const cart = new Cart();
const cartService = new CartService(cart);

const orderService = new OrderService();

const userService = new UserService();


// ПОКАЗ КНИГ
function showBooks(bookList) {

    const container = document.getElementById("books");

    container.innerHTML = "";

    bookList.forEach(book => {

        container.innerHTML += `
            <div class="book">

                <img
                    src="${book.image}"
                    alt="${book.title}"
                    class="book-cover"
                >

                <h3>${book.title}</h3>

                <p>Автор: ${book.author}</p>

                <p>Жанр: ${book.genre}</p>

                <p>${book.price} сом</p>

                <button onclick="addToCart(${book.id})">
                    В корзину
                </button>

            </div>
        `;
    });
}


// ДОБАВЛЕНИЕ В КОРЗИНУ
function addToCart(id) {

    const book = books.find(item => item.id === id);

    if (book) {
        cartService.add(book);
        showCart();
    }
}


// ПОКАЗ КОРЗИНЫ
function showCart() {

    const container = document.getElementById("cart-items");

    container.innerHTML = "";

    cart.items.forEach(item => {

        container.innerHTML += `
            <div class="book">

                <h3>${item.book.title}</h3>

                <p>Цена: ${item.book.price} сом</p>

                <p>Количество: ${item.quantity}</p>

                <p>Сумма: ${item.getSubtotal()} сом</p>

                <button onclick="changeQuantity(${item.book.id}, ${item.quantity - 1})">-</button>

                <button onclick="changeQuantity(${item.book.id}, ${item.quantity + 1})">+</button>

                <button onclick="removeFromCart(${item.book.id})">
                    Удалить
                </button>

            </div>
        `;
    });

    document.getElementById("cart-count").textContent =
        cartService.getCount();

    document.getElementById("cart-total").textContent =
        cartService.getTotal();
}


// ИЗМЕНЕНИЕ КОЛИЧЕСТВА
function changeQuantity(id, quantity) {

    if (quantity <= 0) {
        cartService.remove(id);
    } else {
        cartService.changeQuantity(id, quantity);
    }

    showCart();
}


// УДАЛЕНИЕ ИЗ КОРЗИНЫ
function removeFromCart(id) {

    cartService.remove(id);

    showCart();
}


// ПОИСК И ФИЛЬТРАЦИЯ
function filterBooks() {

    const searchText =
        document.getElementById("search").value.toLowerCase();

    const selectedGenre =
        document.getElementById("genre-filter").value;

    const result = books.filter(book => {

        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesGenre =
            selectedGenre === "" || book.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    showBooks(result);
}


// ОБРАБОТЧИКИ ПОИСКА
document.getElementById("search").addEventListener("input", filterBooks);

document.getElementById("genre-filter").addEventListener("change", filterBooks);


// ОФОРМЛЕНИЕ ЗАКАЗА
function checkout() {
    const user = userService.currentUser;

    if (!user) {
        alert("Для оформления заказа войдите в аккаунт!");
        return;
    }

    const order = orderService.createOrder(cart, user);

    if (order) {
        alert("Заказ успешно оформлен!");

        showCart();
        showOrders();
    }
}


// ПОКАЗ ИСТОРИИ ЗАКАЗОВ
function showOrders() {
    const container = document.getElementById("orders-list");

    container.innerHTML = "";

    const user = userService.currentUser;

    if (!user) {
        container.innerHTML = "<p>Войдите в аккаунт, чтобы увидеть заказы.</p>";
        return;
    }

    const orders = orderService.getOrders(user);

    if (orders.length === 0) {
        container.innerHTML = "<p>Заказов пока нет.</p>";
        return;
    }

    orders.forEach(order => {
        container.innerHTML += `
            <div class="book">
                <h3>Заказ №${order.id}</h3>

                <p>Покупатель: ${order.userEmail || "Не указан"}</p>

                <p>Дата: ${order.date}</p>

                <p>Сумма: ${order.total} сом</p>

                <p>Статус: ${order.status}</p>

                <h4>Книги:</h4>

                ${order.items.map(item => `
                    <p>${item.title} — ${item.quantity} шт.</p>
                `).join("")}

                ${
                    user.role === "Администратор"
                    ? `
                        <select id="status-${order.id}">
                            <option value="Ожидает оплаты">Ожидает оплаты</option>
                            <option value="Оплачен">Оплачен</option>
                            <option value="В обработке">В обработке</option>
                            <option value="Отправлен">Отправлен</option>
                            <option value="Завершён">Завершён</option>
                            <option value="Отменён">Отменён</option>
                        </select>

                        <button onclick="changeOrderStatus(${order.id})">
                            Изменить статус
                        </button>
                    `
                    : ""
                }
            </div>
        `;
    });
}

function changeOrderStatus(orderId) {
    if (!userService.currentUser ||
        userService.currentUser.role !== "Администратор") {
        alert("Нет доступа!");
        return;
    }

    const status = document.getElementById(
        "status-" + orderId
    ).value;

    orderService.updateStatus(orderId, status);

    showOrders();

    alert("Статус заказа изменён!");
}


// ПЕРВОНАЧАЛЬНОЕ ОТОБРАЖЕНИЕ
showBooks(books);

showCart();

showOrders();
function registerUser() {
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    if (userService.register(name, email, password)) {
        document.getElementById("reg-name").value = "";
        document.getElementById("reg-email").value = "";
        document.getElementById("reg-password").value = "";
    }
}

function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (userService.login(email, password)) {
        alert("Вы вошли в аккаунт!");

        showUserInfo();
    }
}

function logoutUser() {
    userService.logout();

    showUserInfo();
}

function showUserInfo() {
    const user = userService.currentUser;

    const info = document.getElementById("user-info");
    const forms = document.getElementById("auth-forms");
    const adminPanel = document.getElementById("admin-panel");

    if (user) {
        forms.style.display = "none";

        info.innerHTML = `
            <h3>Здравствуйте, ${user.name}!</h3>
            <p>Ваш email: ${user.email}</p>
            <p>Роль: ${user.role}</p>
            <button onclick="logoutUser()">Выйти</button>
        `;

        adminPanel.style.display =
            user.role === "Администратор" ? "block" : "none";

        showOrders();
    } else {
        forms.style.display = "block";
        info.innerHTML = "";
        adminPanel.style.display = "none";
    }
    if (user.role === "Администратор") {
    showAdminBooks();
}
}


// ДОБАВЛЕНИЕ КНИГИ АДМИНИСТРАТОРОМ
function addNewBook() {
    if (!userService.currentUser ||
        userService.currentUser.role !== "Администратор") {
        alert("Нет доступа!");
        return;
    }

    const title = document.getElementById("new-title").value;
    const author = document.getElementById("new-author").value;
    const price = Number(document.getElementById("new-price").value);
    const genre = document.getElementById("new-genre").value;
    const image = document.getElementById("new-image").value;

    if (!title || !author || price <= 0 || !genre) {
        alert("Заполните данные книги правильно!");
        return;
    }

    const book = new Book(
        Date.now(),
        title,
        author,
        price,
        genre
    );

    book.image = image;

    books.push(book);

    showBooks(books);
    showAdminBooks();

    alert("Книга добавлена!");
}


// СПИСОК КНИГ АДМИНИСТРАТОРА
function showAdminBooks() {
    const container = document.getElementById("admin-books");

    container.innerHTML = "";

    books.forEach(book => {
        container.innerHTML += `
            <div class="book">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p>${book.price} сом</p>
                <button onclick="deleteBook(${book.id})">
                    Удалить
                </button>
            </div>
        `;
    });
}


// УДАЛЕНИЕ КНИГИ
function deleteBook(id) {
    if (!userService.currentUser ||
        userService.currentUser.role !== "Администратор") {
        alert("Нет доступа!");
        return;
    }

    const index = books.findIndex(book => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);

        showBooks(books);
        showAdminBooks();
    }
}


// ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ ПРИ ЗАПУСКЕ
showUserInfo();