import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CarouselProps<T> {
  items: T[];
  activeIndex: number;
  onChange: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export default function Carousel<T>({ 
  items, 
  activeIndex, 
  onChange,
  renderItem
}: CarouselProps<T>) {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Update carousel position when activeIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.scrollWidth / items.length;
      carouselRef.current.scrollTo({
        left: slideWidth * activeIndex,
        behavior: 'smooth'
      });
    }
  }, [activeIndex, items.length]);

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // If the swipe is significant enough
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < items.length - 1) {
        // Swipe left
        onChange(activeIndex + 1);
      } else if (diff < 0 && activeIndex > 0) {
        // Swipe right
        onChange(activeIndex - 1);
      }
    }
    
    setTouchStartX(null);
  };

  return (
    <div className="relative">
      <div 
        id="carousel-container" 
        ref={carouselRef}
        className="flex overflow-x-auto scroll-hidden pb-4 -mx-2 snap-x snap-mandatory"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0 snap-start px-2"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Carousel Navigation Dots */}
      {items.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => onChange(index)}
              className={cn(
                "carousel-dot",
                activeIndex === index ? "active" : ""
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
