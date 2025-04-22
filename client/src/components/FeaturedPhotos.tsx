import { useState } from "react";
import PhotoCard from "@/components/PhotoCard";
import Carousel from "@/components/Carousel";
import { Photo } from "@shared/schema";

interface FeaturedPhotosProps {
  photos: Photo[];
  topPhotos: Photo[];
}

export default function FeaturedPhotos({ photos, topPhotos }: FeaturedPhotosProps) {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  // Get top photo and the rest for the carousel
  const topPhoto = topPhotos.length > 0 ? topPhotos[0] : null;
  const carouselPhotos = topPhotos.slice(1);

  // Group carousel photos into sets of 3 for pagination
  const photoGroups = [];
  for (let i = 0; i < carouselPhotos.length; i += 3) {
    photoGroups.push(carouselPhotos.slice(i, i + 3));
  }

  return (
    <section className="mb-16">
      <h2 className="text-xl md:text-2xl font-serif font-medium text-primary mb-6">美しい日本の写真</h2>
      
      {/* Featured Top Photo */}
      {topPhoto && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="relative">
            <img 
              src={topPhoto.imageUrl}
              alt={topPhoto.title} 
              className="w-full h-[300px] md:h-[500px] object-cover"
            />
            <div className="absolute top-4 left-4 bg-accent text-white rounded-full px-3 py-1 text-sm font-medium">
              1位
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{topPhoto.title}</h3>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-500 text-sm">{topPhoto.likes}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm">{topPhoto.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500">@{topPhoto.userId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Carousel for Ranked Photos */}
      {photoGroups.length > 0 && (
        <Carousel
          items={photoGroups}
          activeIndex={activeCarouselIndex}
          onChange={setActiveCarouselIndex}
          renderItem={(group, _) => (
            <div className="flex flex-col md:flex-row gap-4">
              {group.map((photo, photoIndex) => (
                <div key={photo.id} className="w-full md:w-1/3">
                  <PhotoCard 
                    photo={photo} 
                    rank={photoIndex + 1 + activeCarouselIndex * 3 + 1} // +1 because index starts at 0, and another +1 because the top photo is not in the carousel
                  />
                </div>
              ))}
            </div>
          )}
        />
      )}
    </section>
  );
}
