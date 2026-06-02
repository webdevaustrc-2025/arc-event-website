import { z } from "zod";

export const registrationSchema = z.object({
  segmentId: z.union([
    z.number().int("Segment ID must be an integer"),
    z.string().transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        throw new Error("Segment ID must be a valid number");
      }
      return parsed;
    }),
  ]),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
