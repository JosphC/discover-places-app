import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Link, useNavigate } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/services/queries/users";
import { User, Heart } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-background z-50 border-b">
      <nav className="flex items-center justify-between h-16 cs-container">
        <Link to="/dashboard/profile" className="font-bold text-3xl">
          Spotly
        </Link>
        <div className="flex items-center gap-4">
          {!isLoading && currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
              <User className="w-4 h-4" />
              <span className="font-medium text-sm">{currentUser.username}</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              className="font-medium"
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/profile")}
            >
              My Places
            </Button>

            <Button
              className="font-medium"
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/posts")}
            >
              All Places
            </Button>

            <Button
              className="font-medium"
              size="sm"
              variant="outline"
              onClick={() => navigate("/dashboard/favorites")}
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </Button>

            <Button
              className="font-medium"
              size="sm"
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
