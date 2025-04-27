import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TabNavigation from "@/components/TabNavigation";
import FeaturedPhotos from "@/components/FeaturedPhotos";
import JapaneseWords from "@/components/JapaneseWords";
import CulturalExperiences from "@/components/CulturalExperiences";
import InvitationModal from "@/components/InvitationModal";
import { Photo, Word, Experience } from "@shared/schema";

enum ContentType {
  ALL = "すべて",
  WORDS = "言葉にであう",
  PHOTOS = "写真を見る",
  FOREIGNER_VOICES = "外国人の声",
  JAPANESE_VOICES = "日本人の声",
  LEARN_CULTURE = "文化を学ぶ",
  EXPERIENCE = "体験する",
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.ALL);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Queries for data
  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos'],
  });

  const { data: topPhotos = [] } = useQuery<Photo[]>({
    queryKey: ['/api/photos/top'],
  });

  const { data: words = [] } = useQuery<Word[]>({
    queryKey: ['/api/words/top'],
  });

  // APIがページネーション形式（results配列内）でデータを返すため型定義を修正
  interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }

  const { data: experiencesData } = useQuery<PaginatedResponse<Experience>>({
    queryKey: ['/api/experiences'],
  });
  
  // resultsから実際のExperienceの配列を取得するか、空配列をデフォルト値として使用
  const experiences = experiencesData?.results || [];

  // Show modal after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter content based on active tab
  const getFilteredContent = () => {
    switch(activeTab) {
      case ContentType.PHOTOS:
        return (
          <FeaturedPhotos photos={photos} topPhotos={topPhotos} />
        );
      case ContentType.WORDS:
        return (
          <JapaneseWords words={words} />
        );
      case ContentType.EXPERIENCE:
        return (
          <CulturalExperiences experiences={experiences} />
        );
      case ContentType.ALL:
      default:
        return (
          <>
            <FeaturedPhotos photos={photos} topPhotos={topPhotos} />
            <JapaneseWords words={words} />
            <CulturalExperiences experiences={experiences} />
          </>
        );
    }
  };

  return (
    <main className="container mx-auto px-4 md:px-8 py-6 md:py-10 flex-grow">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {getFilteredContent()}
      
      {showModal && (
        <InvitationModal onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}
