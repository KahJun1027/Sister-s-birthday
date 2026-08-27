'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Pause } from 'lucide-react';

export default function FloatingMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // 捕获可能因为浏览器策略导致的播放失败
      audioRef.current.play().catch((err) => {
        console.error("播放失败:", err);
        alert("请确保 public 文件夹下有 happy-birthday.mp3 文件哦！");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* 隐藏的原生音频标签 */}
      <audio ref={audioRef} src="/happy-birthday.mp3" loop preload="auto" />

      {/* 提示气泡 */}
      {!isPlaying && (
        <div className="bg-white/90 backdrop-blur text-pink-600 text-xs px-3 py-1.5 rounded-full shadow-lg animate-bounce border border-pink-100">
          点我播放 BGM 🎵
        </div>
      )}

      {/* 播放器本体 */}
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-800 relative overflow-hidden"
      >
        {/* 黑胶唱片的纹理细节 */}
        <div className="absolute inset-1 rounded-full border border-gray-700/50" />
        <div className="absolute inset-2 rounded-full border border-gray-700/30" />
        <div className="absolute inset-3 rounded-full border border-gray-700/50" />
        
        {/* 唱片中心 */}
        <div className="w-4 h-4 bg-pink-500 rounded-full z-10 flex items-center justify-center shadow-inner">
          <div className="w-1 h-1 bg-black rounded-full" />
        </div>

        {/* 旋转动画控制 */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full h-full bg-gradient-to-tr from-white/10 to-transparent rounded-full" />
        </motion.div>

        {/* 悬浮图标 */}
        <div className="absolute z-20 text-white/80 drop-shadow-md">
          {isPlaying ? <Music className="w-5 h-5 opacity-0" /> : <Pause className="w-5 h-5 opacity-0" />}
        </div>
      </motion.button>
    </div>
  );
}