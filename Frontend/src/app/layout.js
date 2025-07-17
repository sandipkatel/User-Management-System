import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "LOCUS - User Management",
    template: "%s | LOCUS",
  },
  description: "A comprehensive user management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-r from-blue-500 to-blue-600 py-8 shadow-lg">
              <div className="container mx-auto px-4 text-center">
                <h2 className="text-white text-xl font-bold tracking-wide uppercase">
                  <span className="inline-block bg-white text-blue-800 px-3 py-1 rounded-lg mr-2 transform -rotate-2 shadow">LOCUS</span>
                  User-Management System
                </h2>
                <div className="mt-2 flex justify-center">
                  <div className="w-16 h-1 bg-white rounded-full opacity-70"></div>
                </div>
              </div>
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="bg-gray-100 py-6 mt-8">
              <div className="container mx-auto px-4 text-center">
                <p className="text-gray-600">
                  © {new Date().getFullYear()} MyApp. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
