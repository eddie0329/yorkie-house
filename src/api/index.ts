import { AdminPromiseClient } from './admin_grpc_web_pb';
import {
  ListProjectsRequest,
  ListDocumentsRequest,
  GetProjectRequest,
  GetDocumentRequest,
  CreateProjectRequest,
} from './admin_pb';

import { Project, DocumentSummary } from './types';
import * as converter from './converter';

export * from './types';

const client = new AdminPromiseClient(`${process.env.REACT_APP_ADMIN_ADDR}`, null);

// createProject creates a new project.
export async function createProject(name: string): Promise<Project> {
  const req = new CreateProjectRequest();
  req.setName(name);
  const response = await client.createProject(req);
  return converter.fromProject(response.getProject()!);
}

// listProjects fetches projects from the admin server.
export async function listProjects(): Promise<Array<Project>> {
  const req = new ListProjectsRequest();
  const response = await client.listProjects(req);
  return converter.fromProjects(response.getProjectsList());
}

// getProject fetch project from the admin server.
export async function getProject(name: string): Promise<Project> {
  const req = new GetProjectRequest();
  req.setName(name);
  const response = await client.getProject(req);
  return converter.fromProject(response.getProject()!);
}

// listDocuments fetches documents from the admin server.
export async function listDocuments(
  projectName: string,
  previousID: string,
  pageSize: number,
  isForward: boolean,
): Promise<Array<DocumentSummary>> {
  const req = new ListDocumentsRequest();
  req.setProjectName(projectName);
  req.setPreviousId(previousID);
  req.setPageSize(pageSize);
  req.setIsForward(isForward);
  const response = await client.listDocuments(req);
  const summaries = converter.fromDocumentSummaries(response.getDocumentsList());
  if (isForward) {
    summaries.reverse();
  }
  return summaries;
}

// getDocument fetches a document of the given ID from the admin server.
export async function getDocument(projectName: string, documentKey: string): Promise<DocumentSummary> {
  const req = new GetDocumentRequest();
  req.setProjectName(projectName);
  req.setDocumentKey(documentKey);
  const response = await client.getDocument(req);

  const document = response.getDocument();
  return converter.fromDocumentSummary(document!);
}
