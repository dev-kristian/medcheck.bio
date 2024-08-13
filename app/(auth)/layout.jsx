// (auth)/layout.jsx
import { Inter } from "next/font/google";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className}  min-h-screen md:bg-gray-100 flex items-center justify-center p-4`}>
      <div className="max-w-6xl w-full bg-white rounded-3xl md:shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 md:p-8 ">
          <div className="text-center">
            <Image 
              src="/images/logo.png" 
              alt="Medcheck Logo" 
              width={100} 
              height={100} 
              className="mx-auto"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          {children}
        </div>

        <div className="hidden md:block w-full relative ">
          <Image
            src="/images/auth-bg2.jpg"
            alt="Authentication background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/40 to-blue-700/40 flex items-center justify-center">
          </div>
        </div>
      </div>
    </div>
  );
}