import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Course 1", path: "/exam/course/Course 1" },
  { name: "Course 2", path: "/exam/course/Course 2" },
  { name: "Course 3", path: "/exam/course/Course 3" },
  { name: "Random Exam", path: "/exam/random" },
];

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full border-b bg-background/80 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Exam App
          </Link>

          {/* Navigation + Theme Toggle */}
          <div className="flex items-center gap-6">
            <nav className="max-md:hidden">
              <ul className="flex space-x-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          isActive ? "bg-muted font-semibold" : "hover:bg-muted"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Theme switch */}
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="border-t text-muted-foreground text-center py-4">
        &copy; {new Date().getFullYear()} Exam App
      </footer>
    </div>
  );
};

export default Layout;
