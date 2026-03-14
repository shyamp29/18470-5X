import {useNavigate} from 'react-router-dom';
import {APP_ROUTES, AUTH_ACTIONS} from '../Auth/authActions';
import {createContext, useContext, useState} from 'react';
import {ErrorPopup, ForgetPopup, LoadingPopup, SuccessPopup} from "../components/popupModular";
import {mockLogin} from "./serverSimulation.js";

//TODO: update import later + update all mock server calls.

const MIN_WAIT_MS = 1500;
const minWait = () => new Promise((resolve) => setTimeout(resolve, MIN_WAIT_MS));

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth");
    return context;
};

const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [errorInfo, setErrorInfo] = useState({show: false, msg: ""});
    const [successInfo, setSuccessInfo] = useState({show: false, msg: ""})
    const [forgetInfo, setForgetInfo] = useState({show: false, type: "", content: ""});

    const showError = (msg) => setErrorInfo({show: true, msg});
    const clearError = () => setErrorInfo({show: false, msg: ""});
    const clearSuccess = () => setSuccessInfo({show: false, msg: ""});

    const handleAuthAction = async (actionType, payload = {}) => {
        switch (actionType) {
            case AUTH_ACTIONS.LOGIN:
                setIsLoading(true);
                try {
                    const [authResponse] = await Promise.all([mockLogin(payload), minWait]);

                    if (authResponse.success) {
                        setUser({
                            userId: response.userId,
                            userName: response.userName,
                            token: response.token,
                        });
                        navigate(APP_ROUTES.PROFILE);
                    } else {
                        showError(
                            response.status === 401
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
                    const [response] = await Promise.all([mockRegister(payload), minWait()]);

                    if (response.success) {
                        setSuccessInfo({
                            show: true,
                            msg: `Account created! Your user ID is: ${response.userId}`,
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
                try {
                    await mockLogout();
                } catch (err) {
                    console.error("LOGOUT error:", err);
                } finally {
                    setUser(null);
                    localStorage.removeItem('userToken');
                    navigate(APP_ROUTES.LOGIN);
                }
                break;

            case AUTH_ACTIONS.SIGNUP_REDIRECT:
                navigate(APP_ROUTES.SIGNUP);
                break;

            case AUTH_ACTIONS.FORGOT_PASSWORD:
                setForgetInfo({
                    show: true,
                    type: "PASSWORD",
                    content: ""
                })
                break;

            case AUTH_ACTIONS.FORGOT_ID:
                setForgetInfo({
                    show: true,
                    type: "ID",
                    content: ""
                })
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
                    const minWait = new Promise((resolve) => setTimeout(resolve, 10000));
                    const [response] = await Promise.all([mockRequestResetApi(payload), minWait]);
                    setIsLoading(false);

                    if (response.success) {
                        setForgetInfo({show: false, type: ""});
                        setSuccessInfo({
                            show: true,
                            email: payload,
                            userId: "RESET LINK SENT"
                        });
                    } else {
                        setErrorInfo({show: true, msg: response.message});
                    }

                } catch (err) {
                    setIsLoading(false);
                    setErrorInfo({show: true, msg: "Recovery service is currently offline."});
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
                         msg={{type: forgetInfo.type, content: forgetInfo.content}}
                         onClose={() => setForgetInfo({show: false, type: "", content: ""})}
                         onSubmit={(email) => handleAuthAction(AUTH_ACTIONS.REQUEST_RESET, email)}
            />
            <SuccessPopup showPopup={successInfo.show}
                          message={successInfo.msg}
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