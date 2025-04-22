import ExperienceCard from "@/components/ExperienceCard";
import { Experience } from "@shared/schema";

interface CulturalExperiencesProps {
  experiences: Experience[];
}

export default function CulturalExperiences({ experiences }: CulturalExperiencesProps) {
  return (
    <section className="mb-16">
      <h2 className="text-xl md:text-2xl font-serif font-medium text-primary mb-6">日本の文化を体験する</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiences.map(experience => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </section>
  );
}
