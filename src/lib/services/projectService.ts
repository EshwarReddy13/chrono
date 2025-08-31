import { query } from '../database';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectData {
  user_id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  is_active?: boolean;
}

/**
 * Create a new project
 */
export async function createProject(projectData: CreateProjectData): Promise<Project> {
  const result = await query(`
    INSERT INTO projects (
      user_id,
      name,
      description,
      color
    ) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *
  `, [
    projectData.user_id,
    projectData.name,
    projectData.description || null,
    projectData.color || '#F4D03F'
  ]);

  return result.rows[0] as Project;
}

/**
 * Get projects by user ID
 */
export async function getProjectsByUserId(userId: string): Promise<Project[]> {
  const result = await query(`
    SELECT * FROM projects 
    WHERE user_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `, [userId]);

  return result.rows as Project[];
}

/**
 * Get project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const result = await query(`
    SELECT * FROM projects WHERE id = $1
  `, [id]);

  return (result.rows[0] as Project) || null;
}

/**
 * Update project
 */
export async function updateProject(id: string, projectData: UpdateProjectData): Promise<Project | null> {
  const fields = [];
  const values = [];
  let paramCount = 1;

  // Build dynamic update query
  if (projectData.name !== undefined) {
    fields.push(`name = $${paramCount++}`);
    values.push(projectData.name);
  }
  if (projectData.description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(projectData.description);
  }
  if (projectData.color !== undefined) {
    fields.push(`color = $${paramCount++}`);
    values.push(projectData.color);
  }
  if (projectData.is_active !== undefined) {
    fields.push(`is_active = $${paramCount++}`);
    values.push(projectData.is_active);
  }

  if (fields.length === 0) {
    return getProjectById(id);
  }

  values.push(id);
  const result = await query(`
    UPDATE projects 
    SET ${fields.join(', ')} 
    WHERE id = $${paramCount} 
    RETURNING *
  `, values);

  return (result.rows[0] as Project) || null;
}

/**
 * Delete project (soft delete by setting is_active to false)
 */
export async function deleteProject(id: string): Promise<boolean> {
  try {
    await query('UPDATE projects SET is_active = false WHERE id = $1', [id]);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

/**
 * Get project with time entries summary
 */
export async function getProjectWithTimeSummary(projectId: string): Promise<Project & { total_time_seconds: number; total_entries: number } | null> {
  const result = await query(`
    SELECT 
      p.*,
      COALESCE(SUM(CASE WHEN te.end_time IS NOT NULL THEN te.duration_seconds ELSE 0 END), 0) as total_time_seconds,
      COUNT(te.id) as total_entries
    FROM projects p
    LEFT JOIN time_entries te ON p.id = te.project_id
    WHERE p.id = $1
    GROUP BY p.id
  `, [projectId]);

  return (result.rows[0] as Project & { total_time_seconds: number; total_entries: number }) || null;
}

/**
 * Get projects with time summary for a user
 */
export async function getProjectsWithTimeSummary(userId: string): Promise<(Project & { total_time_seconds: number; total_entries: number })[]> {
  const result = await query(`
    SELECT 
      p.*,
      COALESCE(SUM(CASE WHEN te.end_time IS NOT NULL THEN te.duration_seconds ELSE 0 END), 0) as total_time_seconds,
      COUNT(te.id) as total_entries
    FROM projects p
    LEFT JOIN time_entries te ON p.id = te.project_id
    WHERE p.user_id = $1 AND p.is_active = true
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `, [userId]);

  return result.rows as (Project & { total_time_seconds: number; total_entries: number })[];
}
