import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

// Ken Yong Code Review: I like that the protected route saves the user's current location before redirecting to the login page.
// This provides a better user experience because the application can return the user to the page they originally tried to access after authentication.

function ProtectedRoute({ children }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <p role="status" className="text-secondary">
        Checking your login…
      </p>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
