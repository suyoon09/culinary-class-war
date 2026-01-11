'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Star, ChefHat, Filter, X } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

  // Flatten all chefs from all seasons
  const allChefs = useMemo(() => {
    const chefs: (Chef & { season: number; spoonType: 'white' | 'black' })[] = [];

    restaurantData.seasons.forEach((season) => {
      // White Spoon chefs
      season.whiteSpoon.forEach((chef) => {
        chefs.push({
          ...chef,
          season: season.id,
          spoonType: 'white',
          restaurants: chef.restaurants || [],
        } as Chef & { season: number; spoonType: 'white' | 'black' });
      });

      // Black Spoon chefs
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

  // Filter chefs
  const filteredChefs = useMemo(() => {
    return allChefs.filter((chef) => {
      // Season filter
      if (seasonFilter !== 'all' && chef.season !== seasonFilter) return false;

      // Spoon type filter
      if (spoonFilter !== 'all' && chef.spoonType !== spoonFilter) return false;

      // Search filter
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

  // Count stats
  const stats = useMemo(() => ({
    totalChefs: allChefs.length,
    totalRestaurants: allChefs.reduce((acc, chef) => acc + chef.restaurants.length, 0),
    michelinCount: allChefs.filter((c) => c.michelin || c.restaurants.some((r) => r.michelin)).length,
  }), [allChefs]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent" />
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary-light)] via-[var(--color-primary)] to-[var(--color-primary-dark)] bg-clip-text text-transparent">
              흑백요리사
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-2">
              Culinary Class War Restaurants
            </p>
            <p className="text-[var(--color-text-muted)] mb-8">
              Discover {stats.totalRestaurants}+ restaurants from {stats.totalChefs} chefs featured on Netflix&apos;s hit show
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search chefs, restaurants, or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-[var(--color-text-muted)]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSeasonFilter(seasonFilter === 1 ? 'all' : 1)}
              className={`badge ${seasonFilter === 1 ? 'badge-season-1' : 'bg-white/5 text-[var(--color-text-secondary)]'}`}
            >
              Season 1
            </button>
            <button
              onClick={() => setSeasonFilter(seasonFilter === 2 ? 'all' : 2)}
              className={`badge ${seasonFilter === 2 ? 'badge-season-2' : 'bg-white/5 text-[var(--color-text-secondary)]'}`}
            >
              Season 2
            </button>
            <button
              onClick={() => setSpoonFilter(spoonFilter === 'white' ? 'all' : 'white')}
              className={`badge ${spoonFilter === 'white' ? 'badge-white-spoon' : 'bg-white/5 text-[var(--color-text-secondary)]'}`}
            >
              ⚪ White Spoon
            </button>
            <button
              onClick={() => setSpoonFilter(spoonFilter === 'black' ? 'all' : 'black')}
              className={`badge ${spoonFilter === 'black' ? 'badge-black-spoon' : 'bg-white/5 text-[var(--color-text-secondary)]'}`}
            >
              ⚫ Black Spoon
            </button>
          </div>

          <span className="ml-auto text-sm text-[var(--color-text-muted)]">
            {filteredChefs.length} chefs found
          </span>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="container pb-20">
        <div className="restaurant-grid">
          {filteredChefs.map((chef) => (
            <article key={chef.id} className="glass-card p-4 cursor-pointer group">
              {/* Chef Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary-dark)]/20 flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg truncate">
                    {chef.spoonType === 'black' && chef.nickname ? chef.nickname : chef.nameKo}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] truncate">
                    {chef.spoonType === 'black' && chef.realNameKo
                      ? chef.realNameKo
                      : chef.nameEn}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className={`badge ${chef.season === 1 ? 'badge-season-1' : 'badge-season-2'}`}>
                  S{chef.season}
                </span>
                <span className={`badge ${chef.spoonType === 'white' ? 'badge-white-spoon' : 'badge-black-spoon'}`}>
                  {chef.spoonType === 'white' ? '⚪' : '⚫'}
                </span>
                {chef.rank && (
                  <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500">
                    {chef.rank === 'Winner' ? '🏆' : '🥈'} {chef.rank}
                  </span>
                )}
                {(chef.michelin || chef.restaurants.some(r => r.michelin)) && (
                  <span className="badge badge-michelin">
                    <Star className="w-3 h-3 fill-current" /> Michelin
                  </span>
                )}
              </div>

              {/* Restaurants */}
              {chef.restaurants.length > 0 ? (
                <div className="space-y-2">
                  {chef.restaurants.slice(0, 2).map((restaurant, idx) => (
                    <div key={idx} className="p-2 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{restaurant.nameKo}</span>
                        {restaurant.michelin && (
                          <Star className="w-3 h-3 text-[var(--color-michelin)] fill-current" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{restaurant.address}</span>
                      </div>
                    </div>
                  ))}
                  {chef.restaurants.length > 2 && (
                    <p className="text-xs text-[var(--color-text-muted)] pl-2">
                      +{chef.restaurants.length - 2} more restaurants
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)] italic">
                  {chef.note || 'No restaurant listed'}
                </p>
              )}
            </article>
          ))}
        </div>

        {filteredChefs.length === 0 && (
          <div className="text-center py-20">
            <ChefHat className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No chefs found</h3>
            <p className="text-[var(--color-text-muted)]">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] py-8">
        <div className="container text-center">
          <p className="text-sm text-[var(--color-text-muted)]">
            Culinary Class War Restaurant Guide • 흑백요리사 식당 가이드
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            Not affiliated with Netflix or the show producers. Made for fans and food lovers.
          </p>
        </div>
      </footer>
    </main>
  );
}
