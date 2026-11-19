import { useState } from "react";
import PropTypes from "prop-types";
import { AREAS, CATEGORIES, URGENCIES } from "../../constants.js";
import { todayInputValue } from "../../utils/format.js";
import "./RequestForm.css";

const EMPTY = {
  title: "",
  description: "",
  category: "",
  urgency: "medium",
  area: "",
  neededBy: "",
  contactNote: "",
};

function RequestForm({ initialValues, onSubmit, submitLabel, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(name) {
    return (event) =>
      setValues((prev) => ({ ...prev, [name]: event.target.value }));
  }

  // Ken Yong Code Review: I like that the form validates all required fields before submitting
  // and gives the user a clear error message when information is missing.
  // This helps prevent incomplete request data from being submitted.

  async function handleSubmit(event) {
    event.preventDefault();
    const missing = [
      "title",
      "description",
      "category",
      "area",
      "neededBy",
      "contactNote",
    ].filter((field) => !values[field].trim());
    if (missing.length) {
      setError("Fill in every field so helpers know what you need.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="request-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="rf-title" className="form-label">
          What do you need?
        </label>
        <input
          id="rf-title"
          className="form-control"
          maxLength={80}
          placeholder="Pick up a package from the mailroom"
          value={values.title}
          onChange={update("title")}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="rf-description" className="form-label">
          Details
        </label>
        <textarea
          id="rf-description"
          className="form-control"
          rows={4}
          maxLength={600}
          placeholder="What, when, and anything a helper should know."
          value={values.description}
          onChange={update("description")}
          required
        />
      </div>

      <div className="request-form-row">
        <div>
          <label htmlFor="rf-category" className="form-label">
            Category
          </label>
          <select
            id="rf-category"
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
          <label htmlFor="rf-area" className="form-label">
            Area
          </label>
          <select
            id="rf-area"
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
          <label htmlFor="rf-needed-by" className="form-label">
            Needed by
          </label>
          <input
            id="rf-needed-by"
            type="date"
            className="form-control"
            min={initialValues?.neededBy ? undefined : todayInputValue()}
            value={values.neededBy}
            onChange={update("neededBy")}
            required
          />
        </div>
      </div>

      <fieldset className="mb-3">
        <legend className="form-label">Urgency</legend>
        <div className="request-form-urgency">
          {URGENCIES.map((u) => (
            <div className="form-check form-check-inline" key={u}>
              <input
                className="form-check-input"
                type="radio"
                name="urgency"
                id={`rf-urgency-${u}`}
                value={u}
                checked={values.urgency === u}
                onChange={update("urgency")}
              />
              <label className="form-check-label" htmlFor={`rf-urgency-${u}`}>
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mb-4">
        <label htmlFor="rf-contact" className="form-label">
          How can your helper reach you?
        </label>
        <input
          id="rf-contact"
          className="form-control"
          maxLength={200}
          aria-describedby="rf-contact-help"
          placeholder="Email me at my campus address"
          value={values.contactNote}
          onChange={update("contactNote")}
          required
        />
        <div id="rf-contact-help" className="form-text">
          Only the person who offers to help will see this. Don&rsquo;t include
          your street address.
        </div>
      </div>

      <div className="request-form-actions">
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

RequestForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    urgency: PropTypes.string,
    area: PropTypes.string,
    neededBy: PropTypes.string,
    contactNote: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RequestForm;
