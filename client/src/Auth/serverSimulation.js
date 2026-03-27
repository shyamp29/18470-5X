/**
 * serverSimulation.js
 * --------------------------------------------------------------------------
 * PLACEHOLDER: Simulated server + database for local development/testing.
 * All field names, response shapes, and error codes mirror the contract
 * defined in haas_contract.md exactly.
 *
 * Replace each function body with a real fetch() call to your backend
 * once the API is live.  The exported function signatures must NOT change.
 * --------------------------------------------------------------------------
 */

// ─── Simulated network delay helper ────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Token counter (simulates JWT issuance) ────────────────────────────────
let tokenCounter = 1;
const makeToken = (userId) => `mock-token-${userId}-${tokenCounter++}`;


// ══════════════════════════════════════════════════════════════════════════
//  MOCK DATABASE
//  Mirrors the three MongoDB collections in Section 3 of the contract.
//  Field names are kept identical to the schema so the team can copy these
//  structures directly into Mongoose models later.
// ══════════════════════════════════════════════════════════════════════════

/**
 * Collection: users  (Section 3.1)
 *
 * NOTE: passwordHash stores a plain string here ONLY because this is a
 * simulation. The real backend must bcrypt-hash all passwords (cost ≥ 10)
 * and must never store or log the raw value.
 */
const mockUsersDB = [
    {
        _id:          "usr_001",
        userId:       "admin",            // login identifier (loginProps.userId)
        userName:     "Admin User",       // display name   (signupProps.userName)
        email:        "admin@test.com",   // signupProps.email / forgot-password
        passwordHash: "hashed_admin123",  // SIMULATION ONLY — use bcrypt in prod
        createdAt:    "2025-01-10T08:00:00Z",
        projects:     ["PROJ-101", "PROJ-102"],
    },
    {
        _id:          "usr_002",
        userId:       "tester1",
        userName:     "Jane Doe",
        email:        "jdoe@test.com",
        passwordHash: "hashed_pass456",
        createdAt:    "2025-02-14T10:30:00Z",
        projects:     ["PROJ-102", "PROJ-103"],
    },
    {
        _id:          "usr_003",
        userId:       "deve1",
        userName:     "Mark Smith",
        email:        "msmith@test.com",
        passwordHash: "hashed_pass789",
        createdAt:    "2025-03-01T09:15:00Z",
        projects:     ["PROJ-103", "PROJ-104"],
    },
];

/**
 * Collection: projects  (Section 3.2)
 *
 * checkedOut tracks per-project hardware usage.
 * checkedOut values must satisfy: SUM across all projects ≤ HW global capacity.
 */
const mockProjectsDB = [
    {
        _id:          "proj_001",
        projectID:    "PROJ-101",
        name:         "System Alpha",
        description:  "Main server allocation and load testing.",
        ownerUserId:  "admin",
        members:      ["admin", "tester1"],
        checkedOut:   { HWSet1: 20, HWSet2: 10 },
        createdAt:    "2025-01-15T09:00:00Z",
    },
    {
        _id:          "proj_002",
        projectID:    "PROJ-102",
        name:         "Beta Testing",
        description:  "Secondary node deployment and QA staging.",
        ownerUserId:  "tester1",
        members:      ["tester1", "admin"],
        checkedOut:   { HWSet1: 15, HWSet2: 30 },
        createdAt:    "2025-02-01T11:00:00Z",
    },
    {
        _id:          "proj_003",
        projectID:    "PROJ-103",
        name:         "Cloud Migration",
        description:  "Migrating on-prem workloads to cloud infrastructure.",
        ownerUserId:  "deve1",
        members:      ["deve1", "tester1"],
        checkedOut:   { HWSet1: 5, HWSet2: 20 },
        createdAt:    "2025-02-20T14:00:00Z",
    },
    {
        _id:          "proj_004",
        projectID:    "PROJ-104",
        name:         "Data Pipeline V2",
        description:  "Rebuilding the ETL pipeline with improved throughput.",
        ownerUserId:  "deve1",
        members:      ["deve1"],
        checkedOut:   { HWSet1: 0, HWSet2: 10 },
        createdAt:    "2025-03-05T08:45:00Z",
    },
];

/**
 * Collection: hardwareSets  (Section 3.3)
 *
 * Invariant enforced in checkout/checkin:
 *   availability + SUM(checkedOutBy.values) === capacity
 *
 * Verify manually:
 *   HWSet1: availability(60) + PROJ-101(20) + PROJ-102(15) + PROJ-103(5) + PROJ-104(0) = 100 ✓
 *   HWSet2: availability(130) + PROJ-101(10) + PROJ-102(30) + PROJ-103(20) + PROJ-104(10) = 200 ✓
 */
const mockHardwareDB = [
    {
        _id:          "hw_001",
        setName:      "HWSet1",
        capacity:     100,
        availability: 60,
        checkedOutBy: { "PROJ-101": 20, "PROJ-102": 15, "PROJ-103": 5, "PROJ-104": 0 },
    },
    {
        _id:          "hw_002",
        setName:      "HWSet2",
        capacity:     200,
        availability: 130,
        checkedOutBy: { "PROJ-101": 10, "PROJ-102": 30, "PROJ-103": 20, "PROJ-104": 10 },
    },
];


// ══════════════════════════════════════════════════════════════════════════
//  AUTH API  (Section 4.1)
//  Single unified mock replaces the previous mockAuthFetch + mockSignupApi
//  + mockRequestResetApi split.
// ══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/users/register
 * Request body : { userId, userName, email, password }
 * Response 200 : { message }
 * Response 409 : { error }  — duplicate userId, userName, or email
 */
const mockRegister = async ({ userId, userName, email, password }) => {
    await delay(1200);

    const dupUserId = mockUsersDB.find(u => u.userId === userId);
    if (dupUserId) {
        return { success: false, status: 409, error: "userId already exists." };
    }

    const dupUserName = mockUsersDB.find(u => u.userName === userName);
    if (dupUserName) {
        return { success: false, status: 409, error: "userName already exists." };
    }

    const dupEmail = mockUsersDB.find(u => u.email === email);
    if (dupEmail) {
        return { success: false, status: 409, error: "This email is already registered." };
    }

    const newUser = {
        _id:          `usr_${Date.now()}`,
        userId,
        userName,
        email,
        passwordHash: `hashed_${password}`,   // SIMULATION ONLY
        createdAt:    new Date().toISOString(),
        projects:     [],
    };
    mockUsersDB.push(newUser);

    return {
        success: true,
        status:  200,
        message: "Account created successfully.",
    };
};

/**
 * POST /api/users/login
 * Request body : { userId, password }
 * Response 200 : { token, userid, username }
 * Response 401 : { error }  — invalid credentials
 */
const mockLogin = async ({ userId, password }) => {
    await delay(1000);

    const user = mockUsersDB.find(u => u.userId === userId);

    // Simulate bcrypt.compare — in simulation we just check the prefix
    const passwordMatches = user && user.passwordHash === `hashed_${password}`;

    if (!user || !passwordMatches) {
        return { success: false, status: 401, error: "Invalid userId or password." };
    }

    return {
        success:  true,
        status:   200,
        token:    makeToken(user.userId),
        userid:   user.userId,
        username: user.userName,
    };
};

/**
 * POST /api/users/logout
 * Request header: Authorization: Bearer <token>
 * Response 200  : { message }
 */
const mockLogout = async () => {
    await delay(400);
    // Real backend invalidates the token in a denylist / session store.
    return { success: true, status: 200, message: "Signed out successfully." };
};

/**
 * POST /api/users/forgot-password
 * Request body : { email }
 * Response 200 : { message }   — always 200 to prevent user enumeration
 */
const mockForgotPassword = async ({ email }) => {
    await delay(1200);
    // Always returns 200 regardless of whether the email exists (contract rule).
    const found = mockUsersDB.some(u => u.email === email);
    return {
        success: true,
        status:  200,
        message: found
            ? "A reset link has been sent to your email."
            : "If that email is registered, a reset link will be sent.",
    };
};


// ══════════════════════════════════════════════════════════════════════════
//  PROJECTS API  (Section 4.2)
// ══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/projects/  (scoped to the logged-in user)
 * Response 200 : { message, projects: [{ projectId, name, description, ownerUserId, checkedOut, members, createdAt }] }
 */
const mockFetchUserProjects = async (userId) => {
    await delay(800);

    const user = mockUsersDB.find(u => u.userId === userId);
    if (!user) {
        return { success: false, status: 401, error: "Authentication required." };
    }

    const projects = mockProjectsDB
        .filter(p => user.projects.includes(p.projectID))
        .map(p => ({
            projectId:   p.projectID,
            name:        p.name,
            description: p.description,
            ownerUserId: p.ownerUserId,
            checkedOut:  p.checkedOut,
            members:     p.members,
            createdAt:   p.createdAt,
        }));

    return { success: true, status: 200, projects };
};

/**
 * GET /api/projects/  (all projects — global view for AllProjectsPage)
 * Response 200 : { data: [{ projectId, name, description }] }
 */
const mockFetchAllProjects = async () => {
    await delay(1000);

    const data = mockProjectsDB.map(p => ({
        projectId:   p.projectID,
        name:        p.name,
        description: p.description,
        ownerUserId: p.ownerUserId,
    }));

    return { success: true, status: 200, data };
};

/**
 * GET /api/projects/:projectID
 * Response 200 : { projectID, projectName, description, hardware[] }
 * Response 404 : { error }
 *
 * hardware[] shape per row:
 *   { setName, capacity, availability, allocated }
 */
const mockFetchProjectInfo = async (projectID) => {
    await delay(1000);

    const project = mockProjectsDB.find(p => p.projectID === projectID);
    if (!project) {
        return { success: false, status: 404, error: "Project not found." };
    }

    const hardware = mockHardwareDB.map(hw => ({
        setName:      hw.setName,
        capacity:     hw.capacity,
        availability: hw.availability,
        allocated:    project.checkedOut[hw.setName] ?? 0,
    }));

    return {
        success: true,
        status:  200,
        data: {
            projectId:   project.projectID,
            name:        project.name,
            description: project.description,
            hardware,
        },
    };
};

/**
 * POST /api/projects/create
 * Request body : { projectID, name, description }
 * Response 200 : { message, data: { projectID, name } }
 * Response 409 : { error }  — duplicate projectID
 */
const mockCreateProject = async ({ projectID, name, description = "" }, ownerUserId) => {
    await delay(1200);

    const exists = mockProjectsDB.find(p => p.projectID === projectID);
    if (exists) {
        return { success: false, status: 409, error: "A project with this ID already exists." };
    }

    // Initialise checkedOut to 0 for every known HW set (schema default)
    const checkedOut = {};
    mockHardwareDB.forEach(hw => { checkedOut[hw.setName] = 0; });

    const newProject = {
        _id:         `proj_${Date.now()}`,
        projectID,
        name,
        description,
        ownerUserId,
        members:     [ownerUserId],
        checkedOut,
        createdAt:   new Date().toISOString(),
    };
    mockProjectsDB.push(newProject);

    // Add projectID to owner's project list
    const owner = mockUsersDB.find(u => u.userId === ownerUserId);
    if (owner) owner.projects.push(projectID);

    return {
        success: true,
        status:  200,
        message: "Project created successfully.",
        data:    { projectId: newProject.projectID, name: newProject.name },
    };
};

/**
 * POST /api/projects/join
 * Request body : { projectID }
 * Response 200 : { message }
 * Response 404 : { error }
 */
const mockJoinProject = async ({ projectID }, userId) => {
    await delay(800);

    const project = mockProjectsDB.find(p => p.projectID === projectID);
    if (!project) {
        return { success: false, status: 404, error: "Project not found." };
    }

    if (!project.members.includes(userId)) {
        project.members.push(userId);
    }

    const user = mockUsersDB.find(u => u.userId === userId);
    if (user && !user.projects.includes(projectID)) {
        user.projects.push(projectID);
    }

    return { success: true, status: 200, message: "Joined project successfully." };
};


/**
 * POST /api/projects/exit
 * Response 200 : { message }
 * Response 400 : { error }  — owner cannot exit, must delete
 * Response 404 : { error }
 */
const mockExitProject = async ({ projectID }, userId) => {
    await delay(800);

    const project = mockProjectsDB.find(p => p.projectID === projectID);
    if (!project) return { success: false, status: 404, error: "Project not found." };

    if (project.ownerUserId === userId) {
        return { success: false, status: 400, error: "Owner cannot exit a project. Delete it instead." };
    }

    project.members = project.members.filter(m => m !== userId);
    const user = mockUsersDB.find(u => u.userId === userId);
    if (user) user.projects = user.projects.filter(id => id !== projectID);

    return { success: true, status: 200, message: "You have exited the project." };
};

/**
 * DELETE /api/projects/:projectID
 * Response 200 : { message }
 * Response 403 : { error }  — only owner can delete
 * Response 404 : { error }
 */
const mockDeleteProject = async ({ projectID }, userId) => {
    await delay(800);

    const projectIdx = mockProjectsDB.findIndex(p => p.projectID === projectID);
    if (projectIdx === -1) return { success: false, status: 404, error: "Project not found." };

    if (mockProjectsDB[projectIdx].ownerUserId !== userId) {
        return { success: false, status: 403, error: "Only the project owner can delete this project." };
    }

    mockProjectsDB.splice(projectIdx, 1);
    mockUsersDB.forEach(u => { u.projects = u.projects.filter(id => id !== projectID); });

    return { success: true, status: 200, message: "Project deleted successfully." };
};

// ══════════════════════════════════════════════════════════════════════════
//  HARDWARE API  (Section 4.3)
// ══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/hardware/
 * Response 200 : [{ setName, capacity, availability }]
 */
const mockFetchAllHardware = async () => {
    await delay(800);

    const data = mockHardwareDB.map(hw => ({
        setName:      hw.setName,
        capacity:     hw.capacity,
        availability: hw.availability,
    }));

    return { success: true, status: 200, data };
};

/**
 * POST /api/hardware/checkout
 * Request body : { projectID, setName, qty }
 *
 * Response 200 : { message, setName, availability, checkedOut }
 * Response 206 : { message, setName, availability, checkedOut,
 *                  requested, error: -1 }   — partial fill
 * Response 400 : { error }  — qty <= 0 or project/hw not found
 */
const mockCheckout = async ({ projectID, setName, qty }) => {
    await delay(900);

    if (!qty || qty <= 0) {
        return { success: false, status: 400, error: "qty must be greater than 0." };
    }

    const hw = mockHardwareDB.find(h => h.setName === setName);
    if (!hw) {
        return { success: false, status: 404, error: `Hardware set "${setName}" not found.` };
    }

    const project = mockProjectsDB.find(p => p.projectID === projectID);
    if (!project) {
        return { success: false, status: 404, error: "Project not found." };
    }

    // Determine how many units can actually be fulfilled
    const actualQty = Math.min(qty, hw.availability);
    const partial   = actualQty < qty;

    // Mutate mock DB (atomic in a real backend via MongoDB transaction)
    hw.availability                        -= actualQty;
    hw.checkedOutBy[projectID]              = (hw.checkedOutBy[projectID] ?? 0) + actualQty;
    project.checkedOut[setName]             = (project.checkedOut[setName] ?? 0) + actualQty;

    const base = {
        setName,
        availability: hw.availability,
        checkedOut:   project.checkedOut[setName],
    };

    if (partial) {
        return {
            success:   true,
            status:    206,
            message:   `Only ${actualQty} of ${qty} requested units were available and have been checked out.`,
            requested: qty,
            error:     -1,
            ...base,
        };
    }

    return {
        success: true,
        status:  200,
        message: `${actualQty} units of ${setName} checked out successfully.`,
        ...base,
    };
};

/**
 * POST /api/hardware/checkin
 * Request body : { projectID, setName, qty }
 *
 * Response 200 : { message, setName, availability, checkedOut }
 * Response 400 : { error }  — qty > project's checkedOut (full reject, no partial)
 */
const mockCheckin = async ({ projectID, setName, qty }) => {
    await delay(900);

    if (!qty || qty <= 0) {
        return { success: false, status: 400, error: "qty must be greater than 0." };
    }

    const hw = mockHardwareDB.find(h => h.setName === setName);
    if (!hw) {
        return { success: false, status: 404, error: `Hardware set "${setName}" not found.` };
    }

    const project = mockProjectsDB.find(p => p.projectID === projectID);
    if (!project) {
        return { success: false, status: 404, error: "Project not found." };
    }

    const currentlyAllocated = project.checkedOut[setName] ?? 0;

    // Contract rule: reject entirely if qty > what the project has checked out
    if (qty > currentlyAllocated) {
        return {
            success: false,
            status:  400,
            message: "Cannot check in more than what is currently checked out by this project.",
            error:   -1,
        };
    }

    // Mutate mock DB
    hw.availability                    += qty;
    hw.checkedOutBy[projectID]         -= qty;
    project.checkedOut[setName]        -= qty;

    return {
        success:      true,
        status:       200,
        message:      `${qty} units of ${setName} returned successfully.`,
        setName,
        availability: hw.availability,
        checkedOut:   project.checkedOut[setName],
    };
};


// ══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════
export {
    // Auth (Section 4.1) — consolidated into one mock per endpoint
    mockRegister,
    mockLogin,
    mockLogout,
    mockForgotPassword,

    // Projects (Section 4.2)
    mockFetchUserProjects,
    mockFetchAllProjects,
    mockFetchProjectInfo,
    mockCreateProject,
    mockJoinProject,
    mockExitProject,
    mockDeleteProject,

    // Hardware (Section 4.3)
    mockFetchAllHardware,
    mockCheckout,
    mockCheckin,
};