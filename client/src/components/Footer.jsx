import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-t border-[#E5E5E5] pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-xl tracking-tighter">
                  D
                </div>
                <span className="font-heading font-bold text-2xl tracking-tighter text-black uppercase">Driplens</span>
              </div>
              <p className="text-[#555555] text-sm leading-relaxed max-w-sm mb-8">
                Driplens empowers creators to transform their craft into a professional career through a merit-based portfolio system.
              </p>
              <div className="flex space-x-5 text-[#555555]">
                <a href="#" className="hover:text-black transition-colors">
                  <span className="sr-only">X</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>
                </a>
                <a href="#" className="hover:text-black transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227-.217.56-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227.217-.56.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.012 3.584.072 4.85c.06 1.278.262 2.148.558 2.913.306.789.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.584-.014 4.85-.072c1.278-.06 2.148-.262 2.913-.558.789-.306 1.459-.717 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.85s-.012-3.584-.072-4.85c-.06-1.278-.262-2.148-.558-2.913-.306-.789-.717-1.459-1.384-2.126C19.665.935 18.997.522 18.207.217c-.765-.295-1.636-.499-2.913-.558C15.667.012 15.259 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zM18.406 4.406a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
                </a>
                <a href="#" className="hover:text-black transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                </a>
                <a href="#" className="hover:text-black transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.205 11.385c.6.11.82-.26.82-.577v-2.165c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.814 1.103.814 2.222v3.293c0 .319.22.694.825.576A12.002 12.002 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            {/* Links Sections */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-heading font-bold text-black mb-6 uppercase tracking-widest text-xs">Product</h4>
                <ul className="space-y-3 text-sm text-[#555555]">
                  <li><Link to="/explore" className="hover:text-black transition-colors">Features</Link></li>
                  <li><a href="#" className="hover:text-black transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Changelog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-black mb-6 uppercase tracking-widest text-xs">Resources</h4>
                <ul className="space-y-3 text-sm text-[#555555]">
                  <li><a href="#" className="hover:text-black transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-bold text-black mb-6 uppercase tracking-widest text-xs">Company</h4>
                <ul className="space-y-3 text-sm text-[#555555]">
                  <li><a href="#" className="hover:text-black transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#F5F5F5] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-[#555555]">
              &copy; {currentYear} Driplens. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-sm text-[#555555]">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Cookies Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
