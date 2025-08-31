import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjectsWithTimeSummary } from '@/lib/services/projectService';
import { getUserByFirebaseUid } from '@/lib/services/userService';

export async function POST(request: NextRequest) {
  try {
    const { name, description, color } = await request.json();
    
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

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Project name is required'
      }, { status: 400 });
    }

    // Create the project
    const newProject = await createProject({
      user_id: user.id,
      name,
      description,
      color
    });

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Project created successfully'
    });

  } catch (error) {
    console.error('Project creation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create project'
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

    // Get projects for the user with time summary
    const projects = await getProjectsWithTimeSummary(user.id);

    return NextResponse.json({
      success: true,
      projects
    });

  } catch (error) {
    console.error('Project retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve projects'
    }, { status: 500 });
  }
}
