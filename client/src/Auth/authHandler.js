import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../Auth/authActions';
import { createContext, useContext, useState } from 'react';
import { ErrorPopup, ForgetPopup, LoadingPopup, SuccessPopup } from "../components/popups";
import { apiLogin, apiRegister, apiLogout, apiForgotPassword, clearAuthToken } from "./apiCalls.js";

const MIN_WAIT_MS = 3000;
const minWait = () => new Promise((resolve) => setTimeout(resolve, MIN_WAIT_MS));

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth");
    return context;
};

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // ── UI state ──────────────────────────────────────────────────────────────
    const [isLoading,   setIsLoading]   = useState(false);
    const [errorInfo,   setErrorInfo]   = useState({ show: false, msg: "" });
    const [successInfo, setSuccessInfo] = useState({ show: false, msg: "" });
    const [forgetInfo,  setForgetInfo]  = useState({ show: false });

    const showError = (msg) => setErrorInfo({ show: true, msg });

    // Runs an async fn with the loading spinner; catches network-level failures.
    const withLoading = async (fn) => {
        setIsLoading(true);
        try {
            await fn();
        } catch (err) {
            console.error(err);
            showError("Connection failed. Please check your network.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Auth methods ──────────────────────────────────────────────────────────
    const login = async (payload) => {
        await withLoading(async () => {
            const [response] = await Promise.all([apiLogin(payload), minWait()]);
            if (response.status === 200) {
                const userData = { userid: response.userid, username: response.username };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                navigate(APP_ROUTES.PROFILE);
            } else {
                showError(
                    response.status === 409 || response.status === 401
                        ? "Invalid userid or password. Please try again."
                        : "Login failed. Please try again."
                );
            }
        });
    };

    const register = async (payload) => {
        await withLoading(async () => {
            const [response] = await Promise.all([apiRegister(payload), minWait()]);
            if (response.status === 200) {
                setSuccessInfo({ show: true, msg: "User added successfully, Please login" });
            } else {
                showError(response.message ?? "Registration failed. Please try again.");
            }
        });
    };

    const signout = async () => {
        setUser(null);
        localStorage.removeItem('user');
        clearAuthToken();
        navigate(APP_ROUTES.LOGIN);
        try { await apiLogout(); } catch (err) { console.error("LOGOUT error:", err); }
    };

    const requestReset = async (payload) => {
        await withLoading(async () => {
            const [response] = await Promise.all([apiForgotPassword(payload), minWait()]);
            if (response.success) {
                setForgetInfo({ show: false });
                setSuccessInfo({ show: true, msg: response.message });
            } else {
                showError(response.message ?? "Recovery service is currently offline.");
            }
        });
    };

    const updateAccount = (payload) => setUser(prev => ({ ...prev, ...payload }));

    // ── Navigation helpers ────────────────────────────────────────────────────
    const goToSignup         = () => navigate(APP_ROUTES.SIGNUP);
    const goToLogin          = () => navigate(APP_ROUTES.LOGIN);
    const showForgotPassword = () => setForgetInfo({ show: true });

    // ── Popups ────────────────────────────────────────────────────────────────
    return (
        <AuthContext.Provider value={{
            user,
            login, register, signout, requestReset, updateAccount,
            goToSignup, goToLogin, showForgotPassword,
        }}>
            {children}
            <LoadingPopup showPopup={isLoading} />
            <ForgetPopup
                showPopup={forgetInfo.show}
                onClose={() => setForgetInfo({ show: false })}
                onSubmit={requestReset}
            />
            <SuccessPopup
                showPopup={successInfo.show}
                message={successInfo.msg}
                title="New User Sign-up"
                btnLabel="Go to Login"
                onClose={() => { setSuccessInfo({ show: false, msg: "" }); navigate(APP_ROUTES.LOGIN); }}
            />
            <ErrorPopup
                showPopup={errorInfo.show}
                message={errorInfo.msg}
                onClose={() => setErrorInfo({ show: false, msg: "" })}
            />
        </AuthContext.Provider>
    );
};

export default AuthProvider;
