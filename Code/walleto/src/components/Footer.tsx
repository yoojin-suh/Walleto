import { FaFacebook, FaXTwitter, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <h3 className="mb-4 text-2xl font-bold text-white">Walleto</h3>
            <p className="mb-4 text-gray-400">Smart budget analysis that helps you take control of your money with confidence.</p>
            <div className="flex items-center gap-3">
              <a className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10" href="#">
                <FaFacebook className="text-[18px] text-white/80 group-hover:text-white" />
              </a>
              <a className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10" href="#">
                <FaXTwitter className="text-[18px] text-white/80 group-hover:text-white" />
              </a>
              <a className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 transition hover:bg-white/10" href="#">
                <FaLinkedin className="text-[18px] text-white/80 group-hover:text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              <li><a className="hover:text-white" href="#">Features</a></li>
              <li><a className="hover:text-white" href="#">Pricing</a></li>
              <li><a className="hover:text-white" href="#">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li><a className="hover:text-white" href="#">About</a></li>
              <li><a className="hover:text-white" href="#">Blog</a></li>
              <li><a className="hover:text-white" href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li><a className="hover:text-white" href="#">Help Center</a></li>
              <li><a className="hover:text-white" href="#">Contact</a></li>
              <li><a className="hover:text-white" href="#">API Docs</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">© 2025 Walleto. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 text-sm md:mt-0">
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Terms</a>
            <a className="hover:text-white" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
