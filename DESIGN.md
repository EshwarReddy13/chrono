# Chrono - Technical Design Document

## Project Overview

**Chrono** is a cross-platform time tracking application that allows users to track time on projects and tasks, view detailed reports, and receive AI-driven productivity insights. The application supports web, mobile, and desktop platforms with seamless data synchronization.

## Tech Stack

### Frontend
- **Web**: Next.js 14+ (App Router) with TypeScript
- **Mobile**: React Native with Expo
- **Desktop**: Electron
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Context + Zustand (for complex state)

### Backend
- **Framework**: Next.js API Routes (no separate backend server)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Raw SQL with pg driver (PostgreSQL client)
- **Authentication**: Firebase Auth

### Infrastructure
- **Hosting**: Vercel (web + API)
- **Database**: Neon PostgreSQL
- **Auth Service**: Firebase
- **File Storage**: Firebase Storage (if needed)
- **Real-time**: Server-Sent Events (SSE) + polling

### Development Tools
- **Package Manager**: pnpm (faster, more efficient)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

## System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client   │    │  Mobile Client │    │ Desktop Client │
│   (Next.js)    │    │ (React Native) │    │   (Electron)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Vercel (Next.js)     │
                    │                           │
                    │  ┌─────────────────────┐  │
                    │  │   API Routes        │  │
                    │  │   - /api/auth       │  │
                    │  │   - /api/projects   │  │
                    │  │   - /api/timer      │  │
                    │  │   - /api/reports    │  │
                    │  └─────────────────────┘  │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Neon PostgreSQL      │
                    │      (Database)          │
                    └───────────────────────────┘
```

### Data Flow
1. **Client** makes request to Next.js API route
2. **API Route** validates request, authenticates user
3. **Database** query executed via pg driver
4. **Response** returned to client with proper error handling
5. **Real-time updates** via SSE or polling

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Projects
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6',
  is_shared BOOLEAN DEFAULT FALSE,
  hourly_rate DECIMAL(10,2),
  is_billable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Time Entries
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  description TEXT,
  is_billable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Goals
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  target_hours DECIMAL(5,2) NOT NULL,
  period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Team Members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(project_id, user_id)
);
```

### Indexes for Performance
```sql
-- Time entries by user and date range
CREATE INDEX idx_time_entries_user_date ON time_entries(user_id, start_time);

-- Projects by user
CREATE INDEX idx_projects_user ON projects(user_id);

-- Tasks by project
CREATE INDEX idx_tasks_project ON tasks(project_id);

-- Goals by user and period
CREATE INDEX idx_goals_user_period ON goals(user_id, period, start_date);
```

## API Design

### Authentication Endpoints
```
POST /api/auth/login          # Firebase auth token validation
POST /api/auth/logout         # Clear session
GET  /api/auth/me            # Get current user info
POST /api/auth/refresh        # Refresh auth token
```

### Project Management
```
GET    /api/projects          # List user's projects
POST   /api/projects          # Create new project
GET    /api/projects/:id      # Get project details
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
GET    /api/projects/:id/tasks # Get project tasks
```

### Task Management
```
GET    /api/tasks             # List user's tasks
POST   /api/tasks             # Create new task
GET    /api/tasks/:id         # Get task details
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
```

### Time Tracking
```
GET    /api/timer/active      # Get active timer
POST   /api/timer/start       # Start timer
POST   /api/timer/stop        # Stop timer
POST   /api/timer/reset       # Reset timer
GET    /api/timer/entries     # Get time entries
POST   /api/timer/entries     # Create manual time entry
PUT    /api/timer/entries/:id # Update time entry
DELETE /api/timer/entries/:id # Delete time entry
```

### Reporting
```
GET /api/reports/daily        # Daily time summary
GET /api/reports/weekly       # Weekly time summary
GET /api/reports/monthly      # Monthly time summary
GET /api/reports/custom       # Custom date range report
GET /api/reports/export       # Export data (CSV, JSON)
```

### Goals
```
GET    /api/goals             # List user's goals
POST   /api/goals             # Create new goal
GET    /api/goals/:id         # Get goal details
PUT    /api/goals/:id         # Update goal
DELETE /api/goals/:id         # Delete goal
GET    /api/goals/progress    # Get goal progress
```

### Team Collaboration
```
GET    /api/team/projects     # List shared projects
POST   /api/team/invite       # Invite team member
PUT    /api/team/role         # Update team member role
DELETE /api/team/remove       # Remove team member
GET    /api/team/activity     # Get team activity
```

## Component Architecture

### Shared Components (shadcn/ui)
```
components/ui/
├── button.tsx
├── input.tsx
├── select.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── table.tsx
├── card.tsx
├── badge.tsx
├── progress.tsx
├── calendar.tsx
└── date-picker.tsx
```

### Feature Components
```
components/
├── timer/
│   ├── Stopwatch.tsx
│   ├── TimerControls.tsx
│   └── TimeDisplay.tsx
├── projects/
│   ├── ProjectList.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectForm.tsx
│   └── ProjectSettings.tsx
├── reports/
│   ├── ReportChart.tsx
│   ├── TimeSummary.tsx
│   ├── ProjectBreakdown.tsx
│   └── ExportOptions.tsx
├── goals/
│   ├── GoalList.tsx
│   ├── GoalCard.tsx
│   ├── GoalForm.tsx
│   └── GoalProgress.tsx
└── layout/
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Navigation.tsx
    └── Footer.tsx
```

## State Management

### Local State (React useState)
- Form inputs
- UI toggles
- Component-specific data

### Global State (React Context + Zustand)
- User authentication
- Current timer state
- Active project selection
- Theme preferences
- Offline/online status

### Server State (React Query/SWR)
- API data fetching
- Caching
- Background updates
- Optimistic updates

## Offline Support

### Strategy
1. **Service Worker** for caching static assets
2. **IndexedDB** for storing time entries locally
3. **Queue system** for pending API calls
4. **Conflict resolution** when reconnecting

### Implementation
```typescript
// lib/offline.ts
class OfflineManager {
  private queue: PendingAction[] = [];
  private db: IDBDatabase;

  async storeTimeEntry(entry: TimeEntry) {
    // Store locally first
    await this.storeLocally(entry);
    
    // Try to sync immediately
    try {
      await this.syncToServer(entry);
    } catch (error) {
      // Add to queue if offline
      this.queue.push({ type: 'CREATE_TIME_ENTRY', data: entry });
    }
  }

  async syncWhenOnline() {
    // Process queued actions when connection restored
    for (const action of this.queue) {
      await this.processAction(action);
    }
  }
}
```

## Real-time Features

### Implementation
- **Server-Sent Events (SSE)** for active timer status
- **Polling** every 30 seconds for data updates
- **Manual sync button** for immediate updates
- **Background sync** when app becomes active

### SSE Example
```typescript
// lib/sse.ts
export class SSEClient {
  private eventSource: EventSource;

  connect(userId: string) {
    this.eventSource = new EventSource(`/api/sse/${userId}`);
    
    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleUpdate(data);
    };
  }

  private handleUpdate(data: any) {
    // Update local state based on server events
    switch (data.type) {
      case 'TIMER_STARTED':
        // Update active timer state
        break;
      case 'TIMER_STOPPED':
        // Update timer state
        break;
    }
  }
}
```

## Security Considerations

### Authentication
- **Firebase Auth** for secure user management
- **JWT tokens** for API authentication
- **Session management** with secure cookies

### Data Protection
- **Row-level security** in PostgreSQL
- **Input validation** on all API endpoints
- **SQL injection prevention** with parameterized queries
- **Rate limiting** on API endpoints

### Privacy
- **User data isolation** between accounts
- **GDPR compliance** with data export/deletion
- **Audit logging** for sensitive operations

## Performance Optimization

### Frontend
- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Lazy loading** for non-critical components
- **Virtual scrolling** for large lists

### Backend
- **Database indexing** for common queries
- **Query optimization** with EXPLAIN analysis
- **Connection pooling** for database connections
- **Response caching** for static data

### Mobile
- **React Native optimization** with FlatList
- **Image caching** and lazy loading
- **Background processing** for data sync
- **Memory management** for large datasets

## Testing Strategy

### Unit Tests
- **Component testing** with React Testing Library
- **Utility function testing** with Jest
- **API route testing** with supertest

### Integration Tests
- **Database operations** with test database
- **API endpoint testing** with full request cycle
- **Authentication flow** testing

### E2E Tests
- **Critical user journeys** with Playwright
- **Cross-browser testing** for web app
- **Mobile app testing** with Detox

## Deployment Strategy

### Development
- **Local development** with Docker Compose
- **Database seeding** with sample data
- **Hot reload** for all platforms

### Staging
- **Preview deployments** on Vercel
- **Database branching** with Neon
- **Integration testing** environment

### Production
- **Automatic deployments** from main branch
- **Database migrations** with rollback capability
- **Monitoring** and error tracking
- **Backup strategy** for database

## Monitoring & Analytics

### Application Monitoring
- **Error tracking** with Sentry
- **Performance monitoring** with Vercel Analytics
- **User behavior** with privacy-compliant analytics

### Database Monitoring
- **Query performance** with Neon insights
- **Connection monitoring** and alerting
- **Storage usage** tracking

### Business Metrics
- **User engagement** tracking
- **Feature usage** analytics
- **Performance metrics** for key operations

## Future Enhancements

### Phase 2 Features
- **AI-powered insights** with machine learning
- **Advanced reporting** with custom dashboards
- **Integration APIs** for third-party tools
- **Mobile push notifications**

### Phase 3 Features
- **Team collaboration** tools
- **Client management** and invoicing
- **Advanced analytics** and forecasting
- **Enterprise features** and SSO

## Conclusion

This design provides a solid foundation for building Chrono as a scalable, cross-platform time tracking application. The technology choices prioritize developer experience, performance, and cost-effectiveness while maintaining the flexibility to add advanced features as the application grows.

The architecture supports the core requirements while providing clear paths for future enhancements and scaling.
