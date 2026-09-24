import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Globe,
} from 'lucide-react';
import { Link } from 'react-router';
import LogoImage from '../assets/assetverse_logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-left lg:place-items-start">
          {/* ABOUT */}
          <div className="w-full">
            <Link
              to="/"
              className="text-xl flex items-center font-extrabold mb-4"
            >
              <img
                src={LogoImage}
                alt="AssetVerse Logo"
                className="w-[50px] rounded-xl object-contain"
              />
              <span className="text-blue-600 ml-2">
                Asset<span className="text-orange-500">Verse</span>
              </span>
            </Link>

            <p className="text-base-content/70 leading-relaxed">
              Manage, track, and organize your corporate assets efficiently with
              AssetVerse.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="w-full lg:text-center">
            <h3 className="text-xl font-bold mb-4 text-blue-500">
              Quick Links
            </h3>

            <ul className="space-y-2 lg:text-left lg:inline-block">
              <li>
                <Link
                  to="/"
                  className="text-base-content/70 hover:text-blue-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/join-employee"
                  className="text-base-content/70 hover:text-blue-500"
                >
                  Join as Employee
                </Link>
              </li>
              <li>
                <Link
                  to="/join-hr"
                  className="text-base-content/70 hover:text-blue-500"
                >
                  Join as HR
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/profile"
                  className="text-base-content/70 hover:text-blue-500"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-blue-500">Contact Us</h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500" size={18} />
                <a
                  href="mailto:support@assetverse.com"
                  className="text-base-content/70 hover:text-blue-500"
                >
                  support@assetverse.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Globe className="text-blue-500 mt-1" size={18} />
                <span className="text-base-content/70">
                  AssetVerse Corporate Platform
                </span>
              </li>
            </ul>
          </div>

          {/* SOCIAL LINKS */}
          <div className="w-full">
            <h3 className="text-xl font-bold mb-4 text-blue-500">Follow Us</h3>

            <div className="flex gap-5">
              <a
                href="https://facebook.com"
                className="text-blue-500 text-3xl hover:scale-125 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
              <a
                href="https://twitter.com"
                className="text-blue-500 text-3xl hover:scale-125 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter />
              </a>
              <a
                href="https://instagram.com"
                className="text-blue-500 text-3xl hover:scale-125 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
              <a
                href="https://linkedin.com"
                className="text-blue-500 text-3xl hover:scale-125 transition-transform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-base-300 my-6"></div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base-content/70 text-sm text-center md:text-left">
            © {currentYear} AssetVerse. All rights reserved.
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link
              to="/privacy-policy"
              className="text-base-content/70 hover:text-blue-500 text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-base-content/70 hover:text-blue-500 text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookie-policy"
              className="text-base-content/70 hover:text-blue-500 text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
