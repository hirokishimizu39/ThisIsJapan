import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-10 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl mb-4">This is Japan</h3>
            <p className="text-indigo-200 text-sm">日本の精神性や文化的価値を共有するプラットフォーム</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">探索</h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><Link href="#" className="hover:text-white transition-colors">言葉にであう</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">写真を見る</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">外国人の声</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">日本人の声</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">文化を学ぶ</h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><Link href="#" className="hover:text-white transition-colors">日本の伝統</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">礼儀と作法</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">四季と自然</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">食文化</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">サイトについて</h4>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><Link href="#" className="hover:text-white transition-colors">私たちについて</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">お問い合わせ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">利用規約</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-indigo-400 mt-8 pt-6 text-center text-indigo-200 text-sm">
          <p>&copy; {new Date().getFullYear()} This is Japan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
