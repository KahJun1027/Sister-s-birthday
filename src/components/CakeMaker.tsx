'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, PartyPopper, MailOpen, HeartHandshake } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const BASES = [
  { id: 'strawberry', name: '草莓味 🍓', side: 'bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600' },
  { id: 'chocolate', name: '巧克力 🍫', side: 'bg-gradient-to-r from-[#3b2012] via-[#6b3c21] to-[#3b2012]' },
  { id: 'matcha', name: '抹茶 🍵', side: 'bg-gradient-to-r from-green-700 via-lime-300 to-green-700' },
  { id: 'vanilla', name: '香草 🍦', side: 'bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100' },
];

const CREAMS = [
  { name: '粉嫩奶油', value: '#ffc6ff' },
  { name: '纯白雪顶', value: '#ffffff' },
  { name: '梦幻薄荷', value: '#c8e6c9' },
  { name: '香草黄', value: '#fef08a' },
];

const AVAILABLE_TOPPINGS = ['🍓', '🍒', '🍫', '🌟', '🍇', '🎀'];

export default function CakeMaker() {
  const [selectedBase, setSelectedBase] = useState(BASES[0]);
  const [creamColor, setCreamColor] = useState(CREAMS[0].value);
  const [toppings, setToppings] = useState<string[]>(['🍓', '🌟', '🍒']);

  const [cakeName, setCakeName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);

  const toggleTopping = (emoji: string) => {
    if (toppings.includes(emoji)) {
      setToppings(toppings.filter((t) => t !== emoji));
    } else {
      if (toppings.length < 5) setToppings([...toppings, emoji]);
    }
  };

  const handleMakeWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) return alert('许个愿望再提交吧！');
    setIsSubmitting(true);

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    const { error } = await supabase.from('custom_cakes').insert([{
      creator_name: cakeName || '我的专属蛋糕',
      cake_base: selectedBase.name,
      cream_color: creamColor,
      toppings: toppings,
      candle_count: 1,
      wish_message: wishMessage,
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error('保存失败:', error);
      alert(`保存失败: ${error.message}`);
    } else {
      setCakeName('');
      setWishMessage('');
      setTimeout(() => setShowHiddenMessage(true), 1000);
    }
  };

  const placedToppings = toppings.map((emoji, index) => {
    const angle = (index / toppings.length) * Math.PI * 2 - Math.PI / 6;
    const x = Math.cos(angle) * 75 + 160;
    const y = Math.sin(angle) * 22 + 200;
    return { emoji, x, y, key: `${emoji}-${index}` };
  }).sort((a, b) => a.y - b.y);

  return (
    // 【优化】: 底部增加 pb-20 避开 iPhone Pro Max 底部小白条 (Home Indicator)，水平 padding 适配刘海屏/灵动岛
    <div className="w-full max-w-5xl mx-auto px-5 sm:px-6 mb-12 overflow-x-hidden pb-20 pt-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl min-[400px]:text-3xl font-extrabold text-pink-600 flex items-center justify-center gap-2">
          <Sparkles className="w-7 h-7" /> 妹妹的专属蛋糕工坊
        </h2>
        <p className="text-gray-500 mt-2 text-[15px]">亲爱的妹妹，按照喜好做个生日蛋糕许愿吧！</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-2xl border border-pink-100 p-5 min-[400px]:p-7 grid grid-cols-1 lg:grid-cols-2 gap-8 min-[400px]:gap-10">

        {/* == 左侧：次世代 3D 光影蛋糕 == */}
        {/* 【优化】: 高度自适应，iPhone Pro Max 宽度超 400px 享有 h-[400px] 更宽敞的展示空间 */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-t from-pink-100 to-indigo-50 rounded-[1.8rem] border border-pink-200 h-[360px] min-[400px]:h-[400px] md:h-[450px] relative overflow-hidden">

          {/* 【优化】: 针对 Pro Max 的大屏，缩放比例由 scale-0.80 提升至 scale-0.95，视觉上更大更震撼 */}
          <div className="transform scale-[0.80] min-[400px]:scale-[0.95] md:scale-100 relative w-[320px] h-[360px] drop-shadow-2xl mt-4">

            {/* 1. 精致陶瓷托盘 */}
            <div className="absolute top-[230px] left-[10px] w-[300px] h-[100px] bg-gradient-to-b from-gray-200 to-gray-400 rounded-[50%] shadow-[0_25px_30px_rgba(0,0,0,0.3)] border-b-[8px] border-gray-300" />
            <div className="absolute top-[235px] left-[20px] w-[280px] h-[90px] bg-gradient-to-tr from-gray-50 to-gray-200 rounded-[50%] shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] border border-white/50" />

            {/* 2. 蛋糕本体 */}
            <div className={`absolute left-[40px] top-[240px] w-[240px] h-[80px] rounded-[50%] ${selectedBase.side} transition-colors duration-700 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.3)]`} />
            <div className={`absolute left-[40px] top-[200px] w-[240px] h-[80px] ${selectedBase.side} transition-colors duration-700`} />
            <div className={`absolute left-[40px] top-[160px] w-[240px] h-[80px] rounded-[50%] ${selectedBase.side} transition-colors duration-700`} />

            {/* 3. 奶油顶与流心 */}
            <div className="absolute top-[160px] left-[40px] w-[240px] h-[150px] z-10 transition-colors duration-700">
              <svg width="240" height="150" viewBox="0 0 240 150" style={{ filter: 'drop-shadow(0px 8px 4px rgba(0,0,0,0.25))' }}>
                <path d="
                  M 0,40
                  C 0,60 10,70 18,70
                  C 25,70 30,55 40,55
                  C 50,55 55,80 65,80
                  C 75,80 80,60 95,60
                  C 110,60 120,95 135,95
                  C 150,95 160,65 175,65
                  C 190,65 200,85 212,85
                  C 225,85 230,50 240,40
                  A 120 40 0 0 0 0 40 Z
                " fill={creamColor} />
                <ellipse cx="120" cy="40" rx="120" ry="40" fill={creamColor} />
                <ellipse cx="120" cy="40" rx="116" ry="36" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
                <ellipse cx="120" cy="40" rx="118" ry="38" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="4" />
              </svg>
            </div>

            {/* 4. 水果配料 */}
            <div className="absolute inset-0 pointer-events-none">
              {placedToppings.map((t) => (
                <motion.div
                  key={t.key}
                  initial={{ scale: 0, x: "-50%", y: "-100%" }}
                  animate={{ scale: 1, x: "-50%", y: "-50%" }}
                  className="absolute text-[2.5rem]"
                  style={{
                    left: `${t.x}px`,
                    top: `${t.y}px`,
                    zIndex: t.y > 200 ? 40 : 20,
                    filter: 'drop-shadow(2px 8px 4px rgba(0,0,0,0.3))'
                  }}
                >
                  {t.emoji}
                </motion.div>
              ))}
            </div>

            {/* 5. 逼真的 3D 蜡烛 */}
            <div className="absolute z-30 flex flex-col items-center" style={{ left: '160px', top: '200px', transform: 'translate(-50%, -100%)' }}>
              <div className="relative w-6 h-8 mb-1 flex justify-center">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl animate-pulse" />
                <div className="w-4 h-8 bg-gradient-to-t from-white via-amber-300 to-red-500 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_15px_rgba(245,158,11,0.8)] relative z-10 animate-bounce" style={{ transformOrigin: 'bottom center', animationDuration: '1.2s' }} />
              </div>
              <div className="w-[14px] h-[55px] rounded-sm shadow-[inset_-3px_0_6px_rgba(0,0,0,0.3)] border border-white/20"
                style={{ background: 'repeating-linear-gradient(45deg, #fecdd3, #fecdd3 6px, #fff 6px, #fff 12px)' }} />
            </div>

          </div>
        </div>

        {/* == 右侧：操作面板 == */}
        <div className="space-y-7">
          <div>
            {/* 【优化】: 标签字体在手机端设为 text-base 增强易读性 */}
            <label className="text-base font-bold text-gray-700 block mb-3">1. 选个喜欢的口味：</label>
            <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4">
              {BASES.map((b) => (
                <button
                  key={b.id} onClick={() => setSelectedBase(b)}
                  className={`py-3.5 px-4 rounded-[1.25rem] text-[15px] font-bold border flex items-center justify-between transition-all active:scale-95 ${
                    selectedBase.id === b.id 
                    ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {b.name}
                  {selectedBase.id === b.id && <Check className="w-5 h-5 text-pink-500" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-bold text-gray-700 block mb-3">2. 铺上一层厚厚的奶油：</label>
            <div className="flex gap-4 justify-between min-[400px]:justify-start">
              {CREAMS.map((c) => (
                <button
                  key={c.value} onClick={() => setCreamColor(c.value)}
                  className={`w-14 h-14 min-[400px]:w-12 min-[400px]:h-12 rounded-full transition-all active:scale-95 ${
                    creamColor === c.value 
                    ? 'scale-110 shadow-lg ring-4 ring-pink-300 ring-offset-2' 
                    : 'shadow-inner border-2 border-gray-300'
                  }`}
                  style={{ backgroundColor: c.value }} title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-base font-bold text-gray-700 block mb-3">3. 点缀一些水果 (最多5个)：</label>
            <div className="flex flex-wrap gap-3 min-[400px]:gap-4">
              {AVAILABLE_TOPPINGS.map((emoji) => (
                <button
                  key={emoji} onClick={() => toggleTopping(emoji)}
                  className={`w-14 h-14 min-[400px]:w-[3.25rem] min-[400px]:h-[3.25rem] rounded-2xl text-[1.6rem] flex items-center justify-center transition-all active:scale-95 ${
                    toppings.includes(emoji) 
                    ? 'bg-pink-100 border-2 border-pink-400 shadow-sm scale-105' 
                    : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleMakeWish} className="pt-6 border-t border-gray-100 space-y-4">
            {/* 【优化】: 强制 text-base 避免 iOS Safari 点击输入框时页面放大 */}
            <input
              type="text" placeholder="给你的专属蛋糕起个名字 (选填)"
              value={cakeName} onChange={(e) => setCakeName(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-base text-gray-700 placeholder:text-gray-400"
            />
            <textarea
              placeholder="在这里悄悄写下新一岁的生日愿望..."
              value={wishMessage} rows={3} onChange={(e) => setWishMessage(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white resize-none text-base text-gray-700 placeholder:text-gray-400"
            />
            <button
              type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-[1.25rem] shadow-lg shadow-pink-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg active:scale-95"
            >
              <PartyPopper className="w-6 h-6" /> {isSubmitting ? 'Loading...' : '完成蛋糕，许下愿望 ✨'}
            </button>
          </form>
        </div>
      </div>

      {/* == 哥哥的隐藏密信 == */}
      <AnimatePresence>
        {showHiddenMessage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-7 flex flex-col items-center">
                <MailOpen className="w-12 h-12 text-white mb-2" />
                <h3 className="text-white text-xl font-bold tracking-widest">一封秘密信件</h3>
              </div>

              <div className="p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <HeartHandshake className="w-10 h-10 mx-auto text-rose-400 mb-4 opacity-80" />
                <p className="text-gray-700 text-lg leading-loose font-medium font-serif">
                  “记得，<br />
                  哥哥会一直站在你这边<span className="text-rose-500 font-bold">支持你</span>，<br />
                  无论你面对的是谁，<br />
                  又遇到什么事。”
                </p>
                <div className="w-12 h-1 bg-pink-200 mx-auto mt-6 rounded-full" />
              </div>

              <div className="p-5 bg-gray-50 flex justify-center pb-8">
                <button
                  onClick={() => setShowHiddenMessage(false)}
                  className="bg-gray-800 text-white px-10 py-3.5 rounded-full font-bold text-[15px] shadow-md active:scale-95 transition-transform"
                >
                  收下
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}