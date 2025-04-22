import { Button } from "@/components/ui/button";
import { Experience } from "@shared/schema";

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
      <img 
        src={experience.imageUrl}
        alt={experience.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium mb-2">{experience.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{experience.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-primary">{experience.location}</span>
          <Button variant="link" className="text-accent text-sm font-medium p-0">
            詳細を見る →
          </Button>
        </div>
      </div>
    </div>
  );
}
