import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("tasks", {
  orderBy: "created_at",
});
