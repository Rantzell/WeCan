import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("habits", {
  orderBy: "created_at",
});
