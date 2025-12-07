import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Bookmark, Check } from 'lucide-react';
import { loadCatalog } from "../data/catalog";
import {
  hasVectorData,
  buildUserVecFromSelectedTags,
  rankTitlesByUserVec,
} from "../data/recommendation";
import { Button } from './ui/button';
import { useWatchlist } from './WatchlistContext';
import { AppHeader } from './AppHeader';

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, getStatus, moveToWatched } = useWatchlist();
  const movies = useMemo(() => loadCatalog(), []);
  const movieId = id ?? '';
  const movie = movies.find(m => String(m.id) === movieId);
  
  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Movie not found</p>
      </div>
    );
  }

  const movieTags: string[] = (movie as any).tags ?? (movie as any).genres ?? [];

  const recommendations = useMemo(() => {
    // Build a quick lookup of catalog movies by normalized title
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const byTitle = new Map<string, any>(
      movies.map(m => [normalize(String(m.title)), m])
    );

    // Prefer cosine similarity using movies.json tag-score vectors
    if (hasVectorData() && movieTags.length > 0) {
      const userVec = buildUserVecFromSelectedTags(movieTags);
      const ranked = rankTitlesByUserVec(userVec);

      const recs: any[] = [];
      for (const r of ranked) {
        // Skip the current movie title
        if (normalize(r.title) === normalize(String(movie.title))) continue;
        const match = byTitle.get(normalize(r.title));
        if (match) {
          recs.push(match);
          if (recs.length >= 6) break;
        }
      }

      if (recs.length > 0) return recs;
    }

    // fallback: simple tag overlap
    return movies
      .filter(m => {
        if (String(m.id) === String(movie.id)) return false;
        const tags = (m as any).tags ?? (m as any).genres ?? [];
        return movieTags.length === 0 ? true : tags.some((t: string) => movieTags.includes(t));
      })
      .slice(0, 6);
  }, [movies, movie.title, movie.id, movieTags]);

  const inWatchlist = isInWatchlist(movie.id);
  const status = getStatus(movie.id);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <AppHeader />

      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="absolute inset-0 opacity-20">
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={movie.title}
              className="w-full h-full object-cover blur-2xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-800/40 to-gray-900/60" />
          )}
        </div>
        
        <div className="relative container mx-auto px-6 h-full flex items-end pb-12">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <div className="w-64 flex-shrink-0">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center text-gray-500">
                  No poster
                </div>
              )}
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
                  <span className="capitalize">{(movie as any).type ?? 'movie'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movieTags.length > 0 ? (
                  movieTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800/80 border border-gray-700 rounded-full text-gray-300"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-full text-gray-500">
                    No tags available
                  </span>
                )}
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
              <p className="text-gray-400 leading-relaxed">{(movie as any).summary ?? (movie as any).synopsis ?? 'No synopsis available.'}</p>
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
                      {rec.poster ? (
                        <img
                          src={rec.poster}
                          alt={rec.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                          No poster
                        </div>
                      )}
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
