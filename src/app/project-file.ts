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
  found_terms: string[];
  found_lines: number[];
  found_line_term_map: { [key: number]: string[] };
  analysis: {[key: string]: Analysis};
}

export interface SearchResultDownload {
  files: ProjectFileSearchResult[];
  projects: ProjectSearchResult[];
}

export interface ProjectSearchResult {
  id: number;
  data: Project;
}

export interface Project {
  id: number
  name: string
  description: string
  hash: string
  metadata: any
  global_id: string
  headline: string
}

export interface Analysis {
  comparison_matrix: ComparisonMatrix[];
  differential_analysis: {[key: string]: any};
  sample_annotation: any;
  searched_file: any;
}

export interface ComparisonMatrix {
  "Condition A": string;
  "Condition B": string;
  "Fold Change Column": string;
  "Significance column": string;
}
