'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Star, ExternalLink } from 'lucide-react';
import restaurantData from '@/data/restaurants.json';

type SpoonType = 'all' | 'white' | 'black';
type SeasonFilter = 'all' | 1 | 2;

interface Restaurant {
  nameKo: string;
  nameEn?: string;
  cuisine: string;
  address: string;
  reservation?: string;
  michelin?: string;
}

interface Chef {
  id: string;
  nameKo: string;
  nameEn: string;
  specialty?: string;
  michelin?: string;
  nickname?: string;
  realNameKo?: string;
  restaurants: Restaurant[];
  restaurant?: Restaurant | null;
  rank?: string;
  note?: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('all');
  const [spoonFilter, setSpoonFilter] = useState<SpoonType>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allChefs = useMemo(() => {
    const chefs: (Chef & { season: number; spoonType: 'white' | 'black' })[] = [];
    restaurantData.seasons.forEach((season) => {
      season.whiteSpoon.forEach((chef) => {
        chefs.push({ ...chef, season: season.id, spoonType: 'white', restaurants: chef.restaurants || [] } as Chef & { season: number; spoonType: 'white' | 'black' });
      });
      season.blackSpoon.forEach((chef) => {
        const blackChef = chef as { id: string; nickname: string; realNameKo?: string | null; restaurant?: Restaurant | null; rank?: string; note?: string };
        chefs.push({
          id: blackChef.id,
          nameKo: blackChef.realNameKo || blackChef.nickname,
          nameEn: blackChef.nickname,
          nickname: blackChef.nickname,
          realNameKo: blackChef.realNameKo || undefined,
          restaurants: blackChef.restaurant ? [blackChef.restaurant] : [],
          rank: blackChef.rank,
          note: blackChef.note,
          season: season.id,
          spoonType: 'black',
        } as Chef & { season: number; spoonType: 'white' | 'black' });
      });
    });
    return chefs;
  }, []);

  const filteredChefs = useMemo(() => {
    return allChefs.filter((chef) => {
      if (seasonFilter !== 'all' && chef.season !== seasonFilter) return false;
      if (spoonFilter !== 'all' && chef.spoonType !== spoonFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = chef.nameKo.toLowerCase().includes(query) ||
          chef.nameEn?.toLowerCase().includes(query) ||
          chef.nickname?.toLowerCase().includes(query);
        const matchesRestaurant = chef.restaurants.some(
          (r) => r.nameKo?.toLowerCase().includes(query) || r.nameEn?.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesRestaurant) return false;
      }
      return true;
    });
  }, [allChefs, seasonFilter, spoonFilter, searchQuery]);

  const stats = useMemo(() => ({
    totalChefs: allChefs.length,
    totalRestaurants: allChefs.reduce((acc, chef) => acc + chef.restaurants.length, 0),
    michelinCount: 15,
  }), [allChefs]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen noise-overlay">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 border-l-0 border-r-0">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight">흑백요리사</span>
            <span className="text-caption text-gray-600">Guide</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Restaurants</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Chefs</a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl animate-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="heading-display mb-6">
              <span className="text-white">Black</span>
              <span className="text-gray-600 mx-4">&</span>
              <span className="text-gray-400">White</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-xl">
              Discover {stats.totalRestaurants}+ restaurants from {stats.totalChefs} chefs featured on Netflix&apos;s Culinary Class War.
            </p>

            {/* Stats */}
            <div className="flex gap-12">
              <div className="animate-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-semibold mb-1">{stats.totalRestaurants}+</div>
                <div className="text-caption">Restaurants</div>
              </div>
              <div className="animate-in" style={{ animationDelay: '0.25s' }}>
                <div className="text-3xl font-semibold mb-1">{stats.totalChefs}</div>
                <div className="text-caption">Chefs</div>
              </div>
              <div className="animate-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl font-semibold text-red-500 mb-1">{stats.michelinCount}</div>
                <div className="text-caption">Michelin Stars</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between animate-in" style={{ animationDelay: '0.35s' }}>
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search chefs or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filter Groups */}
            <div className="flex flex-wrap gap-4">
              {/* Spoon Filter */}
              <div className="filter-group">
                {(['all', 'white', 'black'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSpoonFilter(type)}
                    className={`filter-item ${spoonFilter === type ? 'active' : ''}`}
                  >
                    {type === 'all' ? 'All' : type === 'white' ? '⚪ White' : '⚫ Black'}
                  </button>
                ))}
              </div>

              {/* Season Filter */}
              <div className="filter-group">
                {(['all', 1, 2] as const).map((season) => (
                  <button
                    key={season}
                    onClick={() => setSeasonFilter(season)}
                    className={`filter-item ${seasonFilter === season ? 'active' : ''}`}
                  >
                    {season === 'all' ? 'All' : `S${season}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-sm text-gray-500 animate-in" style={{ animationDelay: '0.4s' }}>
            Showing {filteredChefs.length} of {allChefs.length} chefs
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <section className="pb-32">
        <div className="container">
          <div className="card-grid">
            {filteredChefs.map((chef, idx) => (
              <article
                key={chef.id}
                className="glass-card p-6 cursor-pointer animate-in"
                style={{ animationDelay: `${0.1 + (idx % 12) * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <span className={`badge ${chef.spoonType === 'white' ? 'badge-white' : 'badge-black'}`}>
                      {chef.spoonType}
                    </span>
                    <span className="badge badge-black">S{chef.season}</span>
                  </div>
                  {chef.rank && (
                    <span className="badge badge-winner">{chef.rank}</span>
                  )}
                </div>

                {/* Chef Info */}
                <div className="mb-6">
                  <h3 className="heading-lg text-white mb-1">
                    {chef.spoonType === 'black' && chef.nickname ? chef.nickname : chef.nameKo}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {chef.spoonType === 'black' && chef.realNameKo ? chef.realNameKo : chef.nameEn}
                  </p>
                </div>

                {/* Restaurants */}
                <div className="space-y-3">
                  {chef.restaurants.slice(0, 2).map((r, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{r.nameKo}</span>
                          {r.michelin && <Star className="w-3 h-3 text-red-500 fill-red-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{r.address.split(' ').slice(0, 2).join(' ')}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                    </div>
                  ))}

                  {chef.restaurants.length === 0 && (
                    <p className="text-sm text-gray-600 italic">{chef.note || 'No restaurant listed'}</p>
                  )}

                  {chef.restaurants.length > 2 && (
                    <p className="text-xs text-gray-600">+{chef.restaurants.length - 2} more</p>
                  )}
                </div>

                {/* Michelin Badge */}
                {(chef.michelin || chef.restaurants.some(r => r.michelin)) && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="badge badge-michelin">
                      <Star className="w-3 h-3 fill-white" /> Michelin
                    </span>
                  </div>
                )}
              </article>
            ))}
          </div>

          {filteredChefs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No chefs found matching your criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="text-lg font-semibold">흑백요리사</span>
              <span className="text-gray-600 ml-2">Restaurant Guide</span>
            </div>
            <p className="text-sm text-gray-600 text-center md:text-right">
              An unofficial guide for fans and food lovers.<br />
              Not affiliated with Netflix.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
