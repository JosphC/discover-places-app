import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from "@/types/types";
import { ENV } from "@/config/env";
import { format } from "date-fns";
import { ReviewForm } from "./reviews/review-form";
import { ReviewsList } from "./reviews/reviews-list";
import { FavoriteButton } from "./favorites/favorite-button";

type ShowPostDialogProps = {
  post: Post;
};

export const ShowPostDialog = ({ post }: ShowPostDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm font-medium">
          Read more →
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-base">{post.username}</p>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    try {
                      const date = new Date(post.createdAt);
                      return !isNaN(date.getTime()) ? format(date, "PPpp") : "Recently";
                    } catch {
                      return "Recently";
                    }
                  })()}
                </p>
              </div>
            </div>
            <FavoriteButton postId={post.id} variant="icon" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {post.status.replace('PostStatus.', '')}
            </span>
            {post.tagName && (
              <span className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                #{post.tagName}
              </span>
            )}
          </div>

          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={`${ENV.UPLOADS_URL}/${post.image}`}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground leading-relaxed">{post.content}</p>
          </div>

          {post.updatedAt && new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime() && (
            <p className="text-xs text-muted-foreground italic border-t pt-3">
              Last edited: {format(new Date(post.updatedAt), "PPpp")}
            </p>
          )}

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="write-review">Write Review</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews" className="space-y-4 mt-4">
              <ReviewsList postId={post.id} />
            </TabsContent>
            <TabsContent value="write-review" className="space-y-4 mt-4">
              <ReviewForm postId={post.id} onSuccess={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
