class BookCatalogService {
    constructor(books) {
        this.books = books;
    }

    search(query) {
        return this.books.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
    }
}