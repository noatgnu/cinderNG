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

export interface ProjectFileSearchResult {
  id: number;
  data: ProjectFile[];
}

export interface SearchResultDownload {
  files: ProjectFileSearchResult[];
  projects: any[];
}
