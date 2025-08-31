import { query } from '../database';

export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  timezone: string;
  time_format: string;
  theme: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  firebase_uid: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  timezone?: string;
  time_format?: string;
  theme?: string;
}

export interface UpdateUserData {
  display_name?: string;
  avatar_url?: string;
  timezone?: string;
  time_format?: string;
  theme?: string;
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  const result = await query(`
    INSERT INTO users (
      firebase_uid, 
      email, 
      display_name, 
      avatar_url, 
      timezone, 
      time_format, 
      theme
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    ON CONFLICT ON CONSTRAINT users_firebase_uid_key
    DO UPDATE SET
      email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `, [
    userData.firebase_uid,
    userData.email,
    userData.display_name || null,
    userData.avatar_url || null,
    userData.timezone || 'UTC',
    userData.time_format || '24h',
    userData.theme || 'dark'
  ]);

  return result.rows[0];
}

/**
 * Get user by Firebase UID
 */
export async function getUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
  const result = await query(`
    SELECT * FROM users WHERE firebase_uid = $1
  `, [firebaseUid]);

  return result.rows[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  const result = await query(`
    SELECT * FROM users WHERE id = $1
  `, [id]);

  return result.rows[0] || null;
}

/**
 * Update user
 */
export async function updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  if (userData.display_name !== undefined) {
    fields.push(`display_name = $${paramCount++}`);
    values.push(userData.display_name);
  }
  if (userData.avatar_url !== undefined) {
    fields.push(`avatar_url = $${paramCount++}`);
    values.push(userData.avatar_url);
  }
  if (userData.timezone !== undefined) {
    fields.push(`timezone = $${paramCount++}`);
    values.push(userData.timezone);
  }
  if (userData.time_format !== undefined) {
    fields.push(`time_format = $${paramCount++}`);
    values.push(userData.time_format);
  }
  if (userData.theme !== undefined) {
    fields.push(`theme = $${paramCount++}`);
    values.push(userData.theme);
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);
  const result = await query(`
    UPDATE users 
    SET ${fields.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *
  `, values);

  return result.rows[0] || null;
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    await query('DELETE FROM users WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}
