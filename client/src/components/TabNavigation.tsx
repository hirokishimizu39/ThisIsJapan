import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

const tabs = [
  "すべて",
  "言葉にであう",
  "写真を見る",
  "外国人の声",
  "日本人の声",
  "文化を学ぶ",
  "体験する"
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className="mb-8 overflow-x-auto scroll-hidden whitespace-nowrap pb-2" id="main-nav">
      <div className="inline-flex space-x-8 text-gray-500 font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "pb-1 transition-all hover:text-primary",
              activeTab === tab ? "tab-active" : ""
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}
