import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} Gulshan Club Olympiad 2025. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 items-center">
              <span className="text-gray-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l3.293-3.293a1 1 0 011.414 0l3.293 3.293m-8 0v6a2 2 0 002 2h4a2 2 0 002-2v-6" />
                </svg>
                <a href="mailto:OLYMPIAD@GULSHANCLUB.COM" className="hover:text-orange-400 underline transition-colors duration-200 lowercase">olympiad@gulshanclub.com</a>
              </span>
              <span className="text-gray-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h2a2 2 0 012 2v10a2 2 0 01-2 2H3m18-14h-2a2 2 0 00-2 2v10a2 2 0 002 2h2m-5 0a5 5 0 01-10 0" />
                </svg>
                <a href="tel:16717" className="hover:text-pink-400 underline transition-colors duration-200">16717</a>
              </span>
              <Link href="/admin" className="text-gray-400 text-sm hover:text-violet-500 underline transition-colors duration-200">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
