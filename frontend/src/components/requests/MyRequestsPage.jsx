import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyRequestItem from "./MyRequestItem.jsx";
import HelpingItem from "./HelpingItem.jsx";
import { apiFetch } from "../../api.js";
import "./MyRequestsPage.css";

// Manage your own requests and the ones you're helping with —
// owned by Heta Vimaleshkumar Patel
const TABS = [
  { id: "active", label: "Active", url: "/api/requests/mine" },
  {
    id: "completed",
    label: "Completed",
    url: "/api/requests/mine?view=completed",
  },
  { id: "helping", label: "Helping", url: "/api/requests/helping" },
];

const EMPTY_TEXT = {
  active: "You have no open or in-progress requests.",
  completed: "Requests you mark completed will show up here.",
  helping: "When you tap “I can help” on a request, it shows up here.",
};

function MyRequestsPage() {
  const [tab, setTab] = useState("active");
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

  async function handleStatusChange(request, status) {
    try {
      await apiFetch(`/api/requests/${request._id}/status`, {
        method: "PATCH",
        body: { status },
      });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(request) {
    if (!window.confirm(`Delete “${request.title}”? This can't be undone.`))
      return;
    try {
      await apiFetch(`/api/requests/${request._id}`, { method: "DELETE" });
      reload();
    } catch (err) {
      setError(err.message);
    }
  }

  // Ken Yong Code Review: Nothing wrong here. When I read until here,
  // I was thinking may be we can consider adding try/catch here like you did in handleStatusChange() and handleDelete().
  // If submitting a rating fails, this would let you show the error message to the user instead of leaving the failed request unhandled.
  // Again, nothing wrong here. Just a small suggestion.

  async function handleRate(request, rating) {
    await apiFetch(`/api/requests/${request._id}/rating`, {
      method: "POST",
      body: rating,
    });
    reload();
  }

  return (
    <section>
      <div className="my-requests-page-header">
        <div>
          <h1 className="page-title">My requests</h1>
          <p className="page-lede">
            Update the status as things move along, then thank your helper.
          </p>
        </div>
        <Link to="/requests/new" className="btn btn-primary">
          Post a request
        </Link>
      </div>

      <div className="my-requests-page-tabs" role="group" aria-label="Show">
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
        <p className="my-requests-page-empty">{EMPTY_TEXT[tab]}</p>
      )}

      <ul className="my-requests-page-list">
        {!loading &&
          items.map((request) => (
            <li key={request._id}>
              {tab === "helping" ? (
                <HelpingItem request={request} />
              ) : (
                <MyRequestItem
                  request={request}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onRate={handleRate}
                />
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}

MyRequestsPage.propTypes = {};

export default MyRequestsPage;
