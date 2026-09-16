import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Authentication | SocialPilot",
  description: "Secure authentication for SocialPilot social media management platform.",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f5fb] flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div className="w-full max-w-[1100px] min-h-[580px] bg-white rounded-[32px] shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Static Graphic (Persistent across auth routes, optimized .webp preloaded with priority) */}
        <div className="hidden md:flex md:w-[50%] lg:w-[55%] p-4 shrink-0">
          <div className="w-full h-full min-h-[500px] bg-[#9ca3af] relative rounded-[24px] overflow-hidden flex items-center justify-center">
            <Image
              src="/images/auth-graphic.webp"
              alt="SocialPilot Auth Graphic"
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover"
            />
            <Link href="/" className="absolute top-6 right-6 z-10">
              <button
                type="button"
                className="border border-[#260b79] text-[#260b79] bg-white/90 backdrop-blur-sm px-5 py-1.5 rounded-full flex items-center gap-1 text-sm font-medium hover:bg-[#260b79] hover:text-white transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft size={16} /> Back
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Dynamic Form Content */}
        <div className="w-full md:w-[50%] lg:w-[45%] flex items-center justify-center px-4 py-8 sm:px-8 md:px-8">
          <div className="w-full max-w-[360px]">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
