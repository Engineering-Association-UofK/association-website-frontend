export default function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfb] animate-in fade-in duration-1000">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center p-6 bg-white rounded-full shadow-[0_0_0_1px_rgba(14,15,12,0.1)] border-4 border-[#e2f6d5]">
          {/* <img src="/path-to-your-sea-logo.svg" alt="SEA Logo" className="w-24 h-24" /> */}

          <div className="text-5xl font-black text-[#0e0f0c] aspect-square flex items-center uppercase tracking-tighter animate-pulse scale-105 transition-transform duration-1000">
            SEA
            {/* <br /> <br /> */}
          </div>

          <div className="absolute inset-0 bg-white rounded-full opacity-50 blur-xl"></div>
        </div>

        {/* نص مساعد هادئ (اختياري) */}
        <p className=" font-semibold text-gray-500 text-sm tracking-widest uppercase mt-4">
          Connecting to SEA-backend...
        </p>
      </div>
    </div>
  );
}
