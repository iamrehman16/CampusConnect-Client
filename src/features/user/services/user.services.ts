import type { User } from "@/shared/types/auth.types";
import type { UpdateUserDto } from "../types/user.dto";
import api from "@/shared/api/axios.instance";

export class UserService {
  async updateUser(dto: UpdateUserDto): Promise<User> {
    const { data } = await api.patch<User>("profile", { dto });
    return data;
  }
}

export const userService = new UserService();
