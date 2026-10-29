export type UserRole = 'author' | 'reviewer' | 'hod' | 'admin' | 'faculty' | 'chair' | 'board';

export type PipelinePage = 'upload' | 'spec' | 'mapping' | 'checks' | 'workflow' | 'export';

export type WorkflowStage =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'pending_hod'
  | 'approved';

export type BloomsTaxonomy =
  | 'Remember'
  | 'Understand'
  | 'Apply'
  | 'Analyze'
  | 'Evaluate'
  | 'Create';

export interface CourseOutcome {
  id: string;
  code: string; // e.g. "CO1"
  shortTitle: string; // e.g. "Asymptotic Complexity"
  description: string;
  bloomsLevel: BloomsTaxonomy;
  bloomsTag: string; // e.g. "L2-Understand", "L4-Analyze", "L6-Create"
  targetWeight: number; // percentage
  assessmentMethod: string;
}

export interface ProgramOutcome {
  id: string;
  code: string; // e.g. "PO1", "PSO1"
  shortTitle: string; // e.g. "Eng.K", "Prob.A", "Design", "Cloud"
  title: string; // e.g. "Engineering Knowledge"
  description: string;
  isPSO?: boolean;
}

export interface MatrixCellMapping {
  coId: string;
  targetId: string; // PO1..PO12 or PSO1..PSO2
  level: 0 | 1 | 2 | 3; // 0: '-', 1: Slight, 2: Moderate, 3: Substantial
  justification?: string;
  evidence?: string;
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  lectureHours: number;
  labHours: number;
  topics: string[];
  coMapped: string[]; // e.g. ["CO1", "CO2"]
  labExperiments?: string[];
  readings?: string;
}

export interface AssessmentItem {
  id: string;
  component: string;
  percentage: number;
  coMappings: string[];
  description: string;
  isMandatoryToPass: boolean;
}

export interface TextbookReference {
  id: string;
  type: 'textbook' | 'reference' | 'online';
  title: string;
  authors: string;
  edition: string;
  year: number;
  publisher: string;
  isbn: string;
  isOutdated?: boolean;
  libraryAccessUrl?: string;
}

export interface UploadedArtifact {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedBy: string;
  uploadedRole: string;
  date: string;
  version: string;
  status: 'verified' | 'parsing' | 'error';
  tag: string;
}

export interface ValidationRule {
  id: string;
  code: string; // e.g. "Rule #V-101"
  category: 'hours' | 'blooms' | 'copo' | 'refs';
  categoryLabel: string;
  severity: 'passed' | 'warning' | 'error';
  title: string;
  description: string;
  impactText: string;
  remediationAction: string;
  isRemediated?: boolean;
}

export interface WorkflowComment {
  id: string;
  authorName: string;
  authorRole: string;
  avatarInitials: string;
  timestamp: string;
  text: string;
  stageTag: string;
  isActionItem?: boolean;
  isResolved?: boolean;
}

export interface CourseSpecification {
  id: string;
  code: string; // e.g. "CS301"
  title: string; // e.g. "Data Structures & Algorithms"
  department: string;
  facultySchool: string;
  academicYear: string;
  semester: string;
  level: string; // "UG-Core"
  credits: number; // 4.0
  lectureHoursPerWeek: number; // 3
  tutorialHoursPerWeek: number; // 0
  labHoursPerWeek: number; // 2
  totalContactHours: number; // 70
  totalLectureHours: number; // 42
  totalLabHours: number; // 28
  totalSemesterWeeks: number; // 14
  courseDescription: string;
  pedagogicalRationale: string;
  prerequisites: string[];
  stage: WorkflowStage;
  version: string;
  activePreset: 'obe_2024' | 'abet_cac' | 'cbcs_elective';
  outcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  matrixMappings: MatrixCellMapping[];
  units: SyllabusUnit[];
  assessmentScheme: AssessmentItem[];
  textbooks: TextbookReference[];
  uploadedArtifacts: UploadedArtifact[];
  validationRules: ValidationRule[];
  workflowComments: WorkflowComment[];
  selectedCellEvidence?: {
    coId: string;
    targetId: string;
  };
}

export interface AISettings {
  provider: 'google' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  temperature: number;
  systemPrompt: string;
}

export interface RolePermissions {
  canEditSpecification: boolean;
  canUploadSyllabus: boolean;
  canModifyMatrix: boolean;
  canRunChecks: boolean;
  canReviewAndComment: boolean;
  canApproveReviewer: boolean;
  canSignOffHOD: boolean;
  canExportOfficialSpec: boolean;
}
