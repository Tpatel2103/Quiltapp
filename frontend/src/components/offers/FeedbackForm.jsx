import { useId, useState } from "react";
import PropTypes from "prop-types";
import StarRating from "../shared/StarRating.jsx";
import "./FeedbackForm.css";

function FeedbackForm({ offererName, onSubmit }) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  // Ken Yong Code Review: I noticed that you using React's useId() hook to create a unique ID for the comment field.
  // This correctly connects the label to the textarea without relying on a hard coded ID. Sweet.
  const commentId = useId();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!stars) {
      setError("Choose a star rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ stars, comment });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h4>How was it with {offererName}?</h4>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <StarRating value={stars} onChange={setStars} label="Your rating" />
      <label htmlFor={commentId} className="form-label mt-2">
        Comment (optional)
      </label>
      <textarea
        id={commentId}
        className="form-control"
        rows={2}
        maxLength={300}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm mt-2"
        disabled={saving}
      >
        {saving ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}

FeedbackForm.propTypes = {
  offererName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FeedbackForm;
