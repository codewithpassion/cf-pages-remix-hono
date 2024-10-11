import { API_ENDPOINT } from "@/lib/data/constants";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  authenticatedUser: { email: string; role: string; name: string } | null;
  loading: boolean;
  accessToken: string | null;
  login: (email: string) => Promise<{ ok: boolean }>;
  // validateToken: (token: string) => Promise<{ ok: boolean }>;
  validateMagicToken: (token: string) => Promise<{ ok: boolean }>;
  refreshToken: () => Promise<boolean | undefined>;
  logout: () => void;
  navigate: NavigateFunction;
  gotoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  isLogin?: boolean;
}> = ({ children, isLogin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    email: string;
    name: string;
    role: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<{
    token: string;
    validTo: number;
    role: string;
  } | null>(null);
  const [refreshToken, setRefreshToken] = useState<{
    token: string;
    validTo: number;
  } | null>(null);

  const gotoLogin = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (isLogin) {
      return;
    }
    const _accessToken = localStorage.getItem("accessToken");
    const _refreshToken = localStorage.getItem("refreshToken");
    // console.log("Stored tokens", _accessToken, _refreshToken);
    try {
      if (!_accessToken || !_refreshToken) {
        gotoLogin();
        return;
      }
      setAccessToken(JSON.parse(_accessToken));
      setRefreshToken(JSON.parse(_refreshToken));
    } catch (e) {
      console.log("Error setting tokens", e);
    }
  }, [gotoLogin, isLogin, navigate]);

  const callRefreshToken = useCallback(async () => {
    console.log("Refreshing access token", refreshToken);

    if (!refreshToken) {
      return;
    }

    const url = `${API_ENDPOINT}/auth/refresh`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Refresh-Token": refreshToken.token,
      },
    });

    if (result.ok) {
      const response = await result.json();
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.accessToken)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.refreshToken)
        );
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setAuthenticatedUser(response.user);
      }
    }
    return result.ok;
  }, [refreshToken]);

  const callValidateToken = useCallback(async () => {
    if (accessToken) {
      validateToken(accessToken.token).then((res) => {
        if (res.ok) {
          setAccessToken(res.accessToken);
          localStorage.setItem("accessToken", JSON.stringify(res.accessToken));
          setAuthenticatedUser(res.user);
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          setIsAuthenticated(false);

          if (refreshToken) {
            callRefreshToken().then((ok) => {
              if (ok) {
                setIsAuthenticated(true);
                setLoading(false);
              } else {
                setIsAuthenticated(false);
              }
            });
          }
        }
      });
    }
  }, [accessToken, callRefreshToken, refreshToken]);

  useEffect(() => {
    if (accessToken && !isAuthenticated) {
      callValidateToken();
    }
  }, [accessToken, callValidateToken, isAuthenticated]);

  const login = async (email: string) => {
    const url = `${API_ENDPOINT}/auth/login`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        redirectTo: window.location.origin + "/login/",
      }),
    });
    return { ok: result.ok };
  };

  const logout = async () => {
    const url = `${API_ENDPOINT}/auth/logout`;
    await fetch(url, {
      method: "POST",
      headers: {
        "X-Access-Token": accessToken?.token || "",
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setAuthenticatedUser(null);
    gotoLogin();
  };

  const validateToken = async (token: string) => {
    console.log("Validating token", token);
    const url = `${API_ENDPOINT}/auth/verify`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Token": token,
      },
    });

    if (!result.ok) {
      return { ok: false };
    }
    const response = await result.json();
    return {
      ok: response.ok,
      accessToken: response.accessToken,
      user: response.user,
    };
  };

  const validateMagicToken = async (token: string) => {
    console.log("Validating token", token);
    const url = `${API_ENDPOINT}/auth/magic`;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });

    if (result.ok) {
      const response = await result.json();
      if (response.accessToken && response.refreshToken) {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.accessToken)
        );
        localStorage.setItem(
          "refreshToken",
          JSON.stringify(response.refreshToken)
        );
        const user = {
          email: response.user.email,
          role: response.user.role,
          name: response.user.name,
        };
        localStorage.setItem("user", JSON.stringify(user));

        setIsAuthenticated(true);
        setAuthenticatedUser(user);
        setLoading(false);

        return { ok: true };
      } else {
        console.log("Failed to validate token", response);
        return { ok: false };
      }
    }

    return { ok: false };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        navigate,
        // validateToken,
        validateMagicToken,
        loading,
        authenticatedUser,
        accessToken: accessToken?.token || null,
        refreshToken: callRefreshToken,
        gotoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, gotoLogin } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      gotoLogin();
    }
  }, [gotoLogin, isAuthenticated]);

  return isAuthenticated ? <>{children}</> : null;
};
