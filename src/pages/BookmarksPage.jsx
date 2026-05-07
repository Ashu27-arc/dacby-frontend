import { useState, useEffect } from 'react';
import { storyService } from '../services/api';
import StoryCard from '../components/StoryCard';
import { toast } from 'react-hot-toast';
import { Bookmark, Inbox } from 'lucide-react';

const BookmarksPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const { data } = await storyService.getBookmarks();
      setStories(data);
    } catch (error) {
      toast.error('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const toggleBookmark = async (id) => {
    try {
      const { data } = await storyService.toggleBookmark(id);
      // Remove from list immediately if toggled off
      setStories(stories.filter(s => s._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Bookmark className="text-primary-500" />
          My Bookmarks
        </h1>
        <p className="text-white/60">Your curated collection of interesting stories.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass h-40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 glass rounded-3xl border-dashed">
          <Inbox size={64} className="text-white/10 mb-4" />
          <p className="text-xl text-white/40 mb-2">No bookmarks yet</p>
          <p className="text-white/20">Go back home to add some stories to your collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isBookmarked={true}
              onBookmarkToggle={toggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
