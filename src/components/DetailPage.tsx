import { useParams, useNavigate } from 'react-router-dom';
import { Film, Calendar, Star, Bookmark, Check, Play } from 'lucide-react';
import { movies } from './mockData';
import { Button } from './ui/button';
import { useWatchlist } from './WatchlistContext';

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, getStatus, moveToWatched } = useWatchlist();
  
  const movie = movies.find(m => m.id === Number(id));
  
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  const recommendations = movies
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g)))
    .slice(0, 6);

  const inWatchlist = isInWatchlist(movie.id);
  const status = getStatus(movie.id);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 focus:outline-none group"
            aria-label="CineScope Home"
          >
            <Film className="w-8 h-8 text-orange-500" />
            <span className="text-xl text-white group-hover:text-orange-100 transition-colors">CineScope</span>
          </button>


          <nav className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white"
            >
              Home
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/watchlist')}
              className="text-gray-300 hover:text-white"
            >
              Watchlist
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={movie.poster} 
            alt={movie.title}
            className="w-full h-full object-cover blur-2xl"
          />
        </div>
        
        <div className="relative container mx-auto px-6 h-full flex items-end pb-12">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <div className="w-64 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 pb-4 space-y-4">
              <div className="space-y-2">
                <h1 className="text-5xl text-white">{movie.title}</h1>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>
                  <span>•</span>
                  <span className="capitalize">{movie.type}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-800/80 border border-gray-700 rounded-full text-gray-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {!inWatchlist ? (
                  <>
                    <Button
                      onClick={() => addToWatchlist(movie.id, 'want')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Want to Watch
                    </Button>
                    <Button
                      onClick={() => addToWatchlist(movie.id, 'watched')}
                      variant="outline"
                      className="border-orange-500/60 text-orange-100 hover:!text-orange-50 hover:!bg-orange-500/20 hover:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/60"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Watched
                    </Button>
                  </>
                ) : status === 'want' ? (
                  <Button
                    onClick={() => moveToWatched(movie.id)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Watched
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="bg-gray-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Watched
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl text-white mb-4">Synopsis</h2>
              <p className="text-gray-400 leading-relaxed">{movie.synopsis}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl text-white mb-8">You May Also Like</h2>
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div className="flex gap-6 min-w-max">
              {recommendations.map((rec) => (
                <div key={rec.id} className="w-[200px] flex-shrink-0">
                  <button
                    onClick={() => navigate(`/movie/${rec.id}`)}
                    className="group w-full text-left"
                  >
                    <div className="relative overflow-hidden rounded-xl mb-3 aspect-[2/3] bg-gray-800">
                      <img
                        src={rec.poster}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-white group-hover:text-orange-500 transition-colors line-clamp-1">
                      {rec.title}
                    </h3>
                    <p className="text-gray-400">{rec.year}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
