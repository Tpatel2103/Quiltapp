import PropTypes from "prop-types";
import "./StarRating.css";

// Shows a rating, or lets the user pick one when onChange is given.
function StarRating({ value, onChange, label = "Rating" }) {
  const stars = [1, 2, 3, 4, 5];

  // Ken Yong Code Review: Good use of aria-label here to provide a text description of the star rating for screen-reader users
  // instead of relying only on the visual star symbols.

  if (!onChange) {
    return (
      <span
        className="star-rating"
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {stars.map((n) => (
          <span
            key={n}
            className={n <= value ? "is-on" : ""}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </span>
    );
  }

  return (
    <fieldset className="star-rating star-rating-input">
      <legend className="form-label">{label}</legend>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? "is-on" : ""}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          aria-pressed={n === value}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </fieldset>
  );
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

export default StarRating;
