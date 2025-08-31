import { NextRequest, NextResponse } from 'next/server';
import { getUserByFirebaseUid } from '@/lib/services/userService';
import { getProjectById } from '@/lib/services/projectService';
import { query } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { project_id, task_id, description, start_time, end_time, duration_seconds } = await request.json();
    
    // Get the Firebase UID from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Missing or invalid authorization header'
      }, { status: 401 });
    }

    const firebaseUid = authHeader.replace('Bearer ', '');
    
    // Get the user from the database
    const user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    if (!project_id || !start_time) {
      return NextResponse.json({
        success: false,
        error: 'Project ID and start time are required'
      }, { status: 400 });
    }

    // Verify the project exists and belongs to the user
    const project = await getProjectById(project_id);
    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to project'
      }, { status: 403 });
    }

    // Create the time entry
    const result = await query(`
      INSERT INTO time_entries (
        user_id,
        project_id,
        task_id,
        description,
        start_time,
        end_time,
        duration_seconds
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `, [
      user.id,
      project_id,
      task_id || null,
      description || null,
      start_time,
      end_time || null,
      duration_seconds || null
    ]);

    return NextResponse.json({
      success: true,
      timeEntry: result.rows[0],
      message: 'Time entry created successfully'
    });

  } catch (error) {
    console.error('Time entry creation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create time entry'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the Firebase UID from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Missing or invalid authorization header'
      }, { status: 401 });
    }

    const firebaseUid = authHeader.replace('Bearer ', '');
    
    // Get the user from the database
    const user = await getUserByFirebaseUid(firebaseUid);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Get time entries for the user
    const result = await query(`
      SELECT 
        te.*,
        p.name as project_name,
        p.color as project_color,
        t.name as task_name
      FROM time_entries te
      LEFT JOIN projects p ON te.project_id = p.id
      LEFT JOIN tasks t ON te.task_id = t.id
      WHERE te.user_id = $1
      ORDER BY te.start_time DESC
    `, [user.id]);

    return NextResponse.json({
      success: true,
      timeEntries: result.rows
    });

  } catch (error) {
    console.error('Time entry retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve time entries'
    }, { status: 500 });
  }
}
