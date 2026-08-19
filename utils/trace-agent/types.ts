export interface ConsoleEntry {
  type: string;
  text: string;
}

export interface NetworkEntry {
  url: string;
  method: string;
  status: number;
  statusText?: string;
  responseBody?: string;
}

export interface ActionStep {
  apiName: string;
  error?: string;
}

export interface ExtractedTraceData {
  testTitle: string;
  testFile: string;
  errorMessage: string;
  consoleErrors: ConsoleEntry[];
  failedNetworkCalls: NetworkEntry[];
  actionLog: ActionStep[];
}

export type FailureCategory = 'PRODUCT_BUG' | 'AUTOMATION_BUG' | 'ENVIRONMENT_FLAKE';

export interface TriageResult {
  category: FailureCategory;
  confidence: number;
  summary: string;
  reasoning: string;
  suggestedFix?: string;
  relevantEvidence: string[];
}
