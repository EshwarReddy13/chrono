import { NextRequest, NextResponse } from 'next/server';
import { createTask, getTasksByUserId } from '@/lib/services/taskService';
import { getUserByFirebaseUid } from '@/lib/services/userService';

export async function POST(request: NextRequest) {
  try {
    const { project_id, name, description } = await request.json();
    
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

    if (!project_id || !name) {
      return NextResponse.json({
        success: false,
        error: 'Project ID and name are required'
      }, { status: 400 });
    }

    // Create the task
    const newTask = await createTask({
      project_id,
      name,
      description
    });

    return NextResponse.json({
      success: true,
      task: newTask,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('Task creation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create task'
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

    // Get tasks for the user
    const tasks = await getTasksByUserId(user.id);

    return NextResponse.json({
      success: true,
      tasks
    });

  } catch (error) {
    console.error('Task retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve tasks'
    }, { status: 500 });
  }
}
