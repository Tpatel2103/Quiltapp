import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyOfferItem from "./MyOfferItem.jsx";
import HelperPatches from "./HelperPatches.jsx";
import { apiFetch } from "../../api.js";
import "./MyOffersPage.css";

// Manage your own offers — owned by Trupal Jageshkumar Patel
const TABS = [
  { id: "current", label: "Current", url: "/api/offers/mine" },
  { id: "past", label: "Past", url: "/api/offers/mine?view=past" },
];

function MyOffersPage() {
  const [tab, setTab] = useState("current");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const { url } = TABS.find((t) => t.id === tab);
    apiFetch(url)
      .then((data) => {
        if (!active) return;
        setItems(data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, reloadKey]);

  const reload = () => setReloadKey((n) => n + 1);

  async function handleStatusChange(offer, status) {
    try {
      await apiFetch(`/api/offers/${offer._id}/status`, {
        method: "PATCH",
        body: { status },
      });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  // Ken Yong Code Review: This is jsut a suggestion, nothing wrong.
  // May be we can consider using a custom confirmation dialog instead of window.confirm().
  // This will give you more control over the styling and make the delete confirmation
  // feel more consistent with the rest of the application. Again, you did a good job!

  async function handleDelete(offer) {
    if (!window.confirm(`Delete “${offer.title}”? This can't be undone.`))
      return;
    try {
      await apiFetch(`/api/offers/${offer._id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section>
      <div className="my-offers-page-header">
        <div>
          <h1 className="page-title">My offers</h1>
          <p className="page-lede">
            See who claimed a spot, mark offers full or completed, and read the
            feedback you received.
          </p>
        </div>
        <Link to="/offers/new" className="btn btn-primary">
          Post an offer
        </Link>
      </div>

      <HelperPatches key={reloadKey} />

      <div className="my-offers-page-tabs" role="group" aria-label="Show">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`btn ${tab === t.id ? "btn-primary" : "btn-outline-primary"}`}
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && <p role="status">Loading…</p>}
      {!loading && items.length === 0 && (
        <p className="my-offers-page-empty">
          {tab === "current"
            ? "You have no active offers. Post one when you're making a trip."
            : "Offers you mark completed will show up here."}
        </p>
      )}

      <ul className="my-offers-page-list">
        {!loading &&
          items.map((offer) => (
            <li key={offer._id}>
              <MyOfferItem
                offer={offer}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </li>
          ))}
      </ul>
    </section>
  );
}

MyOffersPage.propTypes = {};

export default MyOffersPage;
