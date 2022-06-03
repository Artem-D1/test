import { collection, getDocs } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

async function getBooks(db) {
  const booksCol = collection(db, "books");
  const booksSnapshot = await getDocs(booksCol);
  let booksList = [];
  booksSnapshot.forEach((doc) => {
    let id = doc.id;
    let bookWithoutId = doc.data();
    let book = {
      id: id,
      name: bookWithoutId.name,
      yearPublication: bookWithoutId.yearPublication,
      author: bookWithoutId.author,
      rating: bookWithoutId.rating,
      ISBN: bookWithoutId.ISBN
    };
    booksList.push(book);
  });
  return booksList;
}

async function createNewBook(db, newBook) {
  await addDoc(collection(db, "books"), {
    name: newBook.name,
    author: newBook.author,
    yearPublication: newBook.yearPublication,
    rating: newBook.rating,
    ISBN: newBook.ISBN
  });
}

async function deleteBook(db, book) {
  await deleteDoc(doc(db, "books", book.id));
}

async function changeBook(db, changeBook) {
  await updateDoc(doc(db, "books", changeBook.id), {
    name: changeBook.name,
    author: changeBook.author,
    yearPublication: changeBook.yearPublication.toString(),
    rating: changeBook.rating,
    ISBN: changeBook.ISBN
  });
}

export { getBooks, createNewBook, deleteBook, changeBook };
