import { useNavigate } from 'react-router-dom';
import { AUTH_ACTIONS, APP_ROUTES } from '../Auth/authActions';
import { createContext, useContext, useState } from 'react';
import { ErrorPopup, SuccessPopup, LoadingPopup, ForgetPopup } from "../components/popupModular";

//TODO: update import later + update all mock server calls.
import { mockAuthFetch, mockSignupApi } from "../Auth/serverSimulation";

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
  const [successInfo, setSuccessInfo] = useState({ show: false, msg: "" })
  const [forgetInfo, setForgetInfo] = useState({ show: false, type: "", content: "" });

  const handleAuthAction = async (actionType, payload = {}) => {
    const minWait = new Promise((resolve) => setTimeout(resolve, 5000));

    switch (actionType) {
      case AUTH_ACTIONS.LOGIN:
        setIsLoading(true);
        try {
          const [authResponse] = await Promise.all([mockAuthFetch(payload), minWait]);

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

      case AUTH_ACTIONS.SIGNUP:
        setIsLoading(true);
        try {
          const [result] = await Promise.all([mockSignupApi(payload), minWait]);
          setIsLoading(false);

          if (!result.success) {
            setErrorInfo({ show: true, msg: result.message });
          } else {
            setSuccessInfo({
              show: true,
              msg: payload.email
            });
          }
        } catch (err) {
          console.log("error: " + err);
          setIsLoading(false);
          setErrorInfo({ show: true, msg: "Registration failed. Try again." });
        }
        break;

      case AUTH_ACTIONS.SIGNUP_REDIRECT:
        navigate(APP_ROUTES.SIGNUP);
        break;

      case AUTH_ACTIONS.FORGOT_PASSWORD:
        setForgetInfo({
          show: true,
          type: "PASSWORD"
        })
        break;

      case AUTH_ACTIONS.FORGOT_ID:
        setForgetInfo({
          show: true,
          type: "ID"
        })
        break;

      case AUTH_ACTIONS.REQUEST_RESET:
        setIsLoading(true);
        try {
          const minWait = new Promise((resolve) => setTimeout(resolve, 10000));
          const [response] = await Promise.all([mockRequestResetApi(payload), minWait]);
          setIsLoading(false);

          if (response.success) {
            setForgetInfo({ show: false, type: "" });
            setSuccessInfo({
              show: true,
              email: payload,
              userId: "RESET LINK SENT"
            });
          } else {
            setErrorInfo({ show: true, msg: response.message });
          }

        } catch (err) {
          setIsLoading(false);
          setErrorInfo({ show: true, msg: "Recovery service is currently offline." });
        }
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
      <ForgetPopup
        showPopup={forgetInfo.show}
        msg={{ type: forgetInfo.type, content: forgetInfo.content }}
        onClose={() => setForgetInfo({ show: false, type: "", content: "" })}
        onSubmit={(email) => handleAuthAction(AUTH_ACTIONS.REQUEST_RESET, email)}
      />
      <SuccessPopup showPopup={successInfo.show}
        message={successInfo.msg}
        onClose={() => setSuccessInfo({ show: false, msg: "" })}
      />
      <ErrorPopup
        showPopup={errorInfo.show}
        message={errorInfo.msg}
        closePopup={() => setErrorInfo({ show: false, msg: "" })}
      />
    </AuthContext.Provider>
  );
};

export default AuthProvider;