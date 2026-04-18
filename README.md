# Volunteer Coordination Backend
Smart resource allocation system for NGO volunteer management.

## Tech Stack
- Node.js + Express
- Firebase Firestore (database)
- UUID for unique IDs
- Nodemon for development


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

