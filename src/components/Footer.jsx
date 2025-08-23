import { Link } from 'react-router-dom';
import { PROJECT_TAGLINE } from '../config/constants';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl p-6 text-sm text-gray-600 flex flex-col sm:flex-row items-start justify-between gap-3">
        
        {/* Left section: stacked copyright + link */}
        <div className="flex flex-col items-start space-y-1">
          <p>&copy; {new Date().getFullYear()} MVP Shop</p>
          <Link to="/compliance" className="hover:underline">
            Privacy &amp; Compliance
          </Link>
        </div>

        {/* Right section: tagline */}
        <p className="opacity-80">{PROJECT_TAGLINE}</p>
      </div>
    </footer>
  );
}
