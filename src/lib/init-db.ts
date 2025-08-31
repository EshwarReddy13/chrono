import { readFileSync } from 'fs';
import { join } from 'path';
import { query, testConnection } from './database';

/**
 * Initialize the database with the schema
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    console.log('Database connection successful. Initializing schema...');
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await query(schema);
    
    console.log('Database schema initialized successfully!');
    
    // Verify tables were created
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Created tables:', tables.rows.map((row: any) => row.table_name));
    console.log('Expected: users table');
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Reset the database (drop all tables and recreate)
 * WARNING: This will delete all data!
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log('Resetting database...');
    
    // Drop all tables
    await query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('Database reset. Reinitializing schema...');
    await initializeDatabase();
    
  } catch (error) {
    console.error('Failed to reset database:', error);
    throw error;
  }
}

/**
 * Check if the database is properly initialized
 */
export async function checkDatabaseStatus(): Promise<{
  isConnected: boolean;
  tablesExist: boolean;
  tableCount: number;
}> {
  try {
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return {
        isConnected: false,
        tablesExist: false,
        tableCount: 0
      };
    }
    
    // Check if tables exist
    const tables = await query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableCount = parseInt(tables.rows[0].count);
    const tablesExist = tableCount > 0;
    
    return {
      isConnected: true,
      tablesExist,
      tableCount
    };
    
  } catch (error) {
    console.error('Error checking database status:', error);
    return {
      isConnected: false,
      tablesExist: false,
      tableCount: 0
    };
  }
}
