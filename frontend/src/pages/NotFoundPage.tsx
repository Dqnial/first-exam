import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground p-4">
      <Card className="max-w-md w-full border border-border bg-card shadow-md">
        <CardContent className="space-y-4">
          <CardTitle className="text-4xl font-bold text-center">404</CardTitle>
          <p className="text-center text-base text-muted-foreground">
            Oops! The page you are looking for does not exist.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/")} variant="default">
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
