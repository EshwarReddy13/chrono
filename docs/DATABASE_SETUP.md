# Database Setup Guide

This guide will help you set up the Neon PostgreSQL database for the Chrono time tracking application.

## Prerequisites

1. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
2. **Node.js**: Version 18+ installed
3. **Project Dependencies**: Run `npm install` to install required packages

## Step 1: Create Neon Database

1. **Sign in to Neon Console**
   - Go to [console.neon.tech](https://console.neon.tech)
   - Sign in with your account

2. **Create New Project**
   - Click "Create New Project"
   - Choose a project name (e.g., "chrono-dev")
   - Select a region close to you
   - Click "Create Project"

3. **Get Connection Details**
   - After project creation, you'll see connection details
   - Note down:
     - Host (e.g., `ep-cool-forest-123456.us-east-2.aws.neon.tech`)
     - Database name (e.g., `neondb`)
     - Username (e.g., `your_username`)
     - Password (auto-generated)
     - Port (usually 5432)

## Step 2: Configure Environment Variables

1. **Copy Environment Template**
   ```bash
   cp env.example .env.local
   ```

2. **Edit .env.local**
   ```bash
   # Neon Database Configuration
   NEON_HOST=ep-cool-forest-123456.us-east-2.aws.neon.tech
   NEON_DATABASE=neondb
   NEON_USERNAME=your_username
   NEON_PASSWORD=your_password_here
   NEON_PORT=5432
   NEON_SSL_MODE=require
   
   # Firebase Configuration (if not already set)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 3: Test Database Connection

1. **Run Test Script**
   ```bash
   node scripts/test-db.js
   ```

2. **Expected Output**
   ```
   🔌 Testing database connection...
   Host: ep-cool-forest-123456.us-east-2.aws.neon.tech
   Database: neondb
   User: your_username
   Port: 5432
   ✅ Database connection successful!
   ⏰ Current database time: 2024-01-15T10:30:00.000Z
   📋 No tables found. Database needs initialization.
   ```

## Step 4: Initialize Database Schema

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Initialize Database via API**
   ```bash
   curl -X POST http://localhost:3000/api/db-test \
     -H "Content-Type: application/json" \
     -d '{"action": "init"}'
   ```

   Or use the browser:
   - Navigate to `http://localhost:3000/api/db-test`
   - Use browser dev tools to make a POST request with `{"action": "init"}`

3. **Verify Tables Created**
   ```bash
   node scripts/test-db.js
   ```

   Expected output should now show:
   ```
   📋 Existing tables: [
     'user_preferences',
     'users',
     'projects',
     'tasks',
     'time_entries'
   ]
   ```

## Step 5: Verify Setup

1. **Check Database Status**
   ```bash
   curl http://localhost:3000/api/db-test
   ```

2. **Expected Response**
   ```json
   {
     "success": true,
     "status": {
       "isConnected": true,
       "tablesExist": true,
       "tableCount": 5
     },
     "message": "Database status checked successfully"
   }
   ```

## Database Schema Overview

The application creates the following tables:

- **`users`**: User accounts linked to Firebase authentication
- **`projects`**: User projects for time tracking
- **`tasks`**: Tasks within projects
- **`time_entries`**: Actual time tracking records
- **`user_preferences`**: User notification and app preferences

## Troubleshooting

### Connection Issues

1. **"ENOTFOUND" Error**
   - Check `NEON_HOST` is correct
   - Verify no typos in hostname

2. **"ECONNREFUSED" Error**
   - Check `NEON_PORT` is correct (usually 5432)
   - Verify firewall settings

3. **"28P01" Error (Authentication)**
   - Check `NEON_USERNAME` and `NEON_PASSWORD`
   - Verify credentials in Neon console

4. **"3D000" Error (Database doesn't exist)**
   - Check `NEON_DATABASE` name
   - Verify database exists in Neon console

### SSL Issues

1. **SSL Connection Required**
   - Ensure `NEON_SSL_MODE=require` is set
   - Neon requires SSL for all connections

2. **Certificate Issues**
   - The connection is configured to accept self-signed certificates
   - If issues persist, check Neon's SSL documentation

### Schema Issues

1. **Tables Not Created**
   - Check if initialization API call succeeded
   - Verify database user has CREATE permissions
   - Check console for error messages

2. **Permission Errors**
   - Ensure database user has necessary permissions
   - Contact Neon support if permission issues persist

## Development Workflow

1. **Local Development**
   - Use `.env.local` for local environment variables
   - Never commit `.env.local` to version control

2. **Schema Changes**
   - Update `src/lib/schema.sql` for schema changes
   - Test changes locally before deploying

3. **Database Reset**
   - Use the reset functionality in `src/lib/init-db.ts` for development
   - **WARNING**: This will delete all data

## Production Considerations

1. **Environment Variables**
   - Set production environment variables securely
   - Use environment variable management in your hosting platform

2. **Connection Pooling**
   - The application uses connection pooling for efficiency
   - Monitor connection usage in production

3. **Backup Strategy**
   - Neon provides automatic backups
   - Consider additional backup strategies for critical data

4. **Monitoring**
   - Use Neon's built-in monitoring tools
   - Monitor query performance and connection health

## Support

- **Neon Documentation**: [docs.neon.tech](https://docs.neon.tech)
- **Neon Support**: Available through Neon console
- **Project Issues**: Check project documentation and issues
