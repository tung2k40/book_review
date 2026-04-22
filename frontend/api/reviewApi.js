import { fetchClient } from "./client.js";

export async function getReviews() {
  return fetchClient("/api/reviews/");
}

export async function createReview(reviewData) {
  return fetchClient("/api/reviews/", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export async function updateReview(id, reviewData) {
  return fetchClient(`/api/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(id) {
  return fetchClient(`/api/reviews/${id}`, {
    method: "DELETE",
  });
}
