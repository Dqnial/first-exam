import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const courses = ["Course 1", "Course 2", "Course 3"];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Prepare for Your Exam</h1>

      {/* Random Questions Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="flex flex-col items-center space-y-4">
          <CardTitle className="text-xl font-semibold text-center">
            Practice Random 60 Questions
          </CardTitle>
          <Link to="/exam/random" className="w-full">
            <Button className="w-full" variant="default">
              Start Random Exam
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="space-y-4">
          <CardTitle className="text-xl font-semibold">
            Practice by Course
          </CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course}
                to={`/exam/course/${encodeURIComponent(course)}`}
              >
                <Button className="w-full" variant="outline">
                  {course}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
