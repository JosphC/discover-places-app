import { useState, useMemo } from "react";
import { useGetAllPostsQuery } from "@/services/queries/posts";
import { useGetTagsQuery } from "@/services/queries/tags";
import { PostCard } from "./post-card";
import { PostsMap } from "./posts-map";
import { CreatePostDialog } from "./create-post-dialog";
import { useSEO } from "@/hooks/useSEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

export const PostsSection = () => {
  useSEO("All Places | Spotly");

  const { data: posts, isLoading, error } = useGetAllPostsQuery();
  const { data: tags } = useGetTagsQuery();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  console.log("Available tags:", tags);
  console.log("Selected tag:", selectedTag);

  // Filter posts based on selected filters and search query
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    console.log("Filtering posts:", {
      totalPosts: posts.length,
      selectedStatus,
      selectedTag,
      searchQuery,
      samplePost: posts[0]
    });

    const filtered = posts.filter((post) => {
      // Normalize status - remove "PostStatus." prefix if present
      const normalizedPostStatus = post.status.replace("PostStatus.", "");
      const statusMatch = selectedStatus === "all" || normalizedPostStatus === selectedStatus;

      // Handle tag matching with case-insensitive comparison
      let tagMatch = false;
      if (selectedTag === "all") {
        tagMatch = true;
      } else if (selectedTag === "no-tag") {
        tagMatch = !post.tagName;
      } else if (post.tagName) {
        // Case-insensitive comparison and trim whitespace
        const postTagLower = post.tagName.toLowerCase().trim();
        const selectedTagLower = selectedTag.toLowerCase().trim();
        tagMatch = postTagLower === selectedTagLower;
      }

      const searchMatch = searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase());

      // Debug logging for tag filter
      if (selectedTag !== "all") {
        console.log(`Post "${post.title}": tagName="${post.tagName}", selectedTag="${selectedTag}", tagMatch=${tagMatch}`);
      }

      return statusMatch && tagMatch && searchMatch;
    });

    console.log("Filtered results:", filtered.length);
    return filtered;
  }, [posts, selectedStatus, selectedTag, searchQuery]);

  const handleClearFilters = () => {
    setSelectedStatus("all");
    setSelectedTag("all");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedStatus !== "all" || selectedTag !== "all" || searchQuery !== "";

  if (isLoading) {
    return (
      <div className="cs-container py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">All Places</h1>
            <p className="text-muted-foreground mt-1">
              Explore places from all users
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
        <p className="text-red-500">Error loading places. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="cs-container py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Places</h1>
          <p className="text-muted-foreground mt-1">
            Explore places from all users
          </p>
        </div>
        <CreatePostDialog />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, content, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">
              Filter by Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="NATURA">NATURA</SelectItem>
                <SelectItem value="URBAN">URBAN</SelectItem>
                <SelectItem value="RURAL">RURAL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">
              Filter by Tag
            </label>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="no-tag">No Tag</SelectItem>
                {tags?.map((tag) => (
                  <SelectItem key={tag.id} value={tag.name}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts?.length || 0} places
          </div>
        )}
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg mb-4">
            No places yet. Be the first to create one!
          </p>
          <CreatePostDialog />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg mb-4">
            No places match your filters.
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Map Section */}
          <div className="mb-8">
            <PostsMap posts={filteredPosts} />
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
