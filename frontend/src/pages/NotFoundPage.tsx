import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full text-center border-gray-200">
        <CardContent>
          <CardTitle className="text-3xl font-bold mb-2">404</CardTitle>
          <p className="text-lg mb-4">
            Oops! The page you are looking for does not exist.
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </CardContent>
      </Card>
    </div>
  );
}
