import { api, buildQueryString } from "@/lib/api";
import { ProjectApiResponse, PaginatedData } from "@/types/api";

export interface GetProjectsParams {
  page?: number;
  perPage?: number;
  type?: "all" | "free" | "paid";
  search?: string;
  category?: string;
  status?: string;
  userId?: string;
  techStack?: string;
}

export interface CreateProjectInput {
  title: string;
  description: string;
  thumbnailUrl?: string;
  images?: string[];
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  type: "free" | "paid";
  price?: number;
  categoryId?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export const projectsService = {
  /**
   * Get paginated list of projects
   */
  async getProjects(params: GetProjectsParams = {}): Promise<PaginatedData<ProjectApiResponse>> {
    const queryString = buildQueryString({
      page: params.page || 1,
      perPage: params.perPage || 12,
      type: params.type !== "all" ? params.type : undefined,
      search: params.search,
      category: params.category,
      status: params.status,
      userId: params.userId,
      techStack: params.techStack,
    });
    
    const response = await api.get<PaginatedData<ProjectApiResponse>>(`/projects${queryString}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch projects");
  },

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<ProjectApiResponse> {
    const response = await api.get<ProjectApiResponse>(`/projects/${id}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to fetch project");
  },

  /**
   * Create new project
   */
  async createProject(input: CreateProjectInput): Promise<ProjectApiResponse> {
    const response = await api.post<ProjectApiResponse>("/projects", input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to create project");
  },

  /**
   * Update existing project
   */
  async updateProject(id: string, input: UpdateProjectInput): Promise<ProjectApiResponse> {
    const response = await api.put<ProjectApiResponse>(`/projects/${id}`, input);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to update project");
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    const response = await api.delete(`/projects/${id}`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to delete project");
    }
  },

  /**
   * Like/unlike project (toggle)
   */
  async likeProject(id: string): Promise<{ liked: boolean; totalLikes: number }> {
    const response = await api.post<{ liked: boolean; totalLikes: number }>(`/projects/${id}/like`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || "Failed to like project");
  },

  /**
   * Record project view
   */
  async recordView(id: string): Promise<void> {
    await api.post(`/projects/${id}/view`);
  },

  /**
   * Block project (moderator/admin only)
   */
  async blockProject(id: string, reason?: string): Promise<void> {
    const response = await api.post(`/projects/${id}/block`, { reason });
    
    if (!response.success) {
      throw new Error(response.message || "Failed to block project");
    }
  },

  /**
   * Unblock project (moderator/admin only)
   */
  async unblockProject(id: string): Promise<void> {
    const response = await api.post(`/projects/${id}/unblock`);
    
    if (!response.success) {
      throw new Error(response.message || "Failed to unblock project");
    }
  },
};
