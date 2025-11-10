import { createBrowserRouter, Navigate } from "react-router-dom";
import { LandingRoot } from "./landing/root";
import { HomePage } from "./landing/home/page";
import { DashboardRoot } from "./dashboard/root";
import { PostsPage } from "./posts/page";
import { ProfilePage } from "./dashboard/profile/page";
import { FavoritesPage } from "./favorites/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingRoot />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: "/dashboard",
    element: <DashboardRoot />,
    children: [
      { index: true, element: <Navigate to="/dashboard/profile" replace /> },
      { path: "posts", element: <PostsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ],
  },
]);
