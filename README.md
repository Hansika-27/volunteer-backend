# Volunteer Coordination Backend
Smart resource allocation system for NGO volunteer management.

## Tech Stack
- Node.js + Express
- Firebase Firestore (database)
- UUID for unique IDs
- Nodemon for development

## Setup Instructions for Teammates

### Step 1 - Clone the repo

### Step 2 - Install dependencies
npm install

### Step 3 - Set up Firebase
1. Go to https://firebase.google.com and create a project
2. Go to Project Settings -> Service Accounts -> Generate new private key
3. Download the JSON file
4. Rename it to `serviceAccount.json`
5. Place it in the ROOT of this project (same level as package.json)

### Step 4 - Create your .env file
Copy .env.example and rename it to .env:
- Fill in your PORT (default 5000)
- NODE_ENV=development
- FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json

### Step 5 - Run the server
npm run dev

Server starts at: http://localhost:5000
Health check: http://localhost:5000/health

---

## API Routes

### Zones
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/zones | Create a disaster zone |
| GET | /api/zones | Get all zones |
| GET | /api/zones/:id | Get one zone |

### Volunteers
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/volunteers | Register a volunteer |
| GET | /api/volunteers | Get all volunteers |
| GET | /api/volunteers/:id | Get one volunteer |
| PATCH | /api/volunteers/:id/status | Update availability |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/tasks | Create task (auto-assigns volunteers) |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get one task |
| GET | /api/tasks/:id/matches | Preview best volunteer matches |
| PATCH | /api/tasks/:id/status | Update task status |

### Assignments
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/assignments | Get all assignments |
| PATCH | /api/assignments/:id/complete | Volunteer marks task done |
| PATCH | /api/assignments/:id/verify | Admin verifies completion |

### Resources
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/resources | Deploy resources to a zone |
| GET | /api/resources | Get all resources |
| PATCH | /api/resources/:id/consume | Record resource usage |

### Impact
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/impact/shortages | Get shortage alerts |
| POST | /api/impact/log | Log zone impact |
| GET | /api/impact/summary/:disasterId | Get disaster impact summary |

---

## Smart Matching Algorithm
When a task is created, the system automatically assigns the best volunteer using:

Score = Skill Match (40%) + Location Proximity (25%) + Availability (20%) + Past Performance (15%)

- Only available volunteers with the required skill are considered
- Closest volunteers to the disaster zone score higher
- Volunteers with more completed tasks score higher

## Task Lifecycle
OPEN -> ASSIGNED -> IN_PROGRESS -> COMPLETED -> VERIFIED

## Firestore Collections
Your code auto-creates these collections:
- `volunteers` - volunteer profiles
- `tasks` - disaster tasks
- `assignments` - who is assigned to what
- `zones` - disaster zones
- `resources` - food, medicine, etc.
- `impact_logs` - impact tracking data

## Important Notes
- Never commit `serviceAccount.json` or `.env` to GitHub
- Both are in `.gitignore` already
- NODE_ENV=development bypasses auth token check for testing
- Change NODE_ENV=production before final deployment
