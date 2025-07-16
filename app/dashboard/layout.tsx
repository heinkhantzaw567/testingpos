import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Navigation from "@/components/nav";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 w-full flex flex-col">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white shadow-sm">
          <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm relative">
            <div className="flex gap-5 items-center font-semibold">
              <Link href="/dashboard" className="text-xl font-bold">
                <span className="text-indigo-600">POS</span> System
              </Link>
            </div>
            
            
            <Navigation />
            
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </div>
        </nav>
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
