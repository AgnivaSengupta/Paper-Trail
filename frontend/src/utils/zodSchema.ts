import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  title: z.string().min(2, "Title too short").optional(),
  bio: z.string().max(300, "Bio must not exceed 300 characters.").optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL.")
    .optional()
    .or(z.literal("")),
  skills: z
    .array(z.string())
    .min(1, "Add at least one skill.")
    .max(10, { message: "You can only add up to 10 skills." }),
  picture: z
    .any()
    .optional()
    // Custom validation to check file type/size if a file is actually provided
    .refine((file) => {
      if (!file) return true;
      return file instanceof File ? file.size <= MAX_FILE_SIZE : true;
    }, "Max file size is 5MB.")
    .refine((file) => {
      if (!file) return true;
      return file instanceof File
        ? ACCEPTED_IMAGE_TYPES.includes(file.type)
        : true;
    }, "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;
