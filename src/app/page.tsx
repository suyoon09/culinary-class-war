'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Star, ChefHat, Filter, X, ArrowUpRight } from 'lucide-react';
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

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Dynamic Header */}
      <nav className="fixed top-0 left-0 w-full z-50 glass border-b-0 py-6 px-10 flex justify-between items-center group">
        <div className="text-xl tracking-tighter font-black uppercase">
          CCW <span className="font-extralight text-white/30 tracking-widest ml-1">COLLECTIVE</span>
        </div>
        <div className="flex gap-10">
          <button onClick={() => setSearchQuery('')} className="text-[10px] font-bold tracking-widest uppercase hover:text-white/50 transition-colors">Archive</button>
          <button className="text-[10px] font-bold tracking-widest uppercase hover:text-white/50 transition-colors">About</button>
          <button className="text-[10px] font-bold tracking-widest uppercase border border-white/20 px-4 py-1.5 hover:bg-white hover:text-black transition-all">Sign Up</button>
        </div>
      </nav>

      {/* Hero Search Section */}
      <section className="pt-52 pb-32 px-10">
        <div className="max-w-6xl">
          <div className="text-duel-sub mb-4">Inquiry / Protocol</div>
          <input
            type="text"
            placeholder="Search the Collective"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="duel-search reveal"
          />

          <div className="mt-20 flex flex-wrap items-end gap-20 reveal" style={{ animationDelay: '0.2s' }}>
            <div>
              <div className="text-duel-sub mb-4">Spoon Origin</div>
              <div className="duel-toggle w-64">
                <div
                  onClick={() => setSpoonFilter('all')}
                  className={`duel-toggle-item ${spoonFilter === 'all' ? 'active-white' : ''}`}
                >ALL</div>
                <div
                  onClick={() => setSpoonFilter('white')}
                  className={`duel-toggle-item ${spoonFilter === 'white' ? 'active-white' : ''}`}
                >WHITE</div>
                <div
                  onClick={() => setSpoonFilter('black')}
                  className={`duel-toggle-item ${spoonFilter === 'black' ? 'active-white' : ''}`}
                >BLACK</div>
              </div>
            </div>

            <div>
              <div className="text-duel-sub mb-4">Season Era</div>
              <div className="flex gap-6">
                {['all', 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeasonFilter(s as SeasonFilter)}
                    className={`text-xl font-black uppercase tracking-tighter transition-all ${seasonFilter === s ? 'text-white border-b-4 border-white' : 'text-white/20 hover:text-white/50'}`}
                  >
                    {s === 'all' ? 'Universal' : `S.0${s}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto text-duel-sub text-right">
              Showing {filteredChefs.length} / {allChefs.length} results
            </div>
          </div>
        </div>
      </section>

      {/* Grid Architecture */}
      <section className="px-10 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-white/10">
          {filteredChefs.map((chef, idx) => (
            <article
              key={chef.id}
              className="chef-card reveal bg-black hover:bg-white/[0.03] transition-all duration-700"
              style={{ animationDelay: `${0.05 * (idx % 12)}s` }}
            >
              <div className="chef-card-border" />
              <div className="chef-card-bottom" />

              <div className="flex justify-between items-start mb-20">
                <div className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 border ${chef.spoonType === 'white' ? 'bg-white text-black border-white' : 'text-white border-white/30'}`}>
                  {chef.spoonType}
                </div>
                <div className="text-[9px] font-bold text-white/30 tracking-widest uppercase">
                  No. 00{idx + 1} / S0{chef.season}
                </div>
              </div>

              <div className="mb-auto">
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:tracking-normal transition-all duration-700">
                  {chef.spoonType === 'black' && chef.nickname ? chef.nickname : chef.nameKo}
                </h3>
                <div className="text-duel-sub text-white/40">
                  {chef.spoonType === 'black' && chef.realNameKo ? chef.realNameKo : chef.nameEn}
                </div>
              </div>

              <div className="mt-20 space-y-8">
                {chef.restaurants.slice(0, 1).map((r, i) => (
                  <div key={i} className="flex justify-between items-end group/item cursor-pointer">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase mb-1">{r.nameKo}</div>
                      <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest">
                        <MapPin className="w-2.5 h-2.5" />
                        {r.address.split(' ').slice(0, 2).join(' ')}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover/item:text-white transition-colors" />
                  </div>
                ))}

                {chef.restaurants.length === 0 && (
                  <div className="text-[10px] font-bold tracking-widest uppercase text-white/20">Operational Nomadic</div>
                )}
              </div>

              {/* Accolades */}
              <div className="mt-12 flex flex-wrap gap-2">
                {chef.rank && (
                  <div className="text-[8px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 px-2 py-0.5">
                    {chef.rank}
                  </div>
                )}
                {(chef.michelin || chef.restaurants.some(r => r.michelin)) && (
                  <div className="text-[8px] font-bold tracking-widest uppercase bg-red-600 text-white px-2 py-0.5">
                    Michelin
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="p-20 border-t border-white/5 bg-black flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-4xl font-black tracking-tighter uppercase opacity-20">CCW. COLLECTIVE</div>
        <div className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/20 text-center md:text-right">
          A decentralized encyclopedia of the culinary class war. <br />
          All data verified for season i and ii.
        </div>
      </footer>
    </main>
  );
}
