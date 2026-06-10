import { z } from "zod";

export const pastEventSchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Must be a valid date",
    }),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

export const pastEventUpdateSchema = pastEventSchema.partial();

export type PastEventInput = z.infer<typeof pastEventSchema>;
export type PastEventUpdateInput = z.infer<typeof pastEventUpdateSchema>;
