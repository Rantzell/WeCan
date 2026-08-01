import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("events", {
  orderBy: "starts_at",
});
