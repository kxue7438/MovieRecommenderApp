import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Film, SlidersHorizontal } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { movies, genres, streamingPlatforms } from './mockData';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get('genre') ? [searchParams.get('genre')!] : []
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState([2020, 2024]);
  const [ratingRange, setRatingRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = searchQuery === '' || 
      movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenres.length === 0 || 
      selectedGenres.some(g => movie.genres.includes(g));
    
    const matchesPlatform = selectedPlatforms.length === 0 || 
      selectedPlatforms.some(p => movie.platforms.includes(p));
    
    const matchesYear = movie.year >= yearRange[0] && movie.year <= yearRange[1];
    
    const avgScore = Math.round(
      (movie.scores.rottenTomatoes + movie.scores.metacritic + (movie.scores.letterboxd * 20)) / 3
    );
    const matchesRating = avgScore >= ratingRange[0] && avgScore <= ratingRange[1];

    return matchesSearch && matchesGenre && matchesPlatform && matchesYear && matchesRating;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
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
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies or TV shows..."
              className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </form>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'w-72' : 'w-0'} flex-shrink-0 transition-all overflow-hidden`}>
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-400"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Genre Filter */}
              <div className="space-y-3">
                <h4 className="text-gray-300">Genre</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {genres.map((genre) => (
                    <label key={genre} className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                      <Checkbox
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                      />
                      <span>{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year Range */}
              <div className="space-y-3">
                <h4 className="text-gray-300">Year</h4>
                <div className="space-y-2">
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    min={1990}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-400">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Range */}
              <div className="space-y-3">
                <h4 className="text-gray-300">Rating</h4>
                <div className="space-y-2">
                  <Slider
                    value={ratingRange}
                    onValueChange={setRatingRange}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-gray-400">
                    <span>{ratingRange[0]}</span>
                    <span>{ratingRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Streaming Platform */}
              <div className="space-y-3">
                <h4 className="text-gray-300">Streaming Platform</h4>
                <div className="space-y-2">
                  {streamingPlatforms.map((platform) => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
                      <Checkbox
                        checked={selectedPlatforms.includes(platform)}
                        onCheckedChange={() => togglePlatform(platform)}
                      />
                      <span>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {!showFilters && (
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="mb-4 border-gray-700 text-gray-300"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Show Filters
              </Button>
            )}
            
            <div className="mb-6">
              <p className="text-gray-400">
                {filteredMovies.length} results found
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No results found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
