import { fetchClient } from "./client.js";

/**
 * Fetch all authors from the database.
 * @returns {Promise<Array>} List of author objects
 */
export async function getAuthors() {
  return fetchClient("/api/authors/");
}

/**
 * Create a new author.
 * @param {object} authorData - The author object (e.g. { name: "John" })
 * @returns {Promise<object>} The newly created author
 */
export async function createAuthor(authorData) {
  return fetchClient("/api/authors/", {
    method: "POST",
    body: JSON.stringify(authorData),
  });
}

export async function updateAuthor(id, authorData) {
  return fetchClient(`/api/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(authorData),
  });
}

export async function deleteAuthor(id) {
  return fetchClient(`/api/authors/${id}`, {
    method: "DELETE",
  });
}
