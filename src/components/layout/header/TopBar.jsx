import { MdEmail } from "react-icons/md";
import { IoCall } from "react-icons/io5";
import logo from "@/assets/cclpi-logo.png";
import { FaFacebook } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function TopBar() {
  return (
    // FIX: Added relative + z-10 so TopBar stays in its own stacking context
    // and does NOT bleed over MainNav below it
    <header className="bg-[#f6fbfe] border-b">
      <div className="max-w-7xl mx-auto px-6 py-5">

        {/* GRID CONTAINER */}
        <div className="grid grid-cols-1 gap-4 
                        md:grid-cols-[auto_1fr_auto] 
                        items-center">
          {/* LOGO */}
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <img
                src={logo}
                alt="CCLPI Logo"
                className="h-12 md:h-14 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* CONTACT INFO (HIDDEN ON SMALL SCREENS) */}
          <div className="hidden lg:flex justify-center gap-6">

            {/* EMAIL */}
            <div className="flex items-center gap-2 border-r border-gray-300 pr-5 hover:opacity-80 transition-opacity">
              <MdEmail className="text-brand-primary" />
              <div>
                <p className="font-semibold text-brand-primary">
                  cclpi.preneed@cclpi.com.ph
                </p>
                <p className="text-gray-500 text-sm">
                  Drop us a line
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div className="flex items-center gap-2 pl-5 border-r border-gray-300 pr-5 hover:opacity-80 transition-opacity">
              <IoCall className="text-brand-primary" />
              <div>
                <p className="font-semibold text-brand-primary">
                  +63 917 154 3459
                </p>
                <p className="text-gray-500 text-sm">
                  Make a call
                </p>
              </div>
            </div>

            {/* FACEBOOK */}
            <a 
              href="https://www.facebook.com/cclpi"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 pl-5 hover:opacity-80 transition-opacity"
            >
              <FaFacebook className="text-brand-primary text-xl" />
              <div>
                <p className="font-semibold text-brand-primary">
                  Facebook Official
                </p>
                <p className="text-gray-500 text-sm">
                  Visit our page
                </p>
              </div>
            </a>

          </div>

          {/* CTA BUTTON */}
          <div className="flex justify-center md:justify-end font-bold">
            <button
              onClick={() =>
                window.open(
                  "https://www.cclpiquotation.app/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              className="flex items-center gap-2 
                         bg-brand-accent text-brand-primary 
                         px-6 py-2 rounded
                         hover:bg-brand-secondary hover:text-white
                         transition"
            >
              <MdEmail className="size-4" />
              GET A QUOTE
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
