import { NextRequest, NextResponse } from 'next/server';
import { getTaskById, updateTask, deleteTask } from '@/lib/services/taskService';
import { getUserByFirebaseUid } from '@/lib/services/userService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Get the task
    const task = await getTaskById(id);
    if (!task) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Check if the task belongs to the user
    if (task.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to task'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      task
    });

  } catch (error) {
    console.error('Task retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve task'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, is_completed } = await request.json();
    
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

    // Get the task to check ownership
    const existingTask = await getTaskById(id);
    if (!existingTask) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Check if the task belongs to the user
    if (existingTask.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to task'
      }, { status: 403 });
    }

    // Update the task
    const updatedTask = await updateTask(id, {
      name,
      description,
      is_completed
    });

    if (!updatedTask) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update task'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      task: updatedTask,
      message: 'Task updated successfully'
    });

  } catch (error) {
    console.error('Task update failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update task'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // Get the task to check ownership
    const existingTask = await getTaskById(id);
    if (!existingTask) {
      return NextResponse.json({
        success: false,
        error: 'Task not found'
      }, { status: 404 });
    }

    // Check if the task belongs to the user
    if (existingTask.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to task'
      }, { status: 403 });
    }

    // Delete the task (soft delete)
    const success = await deleteTask(id);
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete task'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Task deletion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to delete task'
    }, { status: 500 });
  }
}
