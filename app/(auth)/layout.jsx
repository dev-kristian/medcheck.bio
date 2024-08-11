// (auth)/layout.jsx
import { Inter } from "next/font/google";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children}) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center`}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <Image src="/icons/logo.png" alt="Medcheck Logo" width={48} height={48} className="mx-auto" />
        </div>
        {children}
      </div>
    </div>
  );
}
