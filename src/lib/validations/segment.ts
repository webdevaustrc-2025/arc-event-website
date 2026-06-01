import { z } from "zod";

export const segmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  rules: z.string().min(1, "Rules are required"),
  prizePool: z.string().min(1, "Prize pool is required"),
  status: z.string().default("active"),
  imageUrl: z.string().optional().nullable(),
  category: z.string().default("General"),
  deadline: z.string().default("TBA"),
  difficulty: z.string().default("Medium"),
  fee: z.string().default("TBA"),
  highlights: z.array(z.string()).default([]),
  location: z.string().default("TBA"),
  ruleBookUrl: z.string().optional().nullable(),
  scheduleText: z.string().default("TBA"),
  teamSize: z.string().default("TBA"),
  type: z.string().default("Team"),
});

export const segmentUpdateSchema = segmentSchema.partial();

export type SegmentInput = z.infer<typeof segmentSchema>;
export type SegmentUpdateInput = z.infer<typeof segmentUpdateSchema>;
