import { useNavigate } from 'react-router-dom';
import { AUTH_ACTIONS, APP_ROUTES } from '../Auth/authActions';
import { createContext, useContext, useState } from 'react';
import { ErrorPopup, SuccessPopup, LoadingPopup } from "../components/popupModular";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ show: false, msg: "" });
  //  TEST - Delete later //
  const mockAuthFetch = (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = true;
        resolve({ success: isValid });
      }, 2000);
    });
  };


  const handleAuthAction = async (actionType, payload = {}) => {
    switch (actionType) {
      case AUTH_ACTIONS.LOGIN:
        setIsLoading(true);
        try {
          const minWait = new Promise((resolve) => setTimeout(resolve, 5000));
          const authRequest = mockAuthFetch(payload); //fix later

          const [authResponse] = await Promise.all([authRequest, minWait]);

          if (authResponse.success) {
            setIsLoading(false);
            navigate(APP_ROUTES.PROFILE);
          } else {
            setIsLoading(false);
            setErrorInfo({ show: true, msg: "User not found on database \nPlease check credentials" });
          }
        } catch (err) {
          setIsLoading(false);
          console.log(err);
          setErrorInfo({ show: true, msg: "Connection failed." });
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
      <LoadingPopup showPopup={isLoading} />
      <ErrorPopup
        showPopup={errorInfo.show}
        message={errorInfo.msg}
        closePopup={() => setErrorInfo({ show: false, msg: "" })}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;