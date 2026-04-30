import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 glass-panel border-b-0 rounded-none bg-darker/60 py-4 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-primary/20 p-2 rounded-xl group-hover:bg-primary/40 transition-colors">
          <Link2 className="text-primary w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          SnapShort
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
          Login
        </Link>
        <Link to="/dashboard" className="btn-primary">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
