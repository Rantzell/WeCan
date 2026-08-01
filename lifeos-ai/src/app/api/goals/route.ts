import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("goals", {
  orderBy: "created_at",
});
