import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import AuthContext from "./AuthContext.js";
import { apiFetch } from "../api.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/me")
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { username, password },
    });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (fields) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: fields,
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  // Ken Yong Code Review: Awesome! You are using useMemo() for the authentication context value along with useCallback()
  // for the authentication functions. This helps keep the context value stable instead of creating
  // new function references unnecessarily on every render! Good job!

  const value = useMemo(
    () => ({ user, checking, login, register, logout }),
    [user, checking, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
