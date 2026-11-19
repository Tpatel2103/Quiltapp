import { useState } from "react";
import PropTypes from "prop-types";
import { AREAS, CATEGORIES } from "../../constants.js";
import "./OfferFilters.css";

function OfferFilters({ filters, onChange }) {
  const [searchText, setSearchText] = useState(filters.search);

  function handleSearch(event) {
    event.preventDefault();
    onChange({ ...filters, search: searchText.trim() });
  }

  function handleSelect(name) {
    return (event) => onChange({ ...filters, [name]: event.target.value });
  }

  // Ken Yong Code Review: Just a small suggestion, nothing wrong with what you currently doing.
  // May be we can consider storing the default filter values in a constant instead of repeating them here.
  // This could make the defaults easier to maintain if the filter options change later.

  function handleClear() {
    setSearchText("");
    onChange({ search: "", category: "", area: "", sort: "soonest" });
  }

  return (
    <form className="offer-filters" onSubmit={handleSearch} role="search">
      <div className="offer-filters-search">
        <label htmlFor="offer-search" className="form-label">
          Search offers
        </label>
        <div className="input-group">
          <input
            id="offer-search"
            type="search"
            className="form-control"
            placeholder="Try “grocery” or “airport”"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="offer-category" className="form-label">
          Category
        </label>
        <select
          id="offer-category"
          className="form-select"
          value={filters.category}
          onChange={handleSelect("category")}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="offer-area" className="form-label">
          Area
        </label>
        <select
          id="offer-area"
          className="form-select"
          value={filters.area}
          onChange={handleSelect("area")}
        >
          <option value="">All areas</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="offer-sort" className="form-label">
          Sort by
        </label>
        <select
          id="offer-sort"
          className="form-select"
          value={filters.sort}
          onChange={handleSelect("sort")}
        >
          <option value="soonest">Happening soonest</option>
          <option value="spots">Most spots</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="offer-filters-clear">
        <button type="button" className="btn btn-link" onClick={handleClear}>
          Clear filters
        </button>
      </div>
    </form>
  );
}

OfferFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OfferFilters;
