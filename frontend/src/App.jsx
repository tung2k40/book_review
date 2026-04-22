import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Author from "./pages/Author";
import Book from "./pages/Book";
import CreateAuthor from "./pages/CreateAuthor";
import CreateBook from "./pages/CreateBook";
import Review from "./pages/Review";
import CreateReview from "./pages/CreateReview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect root to /authors for default view */}
          <Route index element={<Navigate to="/authors" replace />} />

          <Route path="authors" element={<Author />} />
          <Route path="authors/create" element={<CreateAuthor />} />

          <Route path="books" element={<Book />} />
          <Route path="books/add" element={<CreateBook />} />

          <Route path="reviews" element={<Review />} />
          <Route path="reviews/create" element={<CreateReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
