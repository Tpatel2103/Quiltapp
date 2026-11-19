import { useState } from "react";
import PropTypes from "prop-types";
import { AREAS, CATEGORIES } from "../../constants.js";
import { todayInputValue } from "../../utils/format.js";
import "./OfferForm.css";

const EMPTY = {
  title: "",
  description: "",
  category: "",
  area: "",
  date: "",
  availability: "",
  spots: "1",
  contactNote: "",
};

function OfferForm({ initialValues, onSubmit, submitLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(name) {
    return (event) =>
      setValues((prev) => ({ ...prev, [name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const missing = [
      "title",
      "description",
      "category",
      "area",
      "date",
      "availability",
      "contactNote",
    ].filter((field) => !String(values[field]).trim());
    if (missing.length) {
      setError("Fill in every field so people know what you're offering.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({ ...values, spots: Number(values.spots) });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="offer-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="of-title" className="form-label">
          What are you offering?
        </label>
        <input
          id="of-title"
          className="form-control"
          maxLength={80}
          placeholder="Grocery run Saturday, can shop for 2 people"
          value={values.title}
          onChange={update("title")}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="of-description" className="form-label">
          Details
        </label>
        <textarea
          id="of-description"
          className="form-control"
          rows={4}
          maxLength={600}
          placeholder="Where you're going and anything people should know."
          value={values.description}
          onChange={update("description")}
          required
        />
      </div>

      <div className="offer-form-row">
        <div>
          <label htmlFor="of-category" className="form-label">
            Category
          </label>
          <select
            id="of-category"
            className="form-select"
            value={values.category}
            onChange={update("category")}
            required
          >
            <option value="">Choose one</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="of-area" className="form-label">
            Area
          </label>
          <select
            id="of-area"
            className="form-select"
            value={values.area}
            onChange={update("area")}
            required
          >
            <option value="">Choose one</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="of-spots" className="form-label">
            Spots
          </label>
          <input
            id="of-spots"
            type="number"
            min={1}
            max={10}
            className="form-control"
            value={values.spots}
            onChange={update("spots")}
            required
          />
        </div>
      </div>

      <div className="offer-form-row offer-form-row-two">
        <div>
          <label htmlFor="of-date" className="form-label">
            Date
          </label>
          <input
            id="of-date"
            type="date"
            className="form-control"
            min={initialValues?.date ? undefined : todayInputValue()}
            value={values.date}
            onChange={update("date")}
            required
          />
        </div>
        <div>
          <label htmlFor="of-availability" className="form-label">
            Availability
          </label>
          <input
            id="of-availability"
            className="form-control"
            maxLength={80}
            placeholder="10am to 1pm"
            value={values.availability}
            onChange={update("availability")}
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="of-contact" className="form-label">
          How can people who claim a spot reach you?
        </label>
        {/*  Ken Yong Code Review: Again, very good in using aria-describedby to connect the contact field with its help text. 
             I also like that the message reminds users not to enter their street address which helps protect user privacy.*/}
        <input
          id="of-contact"
          className="form-control"
          maxLength={200}
          aria-describedby="of-contact-help"
          placeholder="Message me on Teams"
          value={values.contactNote}
          onChange={update("contactNote")}
          required
        />
        <div id="of-contact-help" className="form-text">
          Only people who claim a spot will see this. Don&rsquo;t include your
          street address.
        </div>
      </div>

      <div className="offer-form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

OfferForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    area: PropTypes.string,
    date: PropTypes.string,
    availability: PropTypes.string,
    spots: PropTypes.string,
    contactNote: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default OfferForm;
