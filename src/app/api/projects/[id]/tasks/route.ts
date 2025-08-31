import { NextRequest, NextResponse } from 'next/server';
import { getTasksByProjectId } from '@/lib/services/taskService';
import { getUserByFirebaseUid } from '@/lib/services/userService';
import { getProjectById } from '@/lib/services/projectService';

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

    // Get the project to check ownership
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    // Check if the project belongs to the user
    if (project.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to project'
      }, { status: 403 });
    }

    // Get tasks for the project
    const tasks = await getTasksByProjectId(id);

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
