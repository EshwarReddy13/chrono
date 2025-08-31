import { query } from '../database';

export interface Task {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskData {
  project_id: string;
  name: string;
  description?: string;
}

export interface UpdateTaskData {
  name?: string;
  description?: string;
  is_completed?: boolean;
}

/**
 * Create a new task
 */
export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const result = await query(`
    INSERT INTO tasks (
      project_id,
      name,
      description
    ) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `, [
    taskData.project_id,
    taskData.name,
    taskData.description || null
  ]);

  return result.rows[0] as Task;
}

/**
 * Get tasks by project ID
 */
export async function getTasksByProjectId(projectId: string): Promise<Task[]> {
  const result = await query(`
    SELECT * FROM tasks 
    WHERE project_id = $1
    ORDER BY created_at DESC
  `, [projectId]);

  return result.rows as Task[];
}

/**
 * Get tasks by user ID (through projects)
 */
export async function getTasksByUserId(userId: string): Promise<Task[]> {
  const result = await query(`
    SELECT t.*, p.name as project_name, p.color as project_color
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE p.user_id = $1
    ORDER BY t.created_at DESC
  `, [userId]);

  return result.rows as Task[];
}

/**
 * Get task by ID
 */
export async function getTaskById(id: string): Promise<Task | null> {
  const result = await query(`
    SELECT t.*, p.name as project_name, p.color as project_color
    FROM tasks t
    JOIN projects p ON t.project_id = p.id
    WHERE t.id = $1
  `, [id]);

  return (result.rows[0] as Task) || null;
}

/**
 * Update task
 */
export async function updateTask(id: string, taskData: UpdateTaskData): Promise<Task | null> {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  if (taskData.name !== undefined) {
    fields.push(`name = $${paramCount++}`);
    values.push(taskData.name);
  }
  if (taskData.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(taskData.description);
  }
  if (taskData.is_completed !== undefined) {
    fields.push(`is_completed = $${paramCount++}`);
    values.push(taskData.is_completed);
  }

  if (fields.length === 0) {
    return getTaskById(id);
  }

  values.push(id);
  const result = await query(`
    UPDATE tasks 
    SET ${fields.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *
  `, values);

  return (result.rows[0] as Task) || null;
}

/**
 * Delete task (soft delete by setting is_active to false)
 */
export async function deleteTask(id: string): Promise<boolean> {
  try {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

/**
 * Get task statistics for a project
 */
export async function getTaskStatsByProjectId(projectId: string): Promise<{
  total: number;
  completed: number;
  pending: number;
}> {
  const result = await query(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN is_completed = true THEN 1 END) as completed,
      COUNT(CASE WHEN is_completed = false THEN 1 END) as pending
    FROM tasks 
    WHERE project_id = $1
  `, [projectId]);

  return result.rows[0] as {
    total: number;
    completed: number;
    pending: number;
  };
}
