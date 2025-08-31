import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/services/projectService';
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

    // Get the project
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

    return NextResponse.json({
      success: true,
      project
    });

  } catch (error) {
    console.error('Project retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve project'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description, color, is_active } = await request.json();
    
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
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    // Check if the project belongs to the user
    if (existingProject.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to project'
      }, { status: 403 });
    }

    // Update the project
    const updatedProject = await updateProject(id, {
      name,
      description,
      color,
      is_active
    });

    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update project'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'Project updated successfully'
    });

  } catch (error) {
    console.error('Project update failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update project'
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

    // Get the project to check ownership
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }

    // Check if the project belongs to the user
    if (existingProject.user_id !== user.id) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access to project'
      }, { status: 403 });
    }

    // Delete the project (soft delete)
    const success = await deleteProject(id);
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete project'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Project deletion failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to delete project'
    }, { status: 500 });
  }
}
