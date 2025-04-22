import { Button } from "@/components/ui/button";
import WordCard from "@/components/WordCard";
import { Word } from "@shared/schema";

interface JapaneseWordsProps {
  words: Word[];
}

export default function JapaneseWords({ words }: JapaneseWordsProps) {
  // Get top word and the rest
  const topWord = words.length > 0 ? words[0] : null;
  const otherWords = words.slice(1);

  return (
    <section className="mb-16">
      <h2 className="text-xl md:text-2xl font-serif font-medium text-primary mb-6">心に響く日本の言葉</h2>
      
      {/* Top Word Card */}
      {topWord && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-6">
          <div className="flex items-start">
            <div className="bg-accent text-white rounded-full px-2 py-0.5 text-xs font-medium mt-1 mr-3">
              1位
            </div>
            <div className="flex-1">
              <p className="text-lg font-serif mb-4">"{topWord.original}"</p>
              <p className="text-gray-600 mb-4">{topWord.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">@{topWord.userId}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500 text-sm">{topWord.likes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Words List */}
      <div className="space-y-4">
        {otherWords.map((word, index) => (
          <WordCard key={word.id} word={word} rank={index + 2} />
        ))}
      </div>

      {/* View More Button */}
      <div className="text-center mt-6">
        <Button variant="outline" className="px-6 py-2 border border-primary text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
          もっと見る
        </Button>
      </div>
    </section>
  );
}
