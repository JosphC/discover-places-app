import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostFormSchema, TCreatePostFormSchema } from "@/schemas/post-schema";
import { useCreatePostMutation } from "@/services/mutations/posts";
import { useGetTagsQuery } from "@/services/queries/tags";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

type CreatePostFormProps = {
  onSuccess: () => void;
};

export const CreatePostForm = ({ onSuccess }: CreatePostFormProps) => {
  const { token } = useAuthStore();
  const createPostMutation = useCreatePostMutation();
  const { data: tags } = useGetTagsQuery();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<TCreatePostFormSchema>({
    resolver: zodResolver(CreatePostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "",
      tagId: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsGettingLocation(false);
        toast.success("Location captured successfully!");
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error("Failed to get location. Please try again.");
        console.error("Geolocation error:", error);
      }
    );
  };

  const onSubmit = async (data: TCreatePostFormSchema) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("status", data.status);
      formData.append("tagId", data.tagId);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (latitude !== null && longitude !== null) {
        formData.append("latitude", latitude.toString());
        formData.append("longitude", longitude.toString());
      }

      await createPostMutation.mutateAsync({
        formData,
        token,
      });

      toast.success("Place created successfully!");
      form.reset();
      setSelectedFile(null);
      setImagePreview(null);
      setLatitude(null);
      setLongitude(null);
      onSuccess();
    } catch (error) {
      toast.error("Failed to create place. Please try again.");
      console.error("Create post error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter place title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Description)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe this place..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NATURA">NATURA</SelectItem>
                  <SelectItem value="URBAN">URBAN</SelectItem>
                  <SelectItem value="RURAL">RURAL</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tags?.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id.toString()}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Image (optional)</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <FormLabel>Location (optional)</FormLabel>
          <div className="mt-2 space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isGettingLocation
                ? "Getting location..."
                : latitude && longitude
                ? "Update Location"
                : "Get Current Location"}
            </Button>
            {latitude && longitude && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                <p className="font-medium mb-1">Location captured:</p>
                <p>Latitude: {latitude.toFixed(6)}</p>
                <p>Longitude: {longitude.toFixed(6)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Creating..." : "Create Place"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
