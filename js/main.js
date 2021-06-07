class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>
        <a href="#" class="btn btn-danger btn-sm delete" 
        title="Hapus">
          <i class="fa fa-trash"></i>
        </a>
      </td>
    `;
    list.appendChild(row);
  }

  static clearField(form) {
    form.querySelector("#title").value = "";
    form.querySelector("#author").value = "";
    form.querySelector("#isbn").value = "";
  }

  /**
   * showAlert()
   * show alert based on className and display it before the element
   * @static
   * @param {*} message
   * @param {*} className
   * @param {*} element
   * @memberof UI
   */
  static showAlert(message, className, element) {
    const div = document.createElement("div");
    div.className = `alert alert-${className} mt-3`;
    div.appendChild(document.createTextNode(message));
    const container = element.parentElement;
    container.insertBefore(div, element);
    setTimeout(() => {
      div.remove();
    }, 3000);
  }
}

// Handle Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));

  }
}

// Events
// Display Book Event
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Add Book Event
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener("submit", e => {
  // Prevent actual submit action
  e.preventDefault();
  // Get form values
  const title = bookForm.querySelector("#title").value;
  const author = bookForm.querySelector("#author").value;
  const isbn = bookForm.querySelector("#isbn").value;
  // Validate
  if (title === "" || author === "" || isbn === "") {
    // Tampilkan alert jika belum tampil alert
    if (!bookForm.parentElement.querySelector(".alert")) {
      UI.showAlert("Semua masukan belum terisi", "danger", bookForm);
    }
  } else {
    if (isbn.length < 10) {
      alert("ISBN tidak valid");
    } else {
      // Instantiate Book
      const book = new Book(title, author, isbn);
      // View book to UI
      UI.addBookToList(book);
      // add book to localstorage
      Store.addBook(book);
      // Clear fields
      UI.clearField(bookForm);
      // Tampilkan alert jika belum tampil alert
      if (!bookForm.parentElement.querySelector(".alert")) {
        UI.showAlert("Buku berhasil ditambahkan...", "success", bookForm);
      }  
    }
  }
});

// Delete Book Event
const bookList = document.querySelector("#book-list");
bookList.addEventListener("click", e => {
  if (e.target.tagName == "A" && e.target.classList.contains("delete")) {
    // Remove book from UI
    e.target.parentElement.parentElement.remove();
    // Remove book from Localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Tampilkan alert jika belum tampil alert
    if (!bookForm.parentElement.querySelector(".alert")) {
      UI.showAlert("Buku berhasil dihapus...", "success", bookForm);
    }
  } else if (e.target.tagName == "I" && e.target.classList.contains("fa-trash")) {
    // Remove book from UI
    e.target.parentElement.parentElement.parentElement.remove();
    // Remove book from Localstorage
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);
    // Tampilkan alert jika belum tampil alert
    if (!bookForm.parentElement.querySelector(".alert")) {
      UI.showAlert("Buku berhasil dihapus...", "success", bookForm);
    }
  }
});