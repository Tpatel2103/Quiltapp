import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="quilt-pagination" aria-label="Pages">
      {/* Ken Yong Code Review: Nothing wrong here, just a suggestion.
      May be we can use a more descriptive aria-label such as "Pagination" or "Page navigation" 
      instead of "Pages" so screen reader users can be more clearly understand the purpose of this navigation section.
      Again, there is nothing wrong, just my 2 cents. You did good! */}
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      {/* Ken Yong Code Review: I like this thay you are using aria-live="polite" here. 
          When the page number changes dynamically, screen-reader users can be informed 
          of the updated page without interrupting them unnecessarily. */}

      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-outline-primary"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
