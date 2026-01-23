import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import TagInput from "./TagInput";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Edit2 } from "lucide-react";
import { ProfileSchema } from "@/utils/zodSchema";
import type { ProfileFormValues } from "@/utils/zodSchema";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import { uploadImageToR2 } from "@/utils/r2-upload";

export function ProfileUpdateForm() {
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      location: "",
      website: "",
      skills: [],
      picture: undefined,
    },
  });

  // const [skills, setSkills] = useState<string[]>([]);

  const onSubmit = async (values: ProfileFormValues) => {
    // console.log(values);
    try {

      let finalPicUrl = values.picture;
      // console.log(values.picture)
      if (values.picture instanceof File){
        console.log("New image detected.Uploading to R2...");
        
        finalPicUrl = await uploadImageToR2(values.picture, (event) => {
          console.log(`Upload progress: ${event.progress}%`)
        })
        console.log("Upload complete. URL:", finalPicUrl);
      }

      const payload = {
        name: values.name,
        title: values.title,
        bio: values.bio,
        location: values.location,
        website: values.website,
        skills: values.skills, 
        picture: finalPicUrl, 
      };

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE, payload, {
        withCredentials: true
      })
      // console.log([...formData])
    } catch (error) {
      console.log("Error while profile updation: ", error);
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl(url);

  //     onChange(file)
  //   }
  // };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldLegend variant="legend">Edit Profile</FieldLegend>
          {/*<div className=" flex flex-row justify-center item-center w-full">

            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] overflow-hidden bg-zinc-800">
                <img
                  src={
                    previewUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt="Felix"
                  className="w-full h-full object-cover"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => triggerFileInput()}
                    className="absolute bottom-1 right-1 cursor-pointer bg-emerald-500 text-white p-1.5 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] opacity-80 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <Edit2 size={12} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground text-black">
                  <p>Change image</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>*/}

          <Controller
            control={form.control}
            name="picture"
            render={({
              field: { value, onChange, ...fieldProps },
              fieldState,
            }) => (
              <div className="flex flex-col items-center w-full mb-3">
                <div className="relative group">
                  {/* The Avatar Preview UI */}
                  <div className="w-32 h-32 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] overflow-hidden bg-zinc-800">
                    <img
                      src={
                        previewUrl ||
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* The Trigger Button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 cursor-pointer bg-emerald-500 text-white p-1.5 rounded-full border-4 border-zinc-50 dark:border-[#0f1014] opacity-80 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Edit2 size={12} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-black">
                      <p>Change image</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* The Hidden Input */}
                <input
                  {...fieldProps} // Pass 'name', 'onBlur', 'ref' (if needed)
                  type="file"
                  ref={fileInputRef} // We keep our own ref to trigger click
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      // 1. Update visual preview (Local UI concern)
                      setPreviewUrl(URL.createObjectURL(file));
                      // 2. Update Form State (RHF/Zod concern)
                      onChange(file);
                    }
                  }}
                />

                {/* Validation Errors */}
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="mt-2 text-center"
                  />
                )}
              </div>
            )}
          />

          <FieldSet>
            <FieldGroup className="flex flex-row">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <label htmlFor="name">Name</label>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="name"
                      placeholder="Your name"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      {...field}
                      id="title"
                      placeholder="Your designation"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup>
              <Controller
                name="bio"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea
                      {...field}
                      id="bio"
                      placeholder="Your bio"
                      className="resize-none h-24 overflow-y-auto"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldGroup className="flex flex-row">
              {/*<Field>
                <label htmlFor="location">Title</label>
                <Input id="location" placeholder="Your location" />
              </Field>
              */}
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      {...field}
                      id="location"
                      placeholder="San Francisco, CA"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/*<Field>
                <label htmlFor="website">Website / Links</label>
                <Input id="website" placeholder="Your website / link" />
              </Field>*/}

              <Controller
                name="website"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full">
                    <label htmlFor="website" className="text-sm font-medium">
                      Website
                    </label>
                    <Input
                      {...field}
                      id="website"
                      placeholder="https://example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet className="gap-1">
            <label>Skills</label>
            <Controller
              name="skills"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <TagInput
                    tags={field.value} // Bind current array from form
                    onAddTag={(tag: string) =>
                      field.onChange([...field.value, tag])
                    } // Append new tag
                    onRemoveTag={(tag: string) =>
                      field.onChange(field.value.filter((t) => t !== tag))
                    } // Remove tag
                    className="h-10"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldSet>

          <Field orientation="horizontal" className="justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
