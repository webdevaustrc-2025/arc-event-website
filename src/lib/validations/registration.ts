import { z } from "zod";

export const registrationSchema = z.object({
  segmentId: z.coerce.number().int("Segment ID must be an integer"),
});
