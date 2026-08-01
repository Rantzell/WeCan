import { crudHandlers } from "@/lib/api/crud";
export const { GET, POST, PATCH, DELETE } = crudHandlers("journal_entries", {
  orderBy: "entry_date",
});
