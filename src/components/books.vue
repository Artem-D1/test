<template>
  <div class="book_katalog">
    <p class="book_katalog__header">Каталог книг</p>
    <div class="book_katalog__recomendation">
      <p class="recomendation__header">Рекомендуем:</p>
      <p class="recomendation__book">{{ recomend.name }}</p>
    </div>
    <div class="book_katalog__shelf">
      <p class="recomendation__header">Книжная полка:</p>
      <p class="recomendation__book">Отсортировать</p>
      <div class="shelf__sort_btns">
        <button @click="ratingSort(this.shelfs)" class="sort_btn">
          по рейтингу
        </button>
        <button @click="authorSort(this.shelfs)" class="sort_btn">
          по автору
        </button>
        <button @click="alphabetSort(this.shelfs)" class="sort_btn">
          по алфавиту
        </button>
      </div>
      <div
        v-for="(shelf, index) in shelfs"
        :key="index"
        class="shelf__booksForYear"
      >
        <p class="recomendation__book">{{ shelf.year }}</p>
        <div
          v-for="item in shelf.items"
          :key="item.id"
          class="booksForYear__books"
        >
          <p class="books__bookName">{{ item.name }}</p>
          <div class="books__btnsCont">
            <button @click="deleteBookFunk(item)" class="btnsCont__btn">
              Удалить
            </button>
            <button @click="showChangeFormWindow(item)" class="btnsCont__btn">
              Изменить
            </button>
          </div>
        </div>
      </div>
    </div>
    <ChangeBook
      :needChangebook="this.changeBook"
      v-if="isChangeFormVisible"
      @close-popup="closeWindowPopup"
    />
    <AddBook v-if="isInfoPopupVisible" @close-popup="closeWindowPopup" />

    <div class="book_katalog__add_btn">
      <button class="add_btn" @click="showPopupWindow">Добавить книгу</button>
    </div>
  </div>
</template>

<script>
import db from "@/firestore/firebase";
import AddBook from "@/components/addBook";
import ChangeBook from "@/components/changeBook";
import { getBooks, deleteBook } from "@/firestore/function";
export default {
  name: "Books",
  data: () => {
    return {
      books: [],
      years: [],
      shelfs: [],
      recomend: {},
      changeBook: {},
      isInfoPopupVisible: false,
      isChangeFormVisible: false,
    };
  },
  components: {
    AddBook,
    ChangeBook,
  },
  mounted() {
    this.updatePage();
  },
  methods: {
    setYears(books) {
      let allYears = books.map(function (book) {
        return book.yearPublication;
      });
      this.years = Array.from(new Set(allYears));
    },
    Shelf(year, items) {
      this.year = year;
      this.items = items;
    },
    setShelf(years, books, shelfs) {
      years.forEach(function (year) {
        let items = [];
        books.forEach(function (book) {
          if (book.yearPublication == year) {
            items.push(book);
          }
        });
        if (year == null) {
          let shelf = {
            year: "Книги без указания года",
            items: items,
          };
          shelfs.push(shelf);
        } else {
          let shelf = {
            year: year,
            items: items,
          };
          shelfs.push(shelf);
        }
      });

      return shelfs;
    },
    sortYears(years) {
      years.sort(function (a, b) {
        return a - b;
      });
      return years.reverse();
    },
    alphabetSort(shelfs) {
      shelfs.forEach(function (shelf) {
        shelf.items.sort(function (a, b) {
          let aname = a.name.toLowerCase();
          let bname = b.name.toLowerCase();
          if (aname < bname) return -1;
          if (aname == bname) return 0;
          if (aname > bname) return 1;
        });
      });
      this.shelfs = shelfs;
    },
    authorSort(shelfs) {
      shelfs.forEach(function (shelf) {
        shelf.items.sort(function (a, b) {
          let aname = a.author.toLowerCase();
          let bname = b.author.toLowerCase();
          if (aname < bname) return -1;
          if (aname == bname) return 0;
          if (aname > bname) return 1;
        });
      });
      this.shelfs = shelfs;
    },
    ratingSort(shelfs) {
      shelfs.forEach(function (shelf) {
        shelf.items.sort(function (a, b) {
          let aname = a.rating;
          let bname = b.rating;
          if (aname < bname) return 1;
          if (aname == bname) return 0;
          if (aname > bname) return -1;
        });
      });
      this.shelfs = shelfs;
    },
    setRecomendation(books) {
      let allYearBook = this.setYearRecomendationBook(books);
      let allRatings = allYearBook.map(function (book) {
        return book.rating;
      });
      var maxRating = Math.max(...allRatings);
      let goodRatingBooks = [];
      allYearBook.forEach(function (book) {
        if (book.rating == maxRating) {
          goodRatingBooks.push(book);
        }
      });
      let maxNumber = goodRatingBooks.length;
      let randomNumber = this.randomInteger(0, maxNumber - 1);
      return goodRatingBooks[randomNumber];
    },
    setYearRecomendationBook(books) {
      let nowData = new Date();
      let nowYear = nowData.getFullYear();
      let yearRecomendationBook = [];
      books.forEach(function (book) {
        if (nowYear - book.yearPublication > 3) {
          yearRecomendationBook.push(book);
        }
      });
      return yearRecomendationBook;
    },
    randomInteger(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },
    showPopupWindow() {
      this.isInfoPopupVisible = true;
    },
    showChangeFormWindow(changeBook) {
      this.changeBook = changeBook;
      this.isChangeFormVisible = true;
    },
    closeWindowPopup() {
      this.isInfoPopupVisible = false;
      this.isChangeFormVisible = false;
      this.updatePage();
    },
    async deleteBookFunk(book) {
      await deleteBook(db, book);
      this.updatePage();
    },
    async updatePage() {
      this.resetValues();

      this.books = await getBooks(db);

      this.setYears(this.books);

      this.years = this.sortYears(this.years);

      this.shelfs = this.setShelf(this.years, this.books, this.shelfs);

      this.alphabetSort(this.shelfs);

      this.recomend = this.setRecomendation(this.books);
    },
    resetValues() {
      this.books = [];
      this.years = [];
      this.shelfs = [];
      this.recomend = {};
      this.changeBook = {};
      this.isInfoPopupVisible = false;
      this.isChangeFormVisible = false;
    },
  },
};
</script>

<style>
p {
  font-weight: 400;
  color: #000000;
}
.book_katalog {
  padding: 40px;
  width: 60%;
  height: auto;
  margin: 40px auto 40px auto;
  background-color: #E6D496;
  border-radius: 10px;
}

.book_katalog__header {
  border-radius: 10px;
  font-size: 32px;
  line-height: 43px;
  text-align: center;
}
.book_katalog__recomendation {
  width: 100%;
  height: auto;
  border-bottom: 2px solid black;
}
.recomendation__header {
  margin: 0;
  font-size: 20px;
  line-height: 27px;
}

.recomendation__book {
  margin: 11px 0 0 20px;
  font-size: 18px;
  line-height: 24px;
}

.book_katalog__shelf {
  margin-top: 40px;
  width: 100%;
  height: auto;
  border-bottom: 2px solid black;
}

.shelf__sort_btns {
  width: 80%;
  height: 32px;
  margin: 11px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.sort_btn {
  width: 120px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background-color: #E6D496;
  color: black;
  border: 2px solid #D9D9D9;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.sort_btn:hover {
  background-color: #D9D9D9;
}

.booksForYear__books {
  width: auto;
  height: 32px;
  margin: 13px 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.books__bookName {
  margin: 0;
  font-size: 18px;
  line-height: 24px;
}

.btnsCont__btn {
  height: 32px;
  margin: 0 10px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  background-color: #E6D496;
  color: rgba(0, 0, 0, 0.5);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.btnsCont__btn:hover {
  background-color: #D9D9D9;
  color: rgba(0, 0, 0, 1);
}

.book_katalog__add_btn {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add_btn {
  margin: 30px 0;
  width: 120px;
  height: 32px;
  border-radius: 10px;
  background-color: #E6D496;
  color: black;
  border: 2px solid #D9D9D9;
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
}

.add_btn:hover {
  background-color: #D9D9D9;
}
</style>