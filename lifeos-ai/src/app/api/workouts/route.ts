import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("workouts", {
  orderBy: "performed_at",
});
