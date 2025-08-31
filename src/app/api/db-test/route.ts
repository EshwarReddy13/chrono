import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';
import { initializeDatabase, checkDatabaseStatus } from '@/lib/init-db';

export async function GET() {
  try {
    const status = await checkDatabaseStatus();
    
    return NextResponse.json({
      success: true,
      status,
      message: 'Database status checked successfully'
    });
  } catch (error) {
    console.error('Database status check failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check database status'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'test':
        const isConnected = await testConnection();
        return NextResponse.json({
          success: true,
          connected: isConnected,
          message: isConnected ? 'Database connection successful' : 'Database connection failed'
        });
        
      case 'init':
        await initializeDatabase();
        return NextResponse.json({
          success: true,
          message: 'Database initialized successfully'
        });
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          message: 'Please specify a valid action: test or init'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database operation failed'
    }, { status: 500 });
  }
}
