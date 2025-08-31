import { NextRequest, NextResponse } from 'next/server';
import { getUserByFirebaseUid } from '@/lib/services/userService';
import { query } from '@/lib/database';

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

    // Get time entries for the project, ensuring the project belongs to the user
    const result = await query(`
      SELECT 
        te.id,
        te.project_id,
        te.start_time,
        te.end_time,
        te.duration_seconds,
        te.description,
        te.created_at
      FROM time_entries te
      JOIN projects p ON te.project_id = p.id
      WHERE te.project_id = $1 AND p.user_id = $2
      ORDER BY te.start_time DESC
      LIMIT 50
    `, [id, user.id]);

    return NextResponse.json({
      success: true,
      timeEntries: result.rows
    });

  } catch (error) {
    console.error('Time entries retrieval failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to retrieve time entries'
    }, { status: 500 });
  }
}
