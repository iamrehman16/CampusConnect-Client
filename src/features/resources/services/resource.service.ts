// resource/services/resource.service.ts
import type {
  CreateResourceDto,
  UpdateResourceDto,
  Resource,
  ResourceFilterParams,
} from "../types/resource.dto";
import type { PaginatedResult } from "@/shared/types/api.types";
import api from "@/shared/api/axios.instance";

export class ResourceService {
  // ─── Public ───────────────────────────────────────────────────────────────

  // GET /resources — approved resources with filters
  // backend forces approvalStatus: APPROVED on this endpoint
  async getResources(
    params: ResourceFilterParams,
  ): Promise<PaginatedResult<Resource>> {
    const { data } = await api.get<PaginatedResult<Resource>>("/resources", {
      params,
    });
    return data;
  }

  // GET /resources/:id — single approved resource
  async getResourceById(id: string): Promise<Resource> {
    const { data } = await api.get<Resource>(`/resources/${id}`);
    return data;
  }

  // GET /resources/:id/download — backend returns a redirect to Cloudinary signed url
  // we hit the endpoint and let the browser follow the redirect
  async downloadResource(id: string): Promise<void> {
    const { data } = await api.get<{ url: string }>(
      `/resources/${id}/download`,
    );

    const link = document.createElement("a");
    link.href = data.url;

    // This ensures the browser triggers a "Save As" behavior
    link.setAttribute("download", "");

    // Append, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ─── Contributor ──────────────────────────────────────────────────────────

  // POST /resources — multipart/form-data upload
  // file is separate from dto per our decision, service owns FormData construction
  async createResource(dto: CreateResourceDto, file: File): Promise<Resource> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", dto.title);
    formData.append("subject", dto.subject);
    formData.append("course", dto.course);
    formData.append("semester", String(dto.semester));
    formData.append("resourceType", dto.resourceType);

    if (dto.description) formData.append("description", dto.description);
    if (dto.tags?.length) formData.append("tags", JSON.stringify(dto.tags));

    const { data } = await api.post<Resource>("/resources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  // GET /resources/my — contributor's own resources regardless of approval status
  // backend reuses findAll with uploadedBy injected from JWT, mirrors that on frontend
  async getMyResources(
    params: ResourceFilterParams,
  ): Promise<PaginatedResult<Resource>> {
    const { data } = await api.get<PaginatedResult<Resource>>("/resources/my", {
      params,
    });
    return data;
  }

  // PATCH /resources/:id — contributor updating their own resource
  // backend checks ownership, only pending resources can be updated
  async updateResource(id: string, dto: UpdateResourceDto): Promise<Resource> {
    const { data } = await api.patch<Resource>(`/resources/${id}`, dto);
    return data;
  }

  // DELETE /resources/:id — contributor deleting their own resource
  async deleteResource(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  }
}

const resourceService = new ResourceService();
export default resourceService;
