import CakeMaker from '@/components/CakeMaker';
import CakeGallery from '@/components/CakeGallery';
import FloatingMusic from '@/components/FloatingMusic'; // 引入播放器

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12 px-4 relative overflow-hidden">
      
      {/* 悬浮音乐播放器 */}
      <FloatingMusic />

      <header className="text-center my-8 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 mb-6 drop-shadow-sm">
          🎉 祝亲爱的妹妹 生日快乐！🎂
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          请签收你的专属定制蛋糕
        </p>
      </header>

      {/* 放入刚刚升级的 3D 蛋糕工坊 */}
      <div className="relative z-10">
        <CakeMaker />
        <CakeGallery />
      </div>

      <footer className="text-center text-sm text-gray-400 my-16 font-medium">
        Made with ❤️ for My Dear Sister
      </footer>
    </main>
  );
}