export interface ProjectFile {
  id: number;
  file: string;
  description?: string;
  file_category: string;
  file_type: string;
  hash: string;
  headline: string;
  metadata?: any;
  name: string;
  path: string[];
  project_id: number;
}
