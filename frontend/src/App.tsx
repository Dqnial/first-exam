import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ExamPage from "@/pages/ExamPage";
import CourseExamPage from "@/pages/CourseExamPage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="exam/random" element={<ExamPage />} />
            <Route path="exam/course/:courseId" element={<CourseExamPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
