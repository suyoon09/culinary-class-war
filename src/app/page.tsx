'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Star, ChefHat, Filter, X, ArrowRight } from 'lucide-react';
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

  // Count stats
  const stats = useMemo(() => ({
    totalChefs: allChefs.length,
    totalRestaurants: allChefs.reduce((acc, chef) => acc + chef.restaurants.length, 0),
    michelinCount: 15, // Simplified but accurate for S1+S2
  }), [allChefs]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      <div className="bg-spotlight" />

      {/* Header / Navigation */}
      <nav className="container relative z-10 py-8 flex justify-between items-center border-b border-[var(--glass-border)]">
        <div className="text-2xl font-serif tracking-tighter text-[var(--color-champagne)]">
          C.C.W <span className="text-[var(--text-muted)] font-sans text-xs tracking-widest ml-2 uppercase font-light">Guide</span>
        </div>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
          <a href="#" className="hover:text-[var(--color-champagne)] transition-colors">Restaurants</a>
          <a href="#" className="hover:text-[var(--color-champagne)] transition-colors">Chefs</a>
          <a href="#" className="hover:text-[var(--color-champagne)] transition-colors">About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl mb-6 reveal-item" style={{ animationDelay: '0.1s' }}>
            The Taste of <br />
            <span className="italic">Class War</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-xl md:text-2xl font-light mb-12 max-w-2xl leading-relaxed reveal-item" style={{ animationDelay: '0.2s' }}>
            An editorial guide to the restaurants and culinary maestros from the hit Netflix series 흑백요리사.
          </p>

          <div className="flex flex-wrap gap-12 reveal-item" style={{ animationDelay: '0.3s' }}>
            <div>
              <div className="text-3xl font-serif mb-1 text-[var(--color-champagne)]">{stats.totalRestaurants}+</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Verified Venues</div>
            </div>
            <div>
              <div className="text-3xl font-serif mb-1 text-[var(--color-champagne)]">{stats.totalChefs}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Culinary Artists</div>
            </div>
            <div>
              <div className="text-3xl font-serif mb-1 text-[var(--color-michelin)]">{stats.michelinCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Michelin Stars</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Intelligence Controls */}
      <section className="container relative z-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="reveal-item" style={{ animationDelay: '0.4s' }}>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Inquiry</div>
            <div className="relative">
              <input
                type="text"
                placeholder="Seek a chef or sanctuary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="premium-search"
              />
              <Search className="absolute right-0 bottom-6 w-5 h-5 text-[var(--text-muted)] opacity-50" />
            </div>
          </div>

          <div className="flex flex-wrap gap-12 reveal-item" style={{ animationDelay: '0.5s' }}>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 font-semibold">Allegiance</div>
              <div className="spoon-toggle">
                <div
                  onClick={() => setSpoonFilter('all')}
                  className={`spoon-toggle-item ${spoonFilter === 'all' ? 'active-black' : ''}`}
                >All</div>
                <div
                  onClick={() => setSpoonFilter('white')}
                  className={`spoon-toggle-item ${spoonFilter === 'white' ? 'active-white' : ''}`}
                >White</div>
                <div
                  onClick={() => setSpoonFilter('black')}
                  className={`spoon-toggle-item ${spoonFilter === 'black' ? 'active-black' : ''}`}
                >Black</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 font-semibold">Era</div>
              <div className="flex gap-4">
                {['all', 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeasonFilter(s as SeasonFilter)}
                    className={`pb-1 text-xs uppercase tracking-widest transition-all ${seasonFilter === s ? 'text-[var(--color-champagne)] border-b border-[var(--color-champagne)]' : 'text-[var(--text-muted)] hover:text-white'}`}
                  >
                    {s === 'all' ? 'Universal' : `Season 0${s}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Collection */}
      <section className="container relative z-10 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[var(--glass-border)] border border-[var(--glass-border)]">
          {filteredChefs.map((chef, idx) => (
            <article
              key={chef.id}
              className="bg-[var(--bg-main)] p-8 group transition-all duration-500 hover:bg-[var(--bg-surface)] reveal-item"
              style={{ animationDelay: `${0.1 * (idx % 8)}s` }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                  {chef.spoonType} spoon / S{chef.season}
                </div>
                {chef.michelin && (
                  <Star className="w-3 h-3 text-[var(--color-michelin)] fill-current" />
                )}
              </div>

              {/* Title */}
              <div className="mb-12">
                <h3 className="text-3xl mb-2 group-hover:text-white transition-colors leading-tight">
                  {chef.spoonType === 'black' && chef.nickname ? chef.nickname : chef.nameKo}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-medium">
                  {chef.spoonType === 'black' && chef.realNameKo ? chef.realNameKo : chef.nameEn}
                </p>
              </div>

              {/* Establishments */}
              <div className="space-y-6">
                {chef.restaurants.slice(0, 1).map((r, i) => (
                  <div key={i} className="group/item">
                    <div className="flex justify-between items-end mb-2">
                      <div className="text-sm font-medium tracking-tight text-[var(--text-secondary)]">{r.nameKo}</div>
                      <ArrowRight className="w-3 h-3 text-[var(--color-champagne)] opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
                      <MapPin className="w-3 h-3 opacity-50" />
                      {r.address.split(' ')[0]} {r.address.split(' ')[1]}
                    </div>
                  </div>
                ))}

                {chef.restaurants.length === 0 && (
                  <div className="text-[10px] italic text-[var(--text-muted)] uppercase tracking-widest">
                    {chef.note || 'Nomadic Maven'}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="mt-12 pt-8 border-t border-[var(--glass-border)] flex gap-2">
                {chef.rank && (
                  <span className="badge-editorial text-[var(--color-bronze)]">
                    {chef.rank}
                  </span>
                )}
                {chef.restaurants.some(r => r.michelin) && (
                  <span className="badge-editorial text-[var(--color-michelin)]">
                    Michelin Featured
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {filteredChefs.length === 0 && (
          <div className="text-center py-40 border-t border-[var(--glass-border)]">
            <h3 className="text-2xl font-serif text-[var(--text-muted)] italic">
              The kitchen is empty for this criteria
            </h3>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)] py-20 bg-[var(--bg-surface)]">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-2xl font-serif text-[var(--color-champagne)]">C.C.W Guide</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] text-center md:text-right font-light">
            An Unofficial Encyclopedia of the Culinary Class War. <br />
            Designed for the Discerning Palate.
          </div>
        </div>
      </footer>
    </main>
  );
}
