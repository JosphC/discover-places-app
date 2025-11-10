import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./_components/navbar";
import { Footer } from "@/components/footer";
import { useSEO } from "@/hooks/useSEO";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export const DashboardRoot = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  useSEO("Dashboard | Spotly");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="mt-16 bg-muted/50 flex-1">
        <section className="cs-section">
          <div className="cs-container">
            <Outlet />
          </div>
        </section>
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </div>
  );
};
