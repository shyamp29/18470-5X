import { useNavigate } from 'react-router-dom';
import { AUTH_ACTIONS, APP_ROUTES } from '../Auth/authActions';
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleAuthAction = async (actionType, payload = {}) => {
    switch (actionType) {
      case AUTH_ACTIONS.LOGIN:
        if (payload.password.length > 5) {
          setUser({ id: payload.userId });
          navigate(APP_ROUTES.PROFILE);
        } else {
          return { error: "Invalid Credentials" };
        }
        break;

      case AUTH_ACTIONS.SIGNUP_REDIRECT:
        navigate(APP_ROUTES.SIGNUP);
        break;

      case AUTH_ACTIONS.FORGOT_PASSWORD:
        navigate(APP_ROUTES.FORGOT_PASS);
        break;

      case AUTH_ACTIONS.FORGOT_ID:
        navigate(APP_ROUTES.FORGOT_ID);
        break;

      case AUTH_ACTIONS.BACK_TO_LOGIN:
        navigate(APP_ROUTES.LOGIN);
        break;

      default:
        console.warn("Unknown action type:", actionType);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleAuthAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;