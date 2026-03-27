/**
 * apiCalls.js  —  real API client
 * --------------------------------------------------------------------------
 * fetch() calls to the Flask backend.
 *
 * In dev, Vite proxies /api/* → http://127.0.0.1:5000  (see vite.config.js)
 * In prod, set VITE_API_URL in .env to the deployed server URL.
 * --------------------------------------------------------------------------
 */

import { API_BASE_URL } from '../api/config';

// ─── shared fetch helper ────────────────────────────────────────────────────
const post = async (path, body = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',          // send session cookie on every request
        body:        JSON.stringify(body),
    });
    const data = await res.json();
    return { ...data, status: res.status };
};


// ══════════════════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════════════════

// POST /api/login → {success, message, userid, username}
const apiLogin = async ({ userId, password }) => {
    return post('/api/login', { userId, password });
};

// POST /api/check_user_id — { success, exists }
// Stub until backend implements the route (see server/TODO.md §14).
// Returns { success: false } on network error so the caller skips the check gracefully.
const apiCheckUserId = async (userId) => {
    try {
        return await post('/api/check_user_id', { userId });
    } catch {
        return { success: false };
    }
};

// POST /api/add_user
// Flask expects lowercase `username`; client form sends camelCase `userName`.
// Flask does not use email — it is omitted here.
const apiRegister = async ({ userId, userName, password }) => {
    const data = await post('/api/add_user', { userId, username: userName, password });
    // authHandler checks response.error on failure; Flask uses response.message
    if (!data.success) return { ...data, error: data.message };
    return data;
};

// No dedicated logout route on Flask — the session cookie expires naturally.
// The client already clears localStorage and redirects; nothing more needed.
const apiLogout = async () => ({ success: true });

// POST /api/forgot_password — Flask expects { userId, username, newPassword }.
// The client sends { userId, userName } to verify identity; newPassword is not
// collected here (handled separately). Flask may return 400 until the contract
// is updated to support an identity-only lookup. See server/TODO.md §6.
const apiForgotPassword = async ({ userId, userName }) => {
    return post('/api/forgot_password', { userId, username: userName });
};


// ══════════════════════════════════════════════════════════════════════════
//  PROJECTS
// ══════════════════════════════════════════════════════════════════════════

// POST /api/get_all_projects → full project objects for every project in the DB
const _fetchAllProjectsFull = async () => {
    const data = await post('/api/get_all_projects', {});
    if (!data.success) return { success: false, projects: [] };
    const projects = (data.message ?? []).map(p => ({
        projectId:   p.projectId,
        name:        p.projectName,
        description: p.description,
        ownerUserId: p.users?.[0] ?? '',   // first member is the creator
        members:     p.users ?? [],
    }));
    return { success: true, projects };
};

// POST /api/get_user_projects_list → IDs only; enrich with full project data.
const apiFetchUserProjects = async (_userId) => {
    const [idsRes, allRes] = await Promise.all([
        post('/api/get_user_projects_list', {}),
        _fetchAllProjectsFull(),
    ]);
    if (!idsRes.success) return idsRes;
    const ids = new Set(Array.isArray(idsRes.message) ? idsRes.message : []);
    const projects = allRes.projects.filter(p => ids.has(p.projectId));
    return { ...idsRes, projects };
};

// Returns all projects (used by AllProjectsPage for the public list).
const apiFetchAllProjects = async () => {
    const res = await _fetchAllProjectsFull();
    return { success: res.success, status: 200, data: res.projects };
};

// POST /api/get_project_info
// Flask returns the raw MongoDB project doc in `message`.
const apiFetchProjectInfo = async (projectID) => {
    const data = await post('/api/get_project_info', { projectId: projectID });
    if (!data.success) return { ...data, status: data.status ?? 404 };
    const project = data.message;
    return {
        success: true,
        status:  200,
        data: {
            projectId:   project.projectId,
            name:        project.projectName,
            description: project.description,
            // hwSets is {setName: qty} — capacity/availability come from /api/get_hw_info
            hardware: Object.entries(project.hwSets ?? {}).map(([setName, allocated]) => ({
                setName,
                allocated,
                capacity:     null,
                availability: null,
            })),
        },
    };
};

// POST /api/create_project
// Flask expects {projectName, projectId, description}; shape uses {projectID, name}.
const apiCreateProject = async ({ projectID, name, description = '' }, _ownerUserId) => {
    const data = await post('/api/create_project', {
        projectId:   projectID,
        projectName: name,
        description,
    });
    if (!data.success) return data;
    return { ...data, data: { projectId: projectID, name } };
};

// POST /api/add_user_to_project  (join)
// ─────────────────────────────────────────────────────────────────────────────
// NOT YET FULLY IMPLEMENTED — server-side gaps:
//   • No session-based auth check: the route accepts any userId in the body,
//     so a caller can join on behalf of another user.
//   • No "guest join" flow: there is no concept of a public/invite link or
//     a pending-approval queue for users who are not already in the system.
// See TODO.md §11 (joining projects as a logged-in user) and §12 (guest join).
// ─────────────────────────────────────────────────────────────────────────────
const apiJoinProject = async ({ projectID }, userId) => {
    return post('/api/add_user_to_project', { projectId: projectID, userId });
};

// ─────────────────────────────────────────────────────────────────────────────
// NOT YET IMPLEMENTED — server routes /api/exit_project and /api/delete_project
// do not exist yet.  Both functions return a 501 so the UI can surface a clear
// message instead of silently failing.
// Project ownership (who may delete vs. exit) cannot be enforced until the
// backend stores an explicit ownerUserId field.  See TODO.md §8, §9, §13.
// ─────────────────────────────────────────────────────────────────────────────
const apiExitProject = async () => ({
    success: false, status: 501, error: 'Exit project is not yet implemented on the server.',
});
const apiDeleteProject = async () => ({
    success: false, status: 501, error: 'Delete project is not yet implemented on the server.',
});


// ══════════════════════════════════════════════════════════════════════════
//  HARDWARE
// ══════════════════════════════════════════════════════════════════════════

// POST /api/get_all_hw_names → message is an array of hardware set names.
// Full capacity/availability requires individual /api/get_hw_info calls.
// TODO §HW1 — Flask route uses `if not data:` instead of `if data is None:`.
// Fix: change `if not data:` → `if data is None:` in get_all_hw_names handler.
const apiFetchAllHardware = async () => {
    const data = await post('/api/get_all_hw_names', {});
    if (!data.success) return data;
    const names = Array.isArray(data.message) ? data.message : [];
    return {
        success: true,
        status:  200,
        data: names.map(setName => ({ setName, capacity: null, availability: null })),
    };
};

// POST /api/check_out
// Flask reads projectId from session; only hwSetName and qty are needed in the body.
const apiCheckout = async ({ projectID: _projectID, setName, qty }) => {
    return post('/api/check_out', { hwSetName: setName, qty });
};

// POST /api/check_in
const apiCheckin = async ({ projectID: _projectID, setName, qty }) => {
    return post('/api/check_in', { hwSetName: setName, qty });
};


// ══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════
export {
    apiLogin,
    apiRegister,
    apiCheckUserId,
    apiLogout,
    apiForgotPassword,

    apiFetchUserProjects,
    apiFetchAllProjects,
    apiFetchProjectInfo,
    apiCreateProject,
    apiJoinProject,
    apiExitProject,
    apiDeleteProject,

    apiFetchAllHardware,
    apiCheckout,
    apiCheckin,
};
