# Backend TODO

Tracks every server-side addition or change introduced during client integration.
Each item describes what was added/patched on the dev branch and what the backend
team needs to properly implement, harden, or verify before production.

---

## 1. `POST /api/login` — return `userid` and `username` in success response

**File:** `app.py` → `login()`

**What was changed:**
After a successful login the route now queries the `users` collection a second time
to retrieve the `username` field and includes both `userid` and `username` in the
JSON response alongside the existing `message` field.

```json
{ "success": true, "message": "Login successful", "userid": "admin", "username": "Admin User" }
```

**What backend needs to do:**
- Verify that `usersDB.login()` itself returns the user document (avoids the extra
  DB round-trip currently done in the route).
- Consider returning a proper JWT token in this response instead of relying solely
  on the Flask session cookie, to support stateless/mobile clients in the future.
- Ensure the extra DB query does not raise a `KeyError` if the `username` field is
  missing from a legacy document.

---

## 2. `POST /api/login` — session key consistency fix

**File:** `app.py` → `login()`

**What was changed:**
The session key was corrected from `session['user_id']` to `session['userId']`
to match the key all other routes read with `session.get('userId')`.

**What backend needs to do:**
- Audit every route that reads from or writes to the session to confirm they all
  use the same key (`userId`).
- Add a centralised session helper (e.g. `get_session_user()`) so a typo like this
  cannot happen again.
- Write a test that logs in and then calls a protected route to catch this class of
  bug automatically.

---

## 3. `POST /api/get_user_projects_list` — removed mandatory request body

**File:** `app.py` → `get_user_projects_list()`

**What was changed:**
The `request.get_json()` / `if not data` guard was removed because the route reads
the user identity from the session, not from the request body. Sending `{}` (an
empty JSON object) is falsy in Python, which caused every call to return 400.

**What backend needs to do:**
- Review all routes that guard with `if not data` and remove the guard from any
  route that does not actually use the body.
- The route currently returns the raw list of project ID strings from MongoDB.
  Consider returning full project objects (or at least `projectId` + `projectName`)
  so the client does not need a second round-trip to enrich the list.
- Add session authentication middleware/decorator so unauthenticated calls to this
  route return 401 instead of silently returning "User not found".

---

## 4. `POST /api/get_all_projects` — new route (stub implementation)

**File:** `app.py` → `get_all_projects()`
**File:** `projectsDB.py` → `getAllProjects()`

**What was changed:**
A new route and DB helper were added that return every project document from the
`Projects` collection with `_id` excluded. The client uses this to populate the
"All Projects" and "My Projects" tables.

**What backend needs to do:**
- Add pagination or a limit — returning the entire collection is not scalable.
- Decide on access control: should unauthenticated users see all projects, or only
  logged-in users?
- The `ownerUserId` field is currently inferred on the client as `users[0]`
  (the first member) because the DB schema stores `users` but not a dedicated
  `ownerUserId` field. Add an explicit `ownerUserId` field to the `Projects`
  collection schema and to `createProject()`.
- The response shape uses raw MongoDB field names (`projectName`, `projectId`).
  Normalise to a consistent API contract (e.g. always camelCase).

---

## 5. `POST /api/logout` — missing route (currently stubbed on client)

**File:** `app.py` — route does not exist yet

**What was changed:**
The client's `mockLogout()` function returns `{ success: true }` immediately
without hitting the server. The Flask session is never explicitly invalidated.

**What backend needs to do:**
- Add `POST /api/logout` that calls `session.clear()` (or `session.pop('userId')`)
  and returns `{ "success": true, "message": "Signed out successfully." }`.
- If JWT tokens are adopted later, this route must also add the token to a denylist.

---

## 6. `POST /api/forgot_password` — contract mismatch with client (currently stubbed)

**File:** `app.py` → `forgot_password()`

**What was changed:**
The client's `mockForgotPassword()` is stubbed to always return a success message
without calling the server, because the existing Flask route expects
`{ userId, username, newPassword }` (a direct reset) while the client UI collects
only an **email address**.

**What backend needs to do:**
- Decide on the forgot-password flow:
  - **Option A (email link):** accept `{ email }`, look up the user, send a reset
    link, and add a separate `POST /api/reset_password` that validates a token.
  - **Option B (security questions):** accept `{ userId, username }` to verify
    identity, then allow a password change — matches the current DB schema.
- Update the client `ForgetPopup` fields to match whichever flow is chosen.
- Always return HTTP 200 regardless of whether the email/userId exists to prevent
  user enumeration (already noted in the mock contract).

---

## 7. `POST /api/exit_project` — missing route (currently stubbed on client)

**File:** `app.py` — route does not exist yet

**What was changed:**
`mockExitProject()` returns `{ success: false, status: 501, error: "Not implemented" }`.
The "Exit Project" button in the UI is non-functional.

**What backend needs to do:**
- Add `POST /api/exit_project` that accepts `{ projectId }`, reads `userId` from
  the session, removes the user from `project.users`, and removes `projectId` from
  `user.projects` (mirror of the existing `joinProject` / `addUser` logic).
- Reject if the requesting user is the project owner (owner must delete instead).

---

## 8. `POST /api/delete_project` — missing route (currently stubbed on client)

**File:** `app.py` — route does not exist yet

**What was changed:**
`mockDeleteProject()` returns `{ success: false, status: 501, error: "Not implemented" }`.
The "Delete" button in the UI is non-functional.

**What backend needs to do:**
- Add `POST /api/delete_project` that accepts `{ projectId }`, verifies the
  requesting user (from session) is the project owner, deletes the project document,
  and removes `projectId` from every member's `user.projects` array.
- Check in all hardware before deletion (or reject if hardware is still checked out).

---

## 9. Hardware list — client switched to `POST /api/get_user_hw_names`

**File:** `app.py` → `get_user_hw_names()` / `hardwareDB`

**What was changed:**
The client's `apiFetchAllHardware()` was updated to call `/api/get_user_hw_names`
instead of `/api/get_all_hw_names`. The old route returned 400 because it guarded
with `if not data:` (falsy in Python for `{}`); see §3 for that pattern.

**What backend needs to do:**
- Ensure `/api/get_user_hw_names` returns `{ "success": true, "message": [...] }`
  where `message` is an array of hardware set name strings.
- If `capacity` and `availability` should be shown in the UI, either include them
  in this response or add a separate `POST /api/get_hw_info` per set that the
  client can call to enrich the list.
- Audit all other routes for the `if not data:` pattern and replace with
  `if data is None:` to prevent the same 400 bug elsewhere.

---

## 10. `POST /api/check_out` / `POST /api/check_in` — projectId read from session

**File:** `app.py` → `check_out()`, `check_in()`

**What was changed:**
No code change — pre-existing behaviour. Both routes read `projectId` from
`session.get('projectId')`, which is set by `get_project_info`. The client passes
`projectID` in the call arguments but it is not sent in the request body.

**What backend needs to do:**
- Accept `projectId` in the request body instead of (or in addition to) the
  session, so checkout/checkin can be called without first calling `get_project_info`.
- Validate that the requesting user (`session['userId']`) is a member of the project
  before allowing checkout/checkin.

---

## 11. Project ownership — `ownerUserId` field missing from schema

**Files:** `projectsDB.py` → `createProject()`, `getAllProjects()` / `app.py` responses

**What was changed:**
The client infers the project owner as `users[0]` (the first element of the members
array) because the `Projects` collection has no dedicated `ownerUserId` field.
The Delete button is shown to whichever user matches this guess, which is unreliable.
Both the Delete and Exit buttons are **disabled** in the UI until this is resolved.

**What backend needs to do:**
- Add an `ownerUserId` field to the `Projects` schema and populate it in
  `createProject()`.
- Return `ownerUserId` in every project-list response (`get_all_projects`,
  `get_project_info`) so the client can correctly distinguish owners from members.
- Enforce ownership server-side in `delete_project`: reject the request with 403 if
  `session['userId'] !== project['ownerUserId']`.
- Run a one-time migration on existing documents to set `ownerUserId = users[0]`
  as a best-effort backfill.

---

## 12. Joining projects — no session-based auth or membership validation

**File:** `app.py` → `add_user_to_project()`

**What was changed:**
`mockJoinProject` passes `userId` in the request body and the Flask route uses it
directly with no verification that the caller is actually that user. Any client
could join any project on behalf of any userId.

**What backend needs to do:**
- Remove `userId` from the request body entirely; read it from `session['userId']`
  instead so a user can only join as themselves.
- Check that the project exists before adding the user (already done in
  `projectsDB.addUser`, but the route should return 404 explicitly).
- Return a clear error if the user is already a member (currently silently ignored).
- Update `usersDB.joinProject` in the same call so both the `Projects.users` array
  and the `users.projects` array stay in sync atomically.

---

## 13. Guest join flow — not implemented

**File:** `app.py` — no route exists

**What was changed:**
There is no mechanism for a user who is not already registered to request access
to a project (e.g. via a public invite link or a join-request queue).

**What backend needs to do:**
- Define the guest join policy: open join (any registered user can join any public
  project), invite-only (owner sends a link/token), or approval-based (owner
  approves pending requests).
- Implement the chosen flow as one or more new routes, e.g.:
  - `POST /api/projects/request_join` — user submits a join request.
  - `POST /api/projects/approve_join` — owner approves or rejects.
- Until this is implemented the "Join" button in the UI calls `add_user_to_project`
  directly, which works for registered users but has the auth gap noted in §12.

---

## 15. `POST /api/get_project_info` — 500 due to unserializable `_id` (ObjectId)

**File:** `projectsDB.py` → `queryProject()`

**Bug (currently breaking Project Info page):**
`find_one({"projectId": projectId})` returns the raw MongoDB document including
the `_id` field (type `ObjectId`). Flask's `jsonify` cannot serialize `ObjectId`,
so the route crashes with a 500 and returns an HTML error page instead of JSON.

**Fix:**
```python
# In queryProject(), exclude _id from the result:
project = projects_col.find_one({"projectId": projectId}, {"_id": 0})
```

Apply the same `{"_id": 0}` projection to every `find_one` / `find` call that
feeds into a `jsonify` response (`getAllProjects` already does this correctly).

---

## 14. `POST /api/check_user_id` — real-time userID availability check on sign-up

**File:** `app.py` — route does not exist yet
**Related:** `usersDB.py` — `checkUserId()` function does not exist yet

**What was changed (client side):**
The sign-up form (`SignupPage.js`) calls `POST /api/check_user_id` when the user
leaves the userID field (onBlur). If the ID is taken, an inline error label
"user id already exist" is shown under the field and the Create Account button
is disabled — preventing submission without relying on the error popup.

**Expected request body:**
```json
{ "userId": "some_id" }
```

**Expected response:**
```json
{ "success": true, "exists": true }   // ID is taken
{ "success": true, "exists": false }  // ID is available
```

**What backend needs to do:**
- Add the route in `app.py` using the existing `__queryUser` helper via `usersDB`.
  Call `__queryUser(client, "", userId)`; if the returned message is
  `"User not found"` the ID is free, otherwise it is taken:
  ```python
  @app.route('/api/check_user_id', methods=['POST'])
  def check_user_id():
      data = request.get_json()
      userId = data.get('userId') if data else None
      if not userId:
          return jsonify({"success": False, "message": "Missing userId"}), 400
      _, message, _ = usersDB._UsersDB__queryUser(client, "", userId)
      exists = message != "User not found"
      return jsonify({"success": True, "exists": exists}), 200
  ```
- No authentication required on this route (it is called before the user has an
  account). Rate-limit it to prevent enumeration attacks in production.
