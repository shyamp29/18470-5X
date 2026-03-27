import {useNavigate} from 'react-router-dom';
import {APP_ROUTES, AUTH_ACTIONS} from '../Auth/authActions';
import {createContext, useContext, useState} from 'react';
import {ErrorPopup, ForgetPopup, LoadingPopup, SuccessPopup} from "../components/popupModular";
import {apiLogin, apiRegister, apiLogout, apiForgotPassword, setAuthToken, clearAuthToken} from "./apiCalls.js";

//TODO: update import later + update all mock server calls.

const MIN_WAIT_MS = 3000;
const minWait = () => new Promise((resolve) => setTimeout(resolve, MIN_WAIT_MS));

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth");
    return context;
};

const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorInfo, setErrorInfo] = useState({show: false, msg: ""});
    const [successInfo, setSuccessInfo] = useState({show: false, msg: ""})
    const [forgetInfo, setForgetInfo] = useState({show: false});

    const showError = (msg) => setErrorInfo({show: true, msg});
    const clearError = () => setErrorInfo({show: false, msg: ""});
    const clearSuccess = () => setSuccessInfo({show: false, msg: ""});

    const handleAuthAction = async (actionType, payload = {}) => {
        switch (actionType) {
            case AUTH_ACTIONS.LOGIN:
                setIsLoading(true);
                try {
                    const [response] = await Promise.all([apiLogin(payload), minWait()]);

                    if (response.status === 200) {
                        const userData = {
                            userid: response.userId,
                            username: response.username,
                        };
                        localStorage.setItem('user', JSON.stringify(userData));
                        setAuthToken(response.token);
                        setUser(userData);
                        navigate(APP_ROUTES.PROFILE);
                    } else {
                        showError(
                            response.status === 409 || response.status === 401
                                ? "Invalid userId or password. Please try again."
                                : "Login failed. Please try again."
                        );
                    }
                } catch (err) {
                    console.error("LOGIN error:", err);
                    showError("Connection failed. Please check your network.");
                } finally {
                    setIsLoading(false);
                }
                break;

            case AUTH_ACTIONS.SIGNUP: {
                setIsLoading(true);
                try {
                    const [response] = await Promise.all([apiRegister(payload), minWait()]);

                    if (response.success) {
                        setSuccessInfo({
                            show: true,
                            msg: "User added successfully, Please login",
                        });
                    } else {
                        // 409 — duplicate userName or email
                        showError(response.error ?? "Registration failed. Please try again.");
                    }
                } catch (err) {
                    console.error("SIGNUP error:", err);
                    showError("Registration failed. Please try again.");
                } finally {
                    setIsLoading(false);
                }
                break;
            }

            case AUTH_ACTIONS.SIGNOUT:
                setUser(null);
                localStorage.removeItem('user');
                clearAuthToken();
                navigate(APP_ROUTES.LOGIN);
                try {
                    await apiLogout();
                } catch (err) {
                    console.error("LOGOUT error:", err);
                }
                break;

            case AUTH_ACTIONS.SIGNUP_REDIRECT:
                navigate(APP_ROUTES.SIGNUP);
                break;

            case AUTH_ACTIONS.FORGOT_PASSWORD:
                setForgetInfo({ show: true });
                break;

            case AUTH_ACTIONS.UPDATE_ACCOUNT:
                setIsLoading(true);
                await minWait();
                setUser((prev) => ({...prev, ...payload}));
                setIsLoading(false);
                break;

            case AUTH_ACTIONS.REQUEST_RESET:
                setIsLoading(true);
                try {
                    const [response] = await Promise.all([
                        apiForgotPassword(payload),
                        minWait(),
                    ]);

                    if (response.success) {
                        setForgetInfo({show: false});
                        setSuccessInfo({show: true, msg: response.message});
                    } else {
                        showError(response.message ?? "Recovery service is currently offline.");
                    }
                } catch (err) {
                    console.error("REQUEST_RESET error:", err);
                    showError("Recovery service is currently offline.");
                } finally {
                    setIsLoading(false);
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
        <AuthContext.Provider value={{user, handleAuthAction}}>
            {children}
            <LoadingPopup showPopup={isLoading}/>
            <ForgetPopup showPopup={forgetInfo.show}
                         onClose={() => setForgetInfo({show: false})}
                         onSubmit={(fields) => handleAuthAction(AUTH_ACTIONS.REQUEST_RESET, fields)}
            />
            <SuccessPopup showPopup={successInfo.show}
                          message={successInfo.msg}
                          title="New User Sign-up"
                          btnLabel="Login"
                          onClose={() => setSuccessInfo({show: false, msg: ""})}
            />
            <ErrorPopup showPopup={errorInfo.show}
                        message={errorInfo.msg}
                        closePopup={() => setErrorInfo({show: false, msg: ""})}
            />
        </AuthContext.Provider>
    );
};

export default AuthProvider;