import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(false); // Reset to false to start clean? No, set to true.
      setLoading(true);
      const { data } = await authService.register(formData);
      login(data);
      toast.success(`Account created! Welcome, ${data.name}.`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="glass w-full max-w-md p-10 rounded-3xl animate-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-white/60">Join HN Scraper to start saving your favorite stories.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full glass bg-white/5 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                required
                type="email"
                placeholder="email@example.com"
                className="w-full glass bg-white/5 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-400 transition-colors" size={20} />
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full glass bg-white/5 pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-2xl transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>Register Now</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
