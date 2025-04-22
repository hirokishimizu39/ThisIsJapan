import { apiRequest } from "@/lib/queryClient";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Photo } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface PhotoCardProps {
  photo: Photo;
  rank: number;
}

export default function PhotoCard({ photo, rank }: PhotoCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      await apiRequest("POST", `/api/photos/${photo.id}/like`);
      // Invalidate the queries that contain this photo
      queryClient.invalidateQueries({ queryKey: ['/api/photos'] });
      queryClient.invalidateQueries({ queryKey: ['/api/photos/top'] });
      
      toast({
        title: "いいね！",
        description: "写真にいいねしました。",
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="relative">
        <img 
          src={photo.imageUrl}
          alt={photo.title} 
          className="w-full h-[200px] object-cover"
        />
        <div className="absolute top-3 left-3 bg-accent text-white rounded-full px-2 py-0.5 text-xs font-medium">
          {rank}位
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">{photo.title}</h3>
          <button 
            className="flex items-center space-x-1 group"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart className="h-4 w-4 text-accent group-hover:fill-accent" />
            <span className="text-gray-500 text-xs">{photo.likes}</span>
          </button>
        </div>
        {photo.description && (
          <p className="text-gray-500 text-xs mt-1">{photo.description}</p>
        )}
      </div>
    </div>
  );
}
