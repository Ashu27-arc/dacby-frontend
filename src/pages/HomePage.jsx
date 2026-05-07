import { useState, useEffect, useCallback } from 'react';
import { storyService } from '../services/api';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStories, setFilteredStories] = useState([]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data } = await storyService.getStories(page);
      setStories(data.stories);
      setTotalPages(data.pages);
      
      if (user) {
        const { data: bookmarkData } = await storyService.getBookmarks();
        setBookmarks(bookmarkData.map(b => b._id));
      }
    } catch (error) {
      toast.error('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [page, user]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = stories.filter(story => 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStories(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, stories]);

  const handleScrape = async () => {
    try {
      setScraping(true);
      const { data } = await storyService.triggerScrape();
      toast.success(`Scraped HN! ${data.result.new} new stories found.`);
      fetchStories();
    } catch (error) {
      toast.error('Scraping failed');
    } finally {
      setScraping(false);
    }
  };

  const toggleBookmark = async (id) => {
    if (!user) {
      toast.error('Please login to bookmark stories');
      return;
    }

    try {
      const { data } = await storyService.toggleBookmark(id);
      setBookmarks(data.bookmarks);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Hacker News Top Stories</h1>
          <p className="text-white/60">Explore the latest and greatest from the tech world.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search stories..."
              className="glass pl-10 pr-4 py-2.5 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleScrape}
            disabled={scraping}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            {scraping ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass h-40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {filteredStories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                isBookmarked={bookmarks.includes(story._id)}
                onBookmarkToggle={toggleBookmark}
              />
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-20 glass rounded-3xl">
              <p className="text-xl text-white/40">No stories found matching your search.</p>
            </div>
          )}

          <div className="flex justify-center items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2.5 glass rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2.5 glass rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
            >
              <ChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
