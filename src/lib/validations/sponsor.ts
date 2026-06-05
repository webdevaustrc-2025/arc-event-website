import { z } from "zod";

export const sponsorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().url("Must be a valid URL"),
  tier: z.enum(["gold", "silver", "bronze"]),
  websiteUrl: z.string().url("Must be a valid URL").optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
});

export const sponsorUpdateSchema = sponsorSchema.partial();

export type SponsorInput = z.infer<typeof sponsorSchema>;
export type SponsorUpdateInput = z.infer<typeof sponsorUpdateSchema>;