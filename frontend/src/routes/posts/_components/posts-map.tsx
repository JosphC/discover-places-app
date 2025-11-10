import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Post } from "@/types/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type PostsMapProps = {
  posts: Post[];
};

// Component to fit bounds when posts change
function MapBounds({ posts }: { posts: Post[] }) {
  const map = useMap();

  useEffect(() => {
    const validPosts = posts.filter((p) => p.latitude && p.longitude);

    if (validPosts.length > 0) {
      const bounds = L.latLngBounds(
        validPosts.map((p) => [p.latitude!, p.longitude!])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [posts, map]);

  return null;
}

export const PostsMap = ({ posts }: PostsMapProps) => {
  const postsWithLocation = posts.filter(
    (post) => post.latitude !== null && post.longitude !== null
  );

  console.log(`Total posts: ${posts.length}, Posts with location: ${postsWithLocation.length}`);
  console.log("Posts with location data:", postsWithLocation.map(p => ({
    id: p.id,
    title: p.title,
    lat: p.latitude,
    lng: p.longitude
  })));

  if (postsWithLocation.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          No places with location data yet. Add locations to your places to see
          them on the map!
        </p>
      </div>
    );
  }

  // Apply small random offset to posts with identical coordinates
  const postsWithAdjustedLocation = postsWithLocation.map((post, index) => {
    // Check if there are other posts with the same coordinates
    const duplicates = postsWithLocation.filter(
      (p) => p.latitude === post.latitude && p.longitude === post.longitude
    );

    if (duplicates.length > 1) {
      // Find the index of this post among duplicates
      const duplicateIndex = duplicates.findIndex((p) => p.id === post.id);
      // Apply a small offset (about 0.0001 degrees ≈ 11 meters)
      const offset = duplicateIndex * 0.0001;
      const angle = (duplicateIndex * 360) / duplicates.length;
      const latOffset = offset * Math.cos((angle * Math.PI) / 180);
      const lngOffset = offset * Math.sin((angle * Math.PI) / 180);

      return {
        ...post,
        adjustedLat: post.latitude! + latOffset,
        adjustedLng: post.longitude! + lngOffset,
      };
    }

    return {
      ...post,
      adjustedLat: post.latitude!,
      adjustedLng: post.longitude!,
    };
  });

  // Calculate center based on all markers
  const center: [number, number] =
    postsWithLocation.length > 0
      ? [postsWithLocation[0].latitude!, postsWithLocation[0].longitude!]
      : [0, 0];

  return (
    <div className="bg-card border rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="h-[500px] w-full z-0"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds posts={postsWithLocation} />
        {postsWithAdjustedLocation.map((post) => (
          <Marker key={post.id} position={[post.adjustedLat, post.adjustedLng]}>
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-base mb-1">{post.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  by {post.username}
                </p>
                <div className="flex gap-1 mb-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                    {post.status.replace("PostStatus.", "")}
                  </span>
                  {post.tagName && (
                    <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                      #{post.tagName}
                    </span>
                  )}
                </div>
                <p className="text-sm line-clamp-2">{post.content}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
