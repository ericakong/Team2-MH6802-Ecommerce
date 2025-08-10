import { PROJECT_TAGLINE } from '../config/constants';

export default function Footer() {
    return (
        <footer className="mt-10 border-t border-gray-200 bg-white" role="contentinfo">
            <div className="mx-auto max-w-7xl p-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>&copy; {new Date().getFullYear()} MVP Shop</p>
                <p className="opacity-80">{PROJECT_TAGLINE}</p>
            </div>
        </footer>
    );
}