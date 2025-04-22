import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">404 ページが見つかりません</h1>
          </div>

          <p className="mt-4 text-sm text-muted-foreground mb-6">
            お探しのページは存在しないか、移動されました。
          </p>
          
          <Link href="/">
            <Button className="w-full">
              ホームに戻る
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
