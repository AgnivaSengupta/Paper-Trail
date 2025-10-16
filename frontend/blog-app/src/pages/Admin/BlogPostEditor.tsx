import { Button } from "@/components/ui/button";
import Test from "./Test";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import useEditorStore from "@/store/tempStore";
import { Upload } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const BlogPostEditor = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  // const [editorJson, setEditorJson] = useState({})
  // const [editorHtml, setEditorHtml] = useState("")

  const json = useEditorStore((state) => state.json);
  const html = useEditorStore((state) => state.html);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      content: {
        json: json,
        html: html,
      },
      coverImageUrl,
      tags: tags.split(",").map((tag) => tag.trim()),
      isDraft: false,
      generatedByAi: false,
    };

    console.log(payload);

    const response = await axiosInstance.post(
      API_PATHS.POST.CREATE_POST,
      payload,
    );
    console.log(response);
    notify("publish");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      content: {
        json: json,
        html: html,
      },
      coverImageUrl,
      tags: tags.split(",").map((tag) => tag.trim()),
      isDraft: true,
      generatedByAI: false,
    };

    const response = await axiosInstance.post(
      API_PATHS.POST.CREATE_POST,
      payload,
    );
    console.log(response);
    notify("draft");
  };

  const notify = (prop: string) => {
    if (prop == "publish") {
      toast.success("Published!", {
        duration: 2000,
        position: "bottom-right",

        className: "text-sm w-[200px] mx-15 mb-5",
      });
    } else {
      toast.success("Saved as Draft!", {
        duration: 2000,
        position: "bottom-right",

        className: "text-sm w-[200px] mx-15 mb-5",
      });
    }
  };

  const setContent = useEditorStore((state) => state.setContent);

  return (
    <Test>
      <div className="w-full flex gap-5">
        <div className="w-[70%]">
          <SimpleEditor
            onChange={(json, html) => {
              setContent(html, json);
            }}
          />
        </div>

        <div className="w-[30%] max-h-[480px] flex items-center flex-col">
          <Card className="w-[80%] h-auto max-w-sm bg-card text-card-foreground border-accent">
            <CardHeader>
              <CardTitle className="text-lg">Blog details</CardTitle>
              <CardDescription>Enter the blog details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="fileUpload"
                      className="text-base text-foreground"
                    >
                      Cover Image
                    </Label>
                    <div
                      id="fileUpload"
                      className="border-1 border-dashed min-h-[100px] flex justify-center items-center rounded-lg hover:border-ring"
                    >
                      <Label
                        htmlFor="coverImage"
                        className="text-sm text-foreground cursor-pointer flex items-center gap-5"
                      >
                        <Upload className="text-gray-400" />
                        <p className="text-purple-500 underline">
                          Clcik to upload
                        </p>
                      </Label>
                      <Input id="coverImage" type="file" className="hidden" />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="title"
                      className="text-base text-foreground"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="tags" className="text-base text-foreground">
                      Related tags
                    </Label>
                    <Input
                      id="tags"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                Publish
              </Button>
              <div className="w-full flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-2/5 bg-background text-accent-foreground border-1 border-accent hover:bg-accent cursor-pointer">
                      Delete
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure about this?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the blog.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground w-2/5 cursor-pointer"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Toaster />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Test>
  );
};

export default BlogPostEditor;
