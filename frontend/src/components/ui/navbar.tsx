import { Home, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="mb-4">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto justify-between">
        <div className="flex">
          <a href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">PX</span>
            </div>
            <span className="font-semibold">PowerX</span>
          </a>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link 
            to="/" 
            className="flex items-center text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link 
            to="/upload" 
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;