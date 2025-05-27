import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import UsersSection from "../layouts/UsersSection";
import Navbar from "../layouts/Navbar";

function HomePage() {
  return (
    <div className="min-h-screen mb-20 md:mb-0">
      {/* Main Header */}
      <Header />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 w-full container mx-auto items-start gap-4 px-4 md:px-6">
        {/* Left Navigation - Only visible on medium screens and up */}
        <nav
          className="hidden md:block col-span-2 lg:col-span-3 bg-secondary-light p-5 shadow sticky top-18"
          aria-label="Main Navigation"
        >
          <Navbar />
        </nav>

        {/* Middle Section (Main Content) */}
        <main
          className="col-span-12 md:col-span-10 lg:col-span-6 pb-5"
          role="main"
        >
          <Outlet /> {/* Nested routes (e.g., timeline, post) rendered here */}
        </main>

        {/* Right Sidebar - Suggested Users, visible on large screens */}
        <aside
          className="hidden lg:block col-span-4 md:col-span-3 bg-secondary-light p-5 shadow"
          aria-label="User Suggestions"
        >
          <UsersSection />
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
