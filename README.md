# Volunteer Backend
Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact

Built for Google for Developers Solution Challenge 2026 — Hack2Skill

---

## What This Does

When a disaster hits, NGOs struggle to assign the right volunteers to the right tasks.
This backend solves that with:

- Smart matching algorithm — assigns best volunteer based on skill, location, availability and past performance
- AI-powered disaster report analysis — paste raw field text, get structured task data back
- AI allocation recommendations — Groq LLM suggests optimal volunteer distribution across zones
- Resource tracking — monitor food, medicine, supplies per zone with shortage alerts
- Impact logging — track people helped, tasks completed, volunteers deployed

---

## Tech Stack

- Node.js + Express — REST API server
- Firebase Firestore — cloud database (real-time)
- Groq AI (LLaMA 3.1) — AI report analysis and recommendations
- UUID — unique document IDs
- Nodemon — auto-restart in development

---

## Setup Instructions

### Step 1 — Clone the repo
git clone https://github.com/Hansika-27/volunteer-backend.git
cd volunteer-backend

### Step 2 — Install dependencies
npm install

### Step 3 — Set up Firebase
1. Go to https://firebase.google.com and create a project
2. Go to Project Settings → Service Accounts → Generate new private key
3. Download the JSON file
4. Rename it to `serviceAccount.json`
5. Place it in the ROOT of this project (same level as package.json)

### Step 4 — Get a free Groq API key
1. Go to https://console.groq.com
2. Sign up with Google
3. Click API Keys → Create API Key
4. Copy the key (starts with gsk_...)

### Step 5 — Create your .env file
Create a file named `.env` in the root folder with these values:
PORT=5000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
GROQ_API_KEY=your-groq-api-key-here

### Step 6 — Seed demo data (optional but recommended for demo)
npm run seed
This creates 1 disaster zone, 8 volunteers, and 3 resources in Firestore.
Note the Zone ID printed in terminal — use it for testing.

### Step 7 — Run the server
npm run dev

Server starts at: http://localhost:5000
Health check: http://localhost:5000/health

---

## API Routes

### Health
| Method | Route | Description |
|--------|-------|-------------|
| GET | /health | Server health check |

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
| GET | /api/volunteers?status=available | Filter by availability |
| GET | /api/volunteers?skill=first_aid | Filter by skill |
| GET | /api/volunteers/:id | Get one volunteer |
| PATCH | /api/volunteers/:id/status | Update availability |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/tasks | Create task — auto-assigns best volunteer |
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks?status=open | Filter by status |
| GET | /api/tasks/:id | Get one task |
| GET | /api/tasks/:id/matches | Preview top volunteer matches |
| PATCH | /api/tasks/:id/status | Update task lifecycle status |

### Assignments
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/assignments | Get all assignments |
| GET | /api/assignments?volunteerId=X | Filter by volunteer |
| GET | /api/assignments?taskId=X | Filter by task |
| PATCH | /api/assignments/:id/complete | Volunteer marks task done |
| PATCH | /api/assignments/:id/verify | Admin verifies completion |

### Resources
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/resources | Deploy resources to a zone |
| GET | /api/resources | Get all resources |
| GET | /api/resources?zoneId=X | Filter by zone |
| PATCH | /api/resources/:id/consume | Record resource usage |

### Impact
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/impact/shortages | Get shortage alerts (below 20%) |
| POST | /api/impact/log | Log zone impact |
| GET | /api/impact/summary/:disasterId | Get disaster impact summary |

### AI (Groq LLaMA 3.1)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/ai/analyze-report | AI analyzes raw disaster report text |
| GET | /api/ai/recommend/:disasterId | AI recommends volunteer allocation |

---

## Smart Matching Algorithm

When a task is created, the system automatically finds and assigns the best available volunteer:
OPEN → ASSIGNED → IN_PROGRESS → COMPLETED → VERIFIED

---

## AI Features

### Disaster Report Analysis
Send raw field report text, get back structured task data:
- Task type (first_aid, food_distribution, rescue, logistics, shelter)
- Urgency level (critical, high, medium, low)
- Priority score (1-10)
- Required skills array
- Estimated volunteers needed
- One sentence summary

### Allocation Recommendations
Given a disaster ID, AI reads all zones and available volunteers from the database
and returns:
- Per-zone volunteer recommendations with reasoning
- Total volunteers needed
- Critical shortage flag
- Strategic advice paragraph

---

## Firestore Collections

Your code auto-creates these collections when APIs are called:

| Collection | Purpose |
|------------|---------|
| volunteers | Volunteer profiles with skills and location |
| tasks | Disaster tasks with required skills |
| assignments | Who is assigned to what with match score |
| zones | Disaster zones with affected people count |
| resources | Food, medicine, supplies per zone |
| impact_logs | People helped, tasks completed per zone |

---

## Important Notes

- Never commit `serviceAccount.json` or `.env` to GitHub — both are in `.gitignore`
- `NODE_ENV=development` bypasses Firebase Auth token check for testing
- Change `NODE_ENV=production` before final deployment
- Run `npm run seed` to populate demo data before presenting

---

## Project Structure

