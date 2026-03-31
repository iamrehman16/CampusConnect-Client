import type {
  PaginatedResult,
  PaginationParams,
} from "@/shared/types/api.types";
import type {
    Comment,
  CreateCommentDto,
  CreatePostDto,
  Post,
  UpdateCommentDto,
  UpdatePostDto,
} from "../types/community.dto";
import api from "@/shared/api/axios.instance";

const communityService = {

  async getPosts(params: PaginationParams): Promise<PaginatedResult<Post>> {
    const response = await api.get<PaginatedResult<Post>>("/posts", { params });
    return response.data;
  },

  async getCommentsByPostId(postId: string, params:PaginationParams):Promise<PaginatedResult<Comment>> {

    const response = await api.get<PaginatedResult<Comment>>(`/posts/${postId}/comments`,{params});
    return response.data;

  }, 

  async createPost(dto: CreatePostDto):Promise<Post> {
    const response = await api.post<Post>('/posts',dto);
    return response.data;
  }, 

  async updateOwnPost(postId:string, dto: UpdatePostDto):Promise<Post> {
    const response = await api.patch<Post>(`/posts/${postId}`,dto);
    return response.data;
  }, 

  

  async deleteOwnPost(postId: string):Promise<Post> {
    const response = await api.delete<Post>(`/posts/${postId}`);
    return response.data;
  }, 



  async createComment(postId:string, dto: CreateCommentDto):Promise<Comment> {
    const response = await api.post<Comment>(`/posts/${postId}/comments`,dto);
    return response.data;
  }, 

  async updateOwnComment(commentId:string, dto: UpdateCommentDto):Promise<Comment> {
    const response = await api.patch<Comment>(`/posts/comments/${commentId}`,dto);
    return response.data;
  }, 

  async deleteOwnComment(commentId: string):Promise<Comment> {
    const response = await api.delete<Comment>(`/posts/comments/${commentId}`);
    return response.data;
  }, 

  async toggleUpvote(postId: string):Promise<Post> {
    const response = await api.post<Post>(`/posts/${postId}/upvote`);
    return response.data;
  }, 
};

export default communityService;
