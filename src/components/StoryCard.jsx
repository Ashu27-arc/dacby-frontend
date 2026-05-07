import { Bookmark, ExternalLink, User, Clock, Star } from 'lucide-react';
import { cn } from '../utils/cn';

const StoryCard = ({ story, isBookmarked, onBookmarkToggle, isLoadingBookmark }) => {
  return (
    <div className="glass rounded-2xl p-6 hover:border-primary-500/50 transition-all group animate-in">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="text-xl font-semibold leading-tight group-hover:text-primary-400 transition-colors">
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            {story.title}
            <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </a>
        </h3>
        <button
          onClick={() => onBookmarkToggle(story._id)}
          disabled={isLoadingBookmark}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            isBookmarked 
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30" 
              : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          )}
        >
          <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-white/60">
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-yellow-500" />
          <span className="font-medium text-white/90">{story.points} points</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User size={16} />
          <span>{story.author}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={16} />
          <span>{story.postedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
