// Components
export { PageHeader, DataTable, StatCard, FormField, SelectField, TextareaField } from "./components";

// Dialogs
export { CreateEditDialog, ConfirmDialog } from "./dialogs";

// Hooks
export { useAdminData, useAdminDialog } from "./hooks";

// Skeletons
export { TableSkeleton, CardSkeleton } from "./skeletons";

// Utilities
export { adminFetch, adminGet, adminPost, adminPut, adminPatch, adminDelete } from "./utils/adminFetch";
export { requireAdmin, adminSuccess, adminError } from "./utils/requireAdmin";

// Types
export type { AdminApiResponse, PaginatedResponse, ActionState, DialogState, TableState, TableColumn, AdminUser, Segment, PaginationParams } from "./types/admin";
