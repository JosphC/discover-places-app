import { useGetPostsOnUserQuery } from "@/services/queries/posts";
import { PostCard } from "@/routes/posts/_components/post-card";
import { CreatePostDialog } from "@/routes/posts/_components/create-post-dialog";
import { useSEO } from "@/hooks/useSEO";

export const ProfileSection = () => {
  useSEO("My Profile | Spotly");

  const { data: posts, isLoading, error } = useGetPostsOnUserQuery();

  console.log("My Places - Posts data:", posts);
  console.log("My Places - First post:", posts?.[0]);
  console.log("My Places - First post tagName:", posts?.[0]?.tagName);

  if (isLoading) {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Places</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal collection of places
            </p>
          </div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="h-6 w-3/4 bg-muted rounded mb-4" />
              <div className="h-48 w-full bg-muted rounded mb-4" />
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">Error loading your places. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Places</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal collection of places
          </p>
        </div>
        <CreatePostDialog />
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg mb-4">
            You haven't added any places yet.
          </p>
          <CreatePostDialog />
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} showActions={true} />
          ))}
        </div>
      )}
    </div>
  );
};
