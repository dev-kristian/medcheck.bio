//(auth)/layout.jsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-100 flex items-center justify-center`}>
        {children}
    </div>
  );
}