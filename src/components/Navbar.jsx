import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Newspaper, Bookmark, LogOut, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          <Newspaper className="text-primary-500" />
          <span>HN Scraper</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
              <Link to="/bookmarks" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                <Bookmark size={18} />
                <span>Bookmarks</span>
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary-400" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-full text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                <LogIn size={18} />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
