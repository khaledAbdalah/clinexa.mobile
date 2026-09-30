export interface ProblemReportImage {
  uri: string;
  name: string;
  type: string;
}

export interface CreateProblemReportRequest {
  title: string;
  description: string;
  images: ProblemReportImage[];
}

export interface ProblemReport {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}
