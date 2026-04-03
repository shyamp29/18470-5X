# Issues to Address

Derived from audit against the Technical Contract & Schema Reference and `app.py`.

---

## <span style="color:#7ec8e3">(Contract)</span> 1. Register is missing `email` field
**Files:** `src/pages/SignupPage.js`, `src/Auth/apiCalls.js`, `server/app.py`

`SignupPage` has no email input. The contract requires `{ userid, userName, email, password }` for register, and the `users` schema requires `emailId`. Neither the frontend form, `apiRegister`, nor `app.py /api/add_user` collects or stores email — so `emailId` is never populated in the DB.

**Fix:** Add email input to `SignupPage`, pass it through `apiRegister`, and update `app.py /api/add_user` to accept and store it.

---

## 2. Hardware capacity and availability always show `null`
**Files:** `src/Auth/apiCalls.js`, `src/pages/AllHardwarePage.js`

`apiFetchAllHardware` calls `/api/get_all_hw_names` which only returns hardware set names. It maps each name with `capacity: null, availability: null`. `AllHardwarePage` renders these fields directly, so the table always displays `null`.

**Fix:** After fetching names, call `/api/get_hw_info` for each set (or add a backend route that returns full info for all sets) and populate `capacity` and `availability` before setting state.

---

## 3. `ProjectInfoPage` hardware capacity and availability show `null`
**Files:** `src/Auth/apiCalls.js`, `src/pages/ProjectInfoPage.js`

`apiFetchProjectInfo` builds each hardware entry with `capacity: null, availability: null`. `ProjectInfoPage` renders these columns directly — users see blank/null values for Capacity and Available.

**Fix:** After fetching project info, call `/api/get_hw_info` for each hardware set in the project and merge the capacity/availability data before returning.

---

## <span style="color:#7ec8e3">(Contract)</span> 4. `ownerUserId` derived from wrong source
**Files:** `src/Auth/apiCalls.js`, `src/pages/AllProjectsPage.js`

`_fetchAllProjectsFull` sets `ownerUserId: p.users?.[0]`, assuming the first array element is the owner. This breaks the owner-detection logic in `AllProjectsPage` (`proj.ownerUserId === userid`), which determines whether a user sees a Delete or Leave button. Blocked on backend adding an explicit `ownerUserId` field to the `Projects` schema (see server TODO §11).

---

## <span style="color:#7ec8e3">(Contract)</span> 5. Creating a project with an empty description returns 400
**Files:** `server/app.py` (line 226)

`app.py /api/create_project` uses `if not all([projectName, projectid, description, userid])`. In Python, an empty string is falsy, so submitting `description: ""` triggers `400 Missing required fields`, even though the contract marks description as optional.

**Fix (backend):** Change the validation to only check required fields: `if not all([projectName, projectid, userid])`.

---

## <span style="color:#7ec8e3">(Contract)</span> 6. Login response is missing `token`; auth uses session cookies only
**Files:** `server/app.py`, `src/Auth/apiCalls.js`

The contract specifies the login response as `{ token, userid, username }`. `app.py` returns `{ success, message, userid, username }` with no token, relying on Flask session cookies for auth. The frontend never sends an `Authorization: Bearer` header.

**Fix:** Either update the contract to reflect cookie-based sessions as the agreed approach, or implement JWT issuance in `app.py` and store/send the token on the frontend.

---

## 7. `get_project_info` returns 500 — `_id` ObjectId not JSON-serializable
**Files:** `server/projectsDB.py` → `queryProject()`

`find_one` returns the raw MongoDB document including `_id` (ObjectId). Flask's `jsonify` cannot serialize ObjectId, so the route crashes with a 500 and returns an HTML error page. The client handles this gracefully (shows "Failed to load project info") but the page is non-functional.

**Fix (backend):** Add `{"_id": 0}` projection to `find_one` in `queryProject()`. Apply the same to all other `find`/`find_one` calls that feed into `jsonify` responses.

---

## 8. `create_hardware_set` passes wrong number of arguments — TypeError crash
**Files:** `server/app.py` (line 349), `server/hardwareDB.py`

`app.py` calls `hardwareDB.createHardwareSet(client, hwName, qty, userid)` — 4 arguments. The function signature is `createHardwareSet(client, hwSetName, initCapacity)` — only 3. Every call to `/api/create_hardware_set` crashes with a `TypeError`.

**Fix (backend):** Remove the `userid` argument from the call, or add it to the `hardwareDB.createHardwareSet` signature if ownership tracking is needed.

---

## Route Path Mismatches (non-blocking — client tracks `app.py`, not the contract)

The following routes exist in `app.py` under non-contract paths. Client is consistent with `app.py` so functionality works, but they diverge from the agreed contract.

| Contract | `app.py` / Client |
|---|---|
| `POST /api/users/register` | `POST /api/add_user` |
| `POST /api/users/login` | `POST /api/login` |
| `POST /api/users/logout` | not implemented |
| `POST /api/users/forgot-password` | `POST /api/forgot_password` |
| `POST /api/users/reset-password` | `POST /api/reset_password` |
| `POST /api/projects/create` | `POST /api/create_project` |
| `GET /api/projects/:projectid` | `POST /api/get_project_info` |
| `GET /api/projects/` | `POST /api/get_all_projects` + `POST /api/get_user_projects_list` |
| `POST /api/projects/checkout` | `POST /api/check_out` |
| `POST /api/projects/checkin` | `POST /api/check_in` |
| `GET /api/hardware/` | `POST /api/get_all_hw_names` |
| `POST /api/hardware/add_capacity` | not implemented |
