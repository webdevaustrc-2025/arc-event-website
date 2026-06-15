import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().min(1, "Name is required"),
  team: z.string().min(1, "Team is required"),
  quote: z.string().min(1, "Quote is required"),
  displayOrder: z.coerce.number().int().default(0),
});

export const reviewUpdateSchema = reviewSchema.partial();

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
