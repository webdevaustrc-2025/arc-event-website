# SharedAdminPanel API Integration Guide

## ✅ Created API Endpoints

### 1. **Users Management**

#### GET `/api/admin/users` - List all users
Fetches paginated list of all users with filtering, sorting, and search capabilities.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search query (searches name, email, team, segment)
- `sortBy` (default: "name") - Sort field
- `sortOrder` (default: "asc") - Sort direction (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "team": "CyberKnights",
        "role": "Captain",
        "status": "Approved",
        "segment": "Robo Wars"
      }
    ],
    "total": 7,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Users fetched successfully"
}
```

#### POST `/api/admin/users` - Create a new user
Creates a new user record.

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "team": "Team Name",
  "role": "Member",
  "status": "Pending",
  "segment": "Segment Name"
}
```

#### GET `/api/admin/users/[id]` - Get user by ID
Fetches a single user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "team": "CyberKnights",
    "role": "Captain",
    "status": "Approved",
    "segment": "Robo Wars"
  },
  "message": "User fetched successfully"
}
```

#### PUT `/api/admin/users/[id]` - Update a user
Updates an existing user's information.

**Request Body:**
```json
{
  "status": "Approved",
  "role": "Team Lead"
}
```

#### DELETE `/api/admin/users/[id]` - Delete a user
Deletes a user by ID.

---

### 2. **Segments Management**

#### GET `/api/admin/segments` - List all segments
Fetches paginated list of all segments with filtering, sorting, and search capabilities.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` - Search query (searches title, status)
- `sortBy` (default: "title") - Sort field
- `sortOrder` (default: "asc") - Sort direction (asc/desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "Robo Wars",
        "participants": 48,
        "prize": "$5,000",
        "status": "Active",
        "duration": "3 Hours",
        "color": "from-orange-500/20 to-red-500/20"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "Segments fetched successfully"
}
```

#### POST `/api/admin/segments` - Create a new segment
Creates a new segment/event record.

**Request Body:**
```json
{
  "title": "New Competition",
  "participants": 50,
  "prize": "$3,000",
  "status": "Active",
  "duration": "2 Hours",
  "color": "from-green-500/20 to-blue-500/20"
}
```

#### GET `/api/admin/segments/[id]` - Get segment by ID
Fetches a single segment by ID.

#### PUT `/api/admin/segments/[id]` - Update a segment
Updates an existing segment's information.

#### DELETE `/api/admin/segments/[id]` - Delete a segment
Deletes a segment by ID.

---

## 🔒 Security

All endpoints are protected with:
- **Admin Role Check**: Uses `requireAdmin()` middleware from NextAuth
- **Session Validation**: Verifies user is authenticated and has admin role
- **Returns 401 Unauthorized** if user is not authenticated or not an admin

---

## 📋 Updated Types in SharedAdminPanel

### `AdminUser`
```typescript
interface AdminUser {
  id: number;
  name: string;
  email: string;
  team?: string;
  role: string;
  status: string;
  segment?: string;
  createdAt?: string;
}
```

### `Segment`
```typescript
interface Segment {
  id: number;
  title: string;
  participants: number;
  prize: string;
  status: string;
  duration: string;
  color?: string;
}
```

---

## 🎯 How to Use in Admin Pages

### Example: Fetch Users with useAdminData

```typescript
"use client";
import { useAdminData } from "@/components/SharedAdminPanel";
import type { AdminUser } from "@/components/SharedAdminPanel";

export default function AdminUsersPage() {
  const {
    data,
    loading,
    pagination,
    setPage,
    search,
    refetch,
  } = useAdminData<AdminUser>({
    endpoint: "/api/admin/users",
    pageSize: 10,
    autoFetch: true,
  });

  return (
    // Use data, loading, pagination in your UI
  );
}
```

### Example: Fetch Segments with useAdminData

```typescript
"use client";
import { useAdminData } from "@/components/SharedAdminPanel";
import type { Segment } from "@/components/SharedAdminPanel";

export default function AdminSegmentsPage() {
  const {
    data,
    loading,
    pagination,
    sort,
    refetch,
  } = useAdminData<Segment>({
    endpoint: "/api/admin/segments",
    pageSize: 10,
    autoFetch: true,
  });

  return (
    // Use data, loading, pagination in your UI
  );
}
```

---

## 📡 Shared Infrastructure Used

- ✅ **adminFetch()** - Generic HTTP client for all requests
- ✅ **adminGet()** - GET requests
- ✅ **adminPost()** - POST requests
- ✅ **adminPut()** - PUT requests
- ✅ **adminDelete()** - DELETE requests
- ✅ **useAdminData()** - Data fetching + state management
- ✅ **useAdminDialog()** - Dialog state management
- ✅ **requireAdmin()** - Server-side admin verification
- ✅ **sonner toast** - Alert messages (integrated in adminFetch)

---

## 📊 Available Data Mock

### Users (7 total)
- Alex Johnson, Sam Smith, Jordan Lee, Taylor Swift, Casey Jones, Riley Reid, Morgan Freeman

### Segments (5 total)
- Robo Wars, Line Follower, Drone Racing, AI Hackathon, Maze Solver

---

## ⚙️ Configuration

All API endpoints follow this response format:

```typescript
interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

Error responses (non-2xx status):
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```
