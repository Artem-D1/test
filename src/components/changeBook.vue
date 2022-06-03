<template>
  <div class="popup_wrapper" ref="popup_wrapper">
    <div class="addBook_form">
      <p class="addBook_form__header">Изменить книгу</p>
      <form class="" @submit.prevent="onSubmit">
        <p class="addBook_form__element">
          <input
            id="name"
            name="name"
            v-model="name"
            class="element"
            type="text"
            placeholder="Введите название книги"
            maxlength="100"
            required
          />
        </p>
        <p class="addBook_form__element">
          <input
            id="author"
            name="author"
            v-model="author"
            class="element"
            type="text"
            placeholder="Введите автора(-ов)"
            required
          />
        </p>
        <p class="addBook_form__element">
          <input
            id="yearPublication"
            name="yearPublication"
            v-model="yearPublication"
            class="element"
            type="number"
            min="1800"
            max="2022"
            placeholder="Введите год публикации"
          />
        </p>
        <p class="addBook_form__element">
          <input
            id="rating"
            name="rating"
            v-model="rating"
            class="element"
            type="number"
            min="0"
            max="10"
            placeholder="Введите рейтинг"
          />
        </p>
        <p class="addBook_form__element">
          <input
            id="ISBN"
            name="ISBN"
            v-model="ISBN"
            class="element"
            type="text"
            placeholder="Введите ISBN"
          />
        </p>
        <div class="addBook_form__buttons">
          <p class="buttons__addBtn">
            <input class="addBtn" value="Изменить" type="submit" />
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { changeBook } from "@/firestore/function";
import db from "@/firestore/firebase";

export default {
  name: "ChangeBook",
  data() {
    return {
      name: this.needChangebook.name,
      author: this.needChangebook.author,
      yearPublication: this.needChangebook.yearPublication,
      rating: this.needChangebook.rating,
      ISBN: this.needChangebook.ISBN,
    };
  },
  props: {
    needChangebook: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
    onSubmit() {
      if (this.ISBN == null || this.ISBN == "") {
        this.updateDB();
      } else {
        let ISBNvalid = this.isValidIsbn(this.ISBN);
        if (ISBNvalid == true) {
          this.updateDB();
        } else {
          alert("Введите правильный ISBN");
        }
      }
    },
    async updateDB() {
      if (!this.yearPublication) {
        let change = {
          id: this.needChangebook.id,
          name: this.name,
          author: this.author,
          yearPublication: null,
          rating: this.rating,
          ISBN: this.ISBN,
        };

        await changeBook(db, change);
        //setTimeout(this.closePopup(), 1000);
        this.closePopup();
      } else {
        let change = {
          id: this.needChangebook.id,
          name: this.name,
          author: this.author,
          yearPublication: this.yearPublication.toString(),
          rating: this.rating,
          ISBN: this.ISBN,
        };

        await changeBook(db, change);
        //setTimeout(this.closePopup(), 1000);
        this.closePopup();
      }
    },
    isValidIsbn(str) {
      let sum, digit, check, i;

      str = str.replace(/[^0-9X]/gi, "");

      if (str.length != 13) {
        return false;
      }

      if (str.length == 13) {
        sum = 0;
        for (i = 0; i < 12; i++) {
          digit = parseInt(str[i]);
          if (i % 2 == 1) {
            sum += 3 * digit;
          } else {
            sum += digit;
          }
        }
        check = (10 - (sum % 10)) % 10;

        return check == str[str.length - 1];
      }
    },
    checkDatabefore() {
      if (this.needChangebook.yearPublication == "0") {
        this.yearPublication = null;
      }
      if (this.needChangebook.ISBN == "null") {
        this.ISBN = null;
      }
    },
  },
  mounted() {
    let vm = this;
    document.addEventListener("click", function (item) {
      if (item.target === vm.$refs["popup_wrapper"]) {
        vm.closePopup();
      }
    });
    this.checkDatabefore();
  },
};
</script>

<style>
.popup_wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}
.addBook_form {
  width: max-content;
  height: max-content;
  overflow: auto;
  margin: auto;
  position: fixed;
  padding: 40px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #FFFFFF;
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;
}
</style>