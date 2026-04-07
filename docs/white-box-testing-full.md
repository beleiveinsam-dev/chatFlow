# ChatFlow White-Box Testing (Server + Frontend Logic)

## Scope
- Server: token helper, DB connector, auth middleware, user controller, message controller, route + middleware integration, Mongoose models.
- Client logic only (no UI rendering tests): `AuthContext`, `ChatContext`, and utility time formatter.
- DB layer is tested with `mongodb-memory-server` to cover real model behavior and controller DB writes/reads.

## Tooling Installed

### Server
- `vitest`
- `@vitest/coverage-v8`
- `supertest`
- `mongodb-memory-server`

### Client
- `vitest`
- `@vitest/coverage-v8`
- `@testing-library/react`
- `jsdom`

## Test Configuration Added
- Server config: `server/vitest.config.js`
- Server setup: `server/tests/setup.js`
- Client config: `client/vitest.config.js`
- Client setup: `client/tests/setup.js`
- `test` and `test:watch` scripts added in both `server/package.json` and `client/package.json`

## White-Box Test Cases (Detailed)

### 1) Token + DB Core

#### TC-SRV-001 `generateToken` signs payload correctly
- File: `server/tests/generateToken.test.js`
- Path under test: `server/generateToken.js`
- Branches validated:
  - token creation with provided `userId`
  - JWT secret usage
- Assertions:
  - decoded payload contains exact `userId`

#### TC-SRV-002 `connectDB` success path
- File: `server/tests/db.test.js`
- Path under test: `server/lib/db.js`
- Branches validated:
  - `mongoose.connect` called with `process.env.MONGODB_URI`

#### TC-SRV-003 `connectDB` failure path
- File: `server/tests/db.test.js`
- Branches validated:
  - catch block executes on connect rejection
  - `process.exit(1)` called

### 2) Model-Level DB Validation

#### TC-SRV-004 User model creates valid user
- File: `server/tests/models.test.js`
- Path under test: `server/models/User.model.js`
- Assertions:
  - user persisted
  - default `profilePic` applied

#### TC-SRV-005 User model rejects missing required fields
- File: `server/tests/models.test.js`
- Branches validated:
  - Mongoose validation error on missing required schema fields

#### TC-SRV-006 Message model create + default seen flag
- File: `server/tests/models.test.js`
- Path under test: `server/models/message.model.js`
- Assertions:
  - message saved with sender/receiver refs
  - `seen` defaults to `false`

### 3) Middleware White-Box

#### TC-SRV-007 `protectedRoute` valid token path
- File: `server/tests/auth.middleware.test.js`
- Path under test: `server/middlewares/auth.js`
- Branches validated:
  - token read from header
  - JWT verification
  - DB lookup and `-password` projection
  - attaches `req.user`
  - calls `next()`

#### TC-SRV-008 `protectedRoute` user missing path
- File: `server/tests/auth.middleware.test.js`
- Branches validated:
  - decoded token has non-existing user
  - returns `{ success: false, message: "user not found" }`

#### TC-SRV-009 `protectedRoute` invalid JWT path
- File: `server/tests/auth.middleware.test.js`
- Branches validated:
  - JWT verify throws
  - middleware returns structured error response

### 4) User Controller White-Box

#### TC-SRV-010 `signup` success path
- File: `server/tests/user.controller.test.js`
- Path under test: `server/controllers/user.controller.js`
- Branches validated:
  - duplicate-email guard bypassed
  - password salted + hashed
  - user creation
  - token creation + response
- DB assertions:
  - saved password differs from plaintext

#### TC-SRV-011 `signup` duplicate account path
- File: `server/tests/user.controller.test.js`
- Branches validated:
  - duplicate user found
  - early return with account-exists message

#### TC-SRV-012 `login` success path
- File: `server/tests/user.controller.test.js`
- Branches validated:
  - user lookup
  - bcrypt password compare true path
  - token response

#### TC-SRV-013 `login` invalid password path
- File: `server/tests/user.controller.test.js`
- Branches validated:
  - bcrypt compare false path
  - invalid credentials response

#### TC-SRV-014 `checkAuth` returns authenticated user
- File: `server/tests/user.controller.test.js`
- Branches validated:
  - direct response path from middleware-populated `req.user`

#### TC-SRV-015 `updateProfile` without image
- File: `server/tests/user.controller.test.js`
- Branches validated:
  - no `profilePic` branch
  - updates name + bio in DB

### 5) Message Controller White-Box

#### TC-SRV-016 `getUserForSidebar` filters self + computes unseen counts
- File: `server/tests/message.controller.test.js`
- Path under test: `server/controllers/message.controller.js`
- Branches validated:
  - excludes current user from sidebar query
  - iterates users with `Promise.all`
  - unseen message aggregation object updates

#### TC-SRV-017 `getMessages` conversation read + seen update
- File: `server/tests/message.controller.test.js`
- Branches validated:
  - `$or` query for both conversation directions
  - `updateMany` marks selected sender messages as seen

#### TC-SRV-018 `markMessageAsSeen` update by id
- File: `server/tests/message.controller.test.js`
- Branches validated:
  - message ID update path
  - success response

#### TC-SRV-019 `sendMessage` create with image branch
- File: `server/tests/message.controller.test.js`
- Branches validated:
  - cloud image upload path
  - DB insert with image URL
  - success response shape

### 6) Route + Middleware Integration

#### TC-SRV-020 protected route blocks invalid token
- File: `server/tests/routes.integration.test.js`
- Paths under test: `server/routes/userRoutes.js` + `protectedRoute`
- Branches validated:
  - route-level middleware rejection behavior

#### TC-SRV-021 protected route allows valid token
- File: `server/tests/routes.integration.test.js`
- Branches validated:
  - route-level middleware pass-through
  - endpoint receives middleware-set user

### 7) Frontend Logical White-Box (No UI)

#### TC-CLI-001 `formatMessageTime` output format
- File: `client/tests/utils.test.js`
- Path under test: `client/src/lib/utils.js`
- Branches validated:
  - returns `HH:mm` style 24-hour output

#### TC-CLI-002 `AuthContext.login` success logic
- File: `client/tests/auth.context.test.jsx`
- Path under test: `client/context/AuthContext.jsx`
- Branches validated:
  - API success branch
  - sets `authUser`
  - stores token in `localStorage`

#### TC-CLI-003 `AuthContext.logout` state reset logic
- File: `client/tests/auth.context.test.jsx`
- Branches validated:
  - clears localStorage token
  - resets auth-related state

#### TC-CLI-004 `AuthContext.updateProfile` success logic
- File: `client/tests/auth.context.test.jsx`
- Branches validated:
  - updates context `authUser` from API response

#### TC-CLI-005 `ChatContext.getUser` state load logic
- File: `client/tests/chat.context.test.jsx`
- Path under test: `client/context/ChatContext.jsx`
- Branches validated:
  - users state set
  - unseenMessages state set

#### TC-CLI-006 `ChatContext.getMessages` state load logic
- File: `client/tests/chat.context.test.jsx`
- Branches validated:
  - messages state set from API response

#### TC-CLI-007 `ChatContext.sendMessage` append logic
- File: `client/tests/chat.context.test.jsx`
- Branches validated:
  - selected user route usage
  - success branch appends new message

## Test Execution Output

### Server
- Command: `npm test`
- Result: `7 passed files`, `21 passed tests`

### Client
- Command: `npm test`
- Result: `3 passed files`, `7 passed tests`

## Total White-Box Coverage by Cases
- Total cases documented: 28
- Automated and passing: 28/28

## Important Quality Note
- `client` lint currently fails due pre-existing project issues unrelated to this test implementation (unused vars, hook dependency warnings, context export rule). Tests and build are green.

## Files Added/Updated for Testing
- `server/vitest.config.js`
- `server/tests/setup.js`
- `server/tests/helpers.js`
- `server/tests/generateToken.test.js`
- `server/tests/db.test.js`
- `server/tests/models.test.js`
- `server/tests/auth.middleware.test.js`
- `server/tests/user.controller.test.js`
- `server/tests/message.controller.test.js`
- `server/tests/routes.integration.test.js`
- `server/package.json`
- `client/vitest.config.js`
- `client/tests/setup.js`
- `client/tests/utils.test.js`
- `client/tests/auth.context.test.jsx`
- `client/tests/chat.context.test.jsx`
- `client/package.json`
