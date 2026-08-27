'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Heart } from 'lucide-react';

interface CustomCake {
  id: string;
  creator_name: string;
  cake_base: string;
  cream_color: string;
  toppings: string[];
  wish_message: string;
  created_at: string;
}

export default function CakeGallery() {
  const [cakes, setCakes] = useState<CustomCake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCakes();

    // 订阅 Realtime 实时数据更新
    const channel = supabase
      .channel('custom-cakes-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'custom_cakes' },
        (payload) => {
          // 收到新蛋糕时，添加到列表最前面
          setCakes((prev) => [payload.new as CustomCake, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCakes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('custom_cakes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取蛋糕列表失败:', error);
    } else if (data) {
      setCakes(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto my-16 p-6">
      <h3 className="text-2xl font-bold text-gray-800 text-center mb-10 flex items-center justify-center gap-2">
        <Heart className="text-rose-500 fill-rose-500 w-7 h-7 animate-pulse" />
        妹妹的蛋糕与愿望珍藏馆 ({cakes.length})
      </h3>

      {isLoading ? (
        <div className="text-center text-gray-400 py-10">正在加载橱窗...</div>
      ) : cakes.length === 0 ? (
        <div className="text-center py-10 bg-white/50 backdrop-blur rounded-2xl border border-dashed border-pink-200">
          <p className="text-gray-500">橱窗空空如也，快去上面做第一个专属蛋糕吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cakes.map((cake) => (
            <div
              key={cake.id}
              className="bg-white/90 backdrop-blur p-5 rounded-3xl shadow-sm border border-pink-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 缩略图蛋糕预览 */}
                <div className="bg-gradient-to-t from-pink-50 to-orange-50 p-6 rounded-2xl flex flex-col items-center justify-center mb-5 relative overflow-hidden border border-pink-50">
                  {/* 配料 */}
                  <div className="flex gap-1 mb-1 z-10 text-xl drop-shadow-sm">
                    {cake.toppings && cake.toppings.map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                  </div>

                  {/* 奶油 */}
                  <div
                    className="w-24 h-4 rounded-t-[50%] z-0 drop-shadow-sm"
                    style={{ backgroundColor: cake.cream_color || '#ffc6ff' }}
                  />

                  {/* 蛋糕体 */}
                  <div className="w-28 h-12 bg-amber-800 rounded-b-[50%] flex items-center justify-center relative overflow-hidden shadow-inner">
                    {/* 简易底座颜色展示 */}
                    <div className="absolute inset-0 opacity-80" style={{
                      backgroundColor:
                        cake.cake_base.includes('草莓') ? '#fb7185' :
                          cake.cake_base.includes('巧克力') ? '#5c3a21' :
                            cake.cake_base.includes('抹茶') ? '#10b981' : '#fef3c7'
                    }} />
                    <span className="text-[10px] font-black text-white/80 drop-shadow relative z-10">
                      HBD
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <span className="text-4xl text-pink-100 absolute -top-4 -left-2 z-0 font-serif">"</span>
                  <p className="text-gray-700 font-medium text-sm mb-3 relative z-10 pl-2 leading-relaxed">
                    {cake.wish_message}
                  </p>
                </div>
              </div>

              <div className="text-right border-t pt-3 mt-3 border-gray-100">
                <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                  来自 {cake.creator_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}