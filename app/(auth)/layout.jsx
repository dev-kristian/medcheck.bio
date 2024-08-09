//(auth)/layout.jsx
import { Inter } from "next/font/google";
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center`}>
      <div className="max-w-md w-full space-y-8 p-4 m-2 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <Image src="/logo.png" alt="Medcheck Logo" width={64} height={64} className="mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Medcheck</h2>
        </div>
        {children}
      </div>
    </div>
  );
}