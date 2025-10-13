import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

 

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Gulshan Club. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">
                Email: <a href="mailto:info@gulshanclub.com" className="hover:text-white underline">info@gulshanclub.com</a>
              </span>
              <span className="text-gray-400 text-sm">
                Phone: <a href="tel:+880123456789" className="hover:text-white underline">+880 1234-56789</a>
              </span>
              <Link href="/admin" className="hover:text-white underline">Admin Login</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
