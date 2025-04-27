from django.core.management.base import BaseCommand
from api.models import User, Photo, Word, Experience

class Command(BaseCommand):
    help = 'Initialize default data for the This is Japan application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating default data...')
        
        # Create default user
        default_user, created = User.objects.get_or_create(
            username='defaultuser',
            defaults={
                'password': 'password123',
                'is_japanese': False
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Default user created'))
        
        # Create sample photos
        if Photo.objects.count() == 0:
            photos = [
                {
                    'title': '春の桜と富士山',
                    'description': '山梨県からの富士山と桜の絶景',
                    'image_url': 'https://source.unsplash.com/800x600/?cherry-blossom,mount-fuji',
                    'user': default_user
                },
                {
                    'title': '京都の伝統的な寺院',
                    'description': '古都京都の美しい金閣寺',
                    'image_url': 'https://source.unsplash.com/800x600/?kyoto,temple',
                    'user': default_user
                },
                {
                    'title': '秋の紅葉',
                    'description': '日光の美しい紅葉の風景',
                    'image_url': 'https://source.unsplash.com/800x600/?autumn,japan',
                    'user': default_user
                },
                {
                    'title': '東京の夜景',
                    'description': '東京タワーからの夜景',
                    'image_url': 'https://source.unsplash.com/800x600/?tokyo,night',
                    'user': default_user
                },
                {
                    'title': '日本の伝統的な庭園',
                    'description': '風情ある日本庭園',
                    'image_url': 'https://source.unsplash.com/800x600/?japanese,garden',
                    'user': default_user
                }
            ]
            
            for photo_data in photos:
                photo = Photo.objects.create(**photo_data)
                photo.likes = photo.id  # Set likes proportional to ID for demo
                photo.save()
            
            self.stdout.write(self.style.SUCCESS(f'Created {len(photos)} sample photos'))
        
        # Create sample words
        if Word.objects.count() == 0:
            words = [
                {
                    'original': '一期一会 - いちごいちえ',
                    'translation': 'Once-in-a-lifetime encounter',
                    'description': 'Treasure every encounter, as it will never recur. A concept often associated with tea ceremony.',
                    'user': default_user
                },
                {
                    'original': '侘寂 - わびさび',
                    'translation': 'Wabi-sabi',
                    'description': 'Accepting imperfection and transience. The beauty found in simplicity and impermanence.',
                    'user': default_user
                },
                {
                    'original': '頑張る - がんばる',
                    'translation': 'Do your best/Persevere',
                    'description': 'To work hard, to persist, to endure. A common expression of encouragement.',
                    'user': default_user
                },
                {
                    'original': '木漏れ日 - こもれび',
                    'translation': 'Sunlight filtering through trees',
                    'description': 'The dappled light that filters through the leaves of trees.',
                    'user': default_user
                },
                {
                    'original': '間 - ま',
                    'translation': 'Space/Interval',
                    'description': 'The concept of negative space or interval. Important in Japanese arts, music, and communication.',
                    'user': default_user
                }
            ]
            
            for word_data in words:
                word = Word.objects.create(**word_data)
                word.likes = word.id  # Set likes proportional to ID for demo
                word.save()
            
            self.stdout.write(self.style.SUCCESS(f'Created {len(words)} sample words'))
        
        # Create sample experiences
        if Experience.objects.count() == 0:
            experiences = [
                {
                    'title': '茶道体験',
                    'description': '伝統的な茶道を体験し、日本文化の奥深さを知る',
                    'image_url': 'https://source.unsplash.com/800x600/?tea-ceremony',
                    'location': '京都市, 京都府'
                },
                {
                    'title': '着物レンタル体験',
                    'description': '美しい着物を着て古都を散策',
                    'image_url': 'https://source.unsplash.com/800x600/?kimono',
                    'location': '金沢市, 石川県'
                },
                {
                    'title': '温泉旅行',
                    'description': '日本の伝統的な温泉で心と体をリラックス',
                    'image_url': 'https://source.unsplash.com/800x600/?onsen,hotspring',
                    'location': '箱根町, 神奈川県'
                },
                {
                    'title': '寿司作り教室',
                    'description': 'プロの寿司職人から技術を学ぶ',
                    'image_url': 'https://source.unsplash.com/800x600/?sushi,cooking',
                    'location': '東京都'
                },
                {
                    'title': '座禅体験',
                    'description': '禅寺での座禅を通じて精神を鍛える',
                    'image_url': 'https://source.unsplash.com/800x600/?zen,meditation',
                    'location': '鎌倉市, 神奈川県'
                }
            ]
            
            for exp_data in experiences:
                Experience.objects.create(**exp_data)
            
            self.stdout.write(self.style.SUCCESS(f'Created {len(experiences)} sample experiences'))
        
        self.stdout.write(self.style.SUCCESS('Default data initialization completed'))