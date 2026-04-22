import { fetchClient } from "./client.js";

export async function getBooks() {
  return fetchClient("/api/books/");
}

export async function createBook(bookData) {
  return fetchClient("/api/books/", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
}

export async function updateBook(id, bookData) {
  return fetchClient(`/api/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
}

export async function deleteBook(id) {
  return fetchClient(`/api/books/${id}`, {
    method: "DELETE",
  });
}
