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

// POST /api/users/login → { message, userid, username }
const apiLogin = async ({ userId, password }) => {
    return post('/api/users/login', { userId, password });
};

// POST /api/users/register → { message }
const apiRegister = async ({ userId, username, email, password }) => {
    return post('/api/users/register', { userId, username, email, password });
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

// POST /api/users/reset-password → { message }
const apiResetPassword = async ({ oldPassword, newPassword }) => {
    return post('/api/users/reset-password', { oldPassword, newPassword });
};


// ══════════════════════════════════════════════════════════════════════════
//  PROJECTS  —  /api/projects/*
// ══════════════════════════════════════════════════════════════════════════

// GET /api/projects/ → { message, projectslist: [{ projectid, name, description,
//                         owneruserid, checkedout, members, createdat, updatedat }] }
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

// POST /api/projects/create → { message, projectid, name }
const apiCreateProject = async ({ projectId, name, description = '' }) => {
    return post('/api/projects/create', { projectId, name, description });
};

// POST /api/projects/add_user_to_project → { message }
const apiJoinProject = async (projectId, userId) => {
    return post('/api/projects/add_user_to_project', { projectId, userId });
};

// POST /api/projects/checkout → { message, availability, checkedout, error }
// 200 OK on full checkout; 206 Partial if qty > availability (error: -1).
// projectId is read from the server session (set by GET /api/projects/:id).
const apiCheckout = async ({ setName, qty }) => {
    return post('/api/projects/checkout', { setName, qty });
};

// POST /api/projects/checkin → { message, availability, checkedin, error }
// 206 Partial if qty > project's checkedout for that set (error: -1).
// projectId is read from the server session (set by GET /api/projects/:id).
const apiCheckin = async ({ setName, qty }) => {
    return post('/api/projects/checkin', { setName, qty });
};


// ══════════════════════════════════════════════════════════════════════════
//  HARDWARE  —  /api/hardware/*
// ══════════════════════════════════════════════════════════════════════════

// GET /api/hardware → { message, hardwaresets: [{ setname, capacity, availability, checkedoutby }] }
const apiFetchAllHardware = async () => {
    return get('/api/hardware');
};

// GET /api/hardware/:setName → { message, hardwareset: { setname, capacity, availability, checkedoutby } }
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
