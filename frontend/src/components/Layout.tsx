import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

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
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Exam App
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        isActive
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Spacer to prevent content under fixed header */}
      <div className="h-[64px]" />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 text-center py-4 mt-auto">
        &copy; {new Date().getFullYear()} Exam App
      </footer>
    </div>
  );
};

export default Layout;
