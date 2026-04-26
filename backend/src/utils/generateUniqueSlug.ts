import BlogPost from "../models/BlogPost";

/**
 * Generates a unique slug for a blog post based on its title.
 * If the slug already exists, appends an incremental counter (e.g., -1, -2).
 * 
 * @param title The title of the blog post
 * @param currentPostId Optional ID of the post being updated, to ignore itself during uniqueness checks
 * @returns A guaranteed unique slug string
 */
export const generateUniqueSlug = async (title: string, currentPostId?: string): Promise<string> => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove non-word except spaces & hyphens
    .trim() // remove leading/trailing spaces
    .replace(/\s+/g, "-"); // replace spaces with hyphens

  let slug = baseSlug;
  let counter = 1;
  let slugExists = true;

  while (slugExists) {
    const query: any = { slug };
    
    // If updating an existing post, exclude its own ID from the uniqueness check
    if (currentPostId) {
      query._id = { $ne: currentPostId };
    }

    const existingPost = await BlogPost.findOne(query).select('_id');
    
    if (existingPost) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      slugExists = false;
    }
  }

  return slug;
};
