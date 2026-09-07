"use client";

import dynamic from 'next/dynamic';

// Disable SSR to avoid hydration mismatch due to client-only WebGL/DOM measurements
const GlassSurface = dynamic(() => import('@/components/ui/glassSurface'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className=" from-indigo-900 via-slate-900 to-black p-24">
        {/* Colorful background shape to test the glass refraction */}
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-500 blur-2xl opacity-50" />
        
        <GlassSurface height={300} width={300} className="text-white">
          <h2 className="text-xl font-bold mb-2">Liquid Glass Effect</h2>
          <p className="text-sm text-slate-300">
            This surface uses advanced refraction to dynamically distort the layout elements behind it.
          </p>
        </GlassSurface>
    </main>
  );
}