/**
 * apiCalls.js  —  API client matching the Technical Contract & Schema Reference
 * --------------------------------------------------------------------------
 * All endpoints are prefixed with /api.
 * Protected routes send the session token as: Authorization: Bearer <token>
 *
 * In dev, Vite proxies /api/* → http://127.0.0.1:5000  (see vite.config.js)
 * In prod, set VITE_API_URL in .env to the deployed server URL.
 * --------------------------------------------------------------------------
 */

import { API_BASE_URL } from '../api/config';

// ─── token store ────────────────────────────────────────────────────────────
let _authToken = null;

export const setAuthToken = (token) => { _authToken = token; };
export const clearAuthToken = () => { _authToken = null; };

// ─── shared fetch helpers ────────────────────────────────────────────────────
const _headers = (extra = {}) => ({
    'Content-Type': 'application/json',
    ...(_authToken ? { Authorization: `Bearer ${_authToken}` } : {}),
    ...extra,
});

// Recursively lowercase all keys in a JSON response to avoid case-mismatch bugs.
const _normalizeKeys = (val) => {
    if (Array.isArray(val)) return val.map(_normalizeKeys);
    if (val !== null && typeof val === 'object') {
        return Object.fromEntries(
            Object.entries(val).map(([k, v]) => [k.toLowerCase(), _normalizeKeys(v)])
        );
    }
    return val;
};

const _parseResponse = async (res) => {
    try {
        const data = await res.json();
        return { ..._normalizeKeys(data), status: res.status };
    } catch {
        return { success: false, status: res.status, error: `Server error ${res.status}` };
    }
};

const post = async (path, body = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method:      'POST',
        headers:     _headers(),
        credentials: 'include',
        body:        JSON.stringify(body),
    });
    return _parseResponse(res);
};

const get = async (path) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method:      'GET',
        headers:     _headers(),
        credentials: 'include',
    });
    return _parseResponse(res);
};


// ══════════════════════════════════════════════════════════════════════════
//  AUTH  —  /api/users/*
// ══════════════════════════════════════════════════════════════════════════

// POST /api/users/login → { token, userid, username }
const apiLogin = async ({ userId, password }) => {
    return post('/api/users/login', { userId, password });
};

// POST /api/users/register → { message }
const apiRegister = async ({ userId, userName, email, password }) => {
    return post('/api/users/register', { userId, username: userName, email, password });
};

// POST /api/users/logout  (Bearer token sent via header)
const apiLogout = async () => {
    return post('/api/users/logout');
};

// POST /api/users/forgotid → { message }  (sends userId to the given email)
const apiForgotId = async ({ email }) => {
    return post('/api/users/forgotid', { email });
};

// POST /api/users/forgotpassword → { message }  (sends reset link to email)
const apiForgotPassword = async ({ email }) => {
    return post('/api/users/forgotpassword', { email });
};

// POST /api/users/resetpassword → { message }
const apiResetPassword = async ({ oldPassword, newPassword }) => {
    return post('/api/users/resetpassword', { oldPassword, newPassword });
};


// ══════════════════════════════════════════════════════════════════════════
//  PROJECTS  —  /api/projects/*
// ══════════════════════════════════════════════════════════════════════════

// GET /api/projects/ → { message, projects: [{ projectId, name, description,
//                         ownerUserid, checkedOut, members, createdAt, updatedAt }] }
const apiFetchUserProjects = async () => {
    return get('/api/projects/');
};

// GET /api/projects/all → { message, projectslist: [...all projects...] }
const apiFetchAllProjects = async () => {
    return get('/api/projects/all');
};

// GET /api/projects/:projectId → { message, project: { ... } }
const apiFetchProjectInfo = async (projectId) => {
    return get(`/api/projects/${encodeURIComponent(projectId)}`);
};

// POST /api/projects/create → { message, projectId, name }
const apiCreateProject = async ({ projectId, projectID, name, description = '' }) => {
    return post('/api/projects/create', {
        projectId:   projectId ?? projectID,
        name,
        description,
    });
};

// POST /api/projects/add_user_to_project → { message }
const apiJoinProject = async ({ projectId, projectID }, userId) => {
    return post('/api/projects/add_user_to_project', {
        projectId: projectId ?? projectID,
        userId,
    });
};

// POST /api/projects/checkout → { message, availability, checkedOut, error }
// 200 OK on full checkout; 206 Partial if qty > availability (error: -1).
const apiCheckout = async ({ projectID, projectId, setName, qty }) => {
    return post('/api/projects/checkout', {
        projectID: projectID ?? projectId,
        setName,
        qty,
    });
};

// POST /api/projects/checkin → { message, availability, checkedOut, error }
// 400 Bad Request if qty > project's checkedOut for that set (error: -1).
const apiCheckin = async ({ projectID, projectId, setName, qty }) => {
    return post('/api/projects/checkin', {
        projectID: projectID ?? projectId,
        setName,
        qty,
    });
};


// ══════════════════════════════════════════════════════════════════════════
//  HARDWARE  —  /api/hardware/*
// ══════════════════════════════════════════════════════════════════════════

// GET /api/hardware/ → [{ setName, capacity, availability, checkedOutBy }, ...]
const apiFetchAllHardware = async () => {
    return get('/api/hardware');
};

// GET /api/hardware/:setName → { setName, capacity, availability, checkedOutBy }
const apiFetchHardwareSet = async (setName) => {
    return get(`/api/hardware/${encodeURIComponent(setName)}`);
};


// ══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════
export {
    // auth
    apiLogin,
    apiRegister,
    apiLogout,
    apiForgotId,
    apiForgotPassword,
    apiResetPassword,

    // projects
    apiFetchUserProjects,
    apiFetchAllProjects,
    apiFetchProjectInfo,
    apiCreateProject,
    apiJoinProject,

    // hardware
    apiFetchAllHardware,
    apiFetchHardwareSet,
    apiCheckout,
    apiCheckin,
};
