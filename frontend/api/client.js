const BASE_URL = "https://book-review-backend-tau.onrender.com"; // Thay đổi bằng link Render CỦA BẠN

/**
 * Base fetch wrapper for the application
 * @param {string} endpoint - The API endpoint (e.g., '/api/authors')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 */
export async function fetchClient(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    // Return parsed JSON if successful
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
