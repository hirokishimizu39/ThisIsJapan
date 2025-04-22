import { apiRequest } from "@/lib/queryClient";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Word } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface WordCardProps {
  word: Word;
  rank: number;
}

export default function WordCard({ word, rank }: WordCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await apiRequest("POST", `/api/words/${word.id}/like`);
      // Invalidate the queries that contain this word
      queryClient.invalidateQueries({ queryKey: ['/api/words'] });
      queryClient.invalidateQueries({ queryKey: ['/api/words/top'] });
      
      toast({
        title: "いいね！",
        description: "言葉にいいねしました。",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "いいねできませんでした。",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
      <div className="flex items-start">
        <div className="bg-accent text-white rounded-full px-2 py-0.5 text-xs font-medium mt-1 mr-3">
          {rank}位
        </div>
        <div className="flex-1">
          <p className="font-serif mb-2">"{word.original}"</p>
          {word.translation && (
            <p className="text-gray-600 text-xs mb-1">{word.translation}</p>
          )}
          <p className="text-gray-600 text-sm mb-2">{word.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xs text-gray-500">@{word.userId}</span>
            </div>
            <button 
              className="flex items-center space-x-1 group"
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className="h-4 w-4 text-accent group-hover:fill-accent" />
              <span className="text-gray-500 text-xs">{word.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
