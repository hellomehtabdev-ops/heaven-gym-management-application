import { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Search,
  ShoppingBag,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import SectionDivider from '@/components/public/SectionDivider';
import { addToCart } from '@/redux/slices/cartSlice';
import { fetchProducts, fetchCategories } from '@/redux/slices/productSlice';
import { formatCurrency } from '@/utils/formatters';

export default function Store() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);
  const categories = useSelector((state) => state.products.categories);
  const loading = useSelector((state) => state.products.loading);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [added, setAdded] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchesCategory =
          !category ||
          (p.category_id?._id || p.category_id?.id || p.category_id) === category;
        const matchesSearch =
          !search || p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [products, category, search]
  );

  function add(product) {
    dispatch(addToCart(product));
    setAdded(product.id);
    setTimeout(() => setAdded(''), 1400);
  }

  return (
    <div className="bg-[#070709] text-white selection:bg-brand-500 selection:text-white min-h-screen">
      {/* =========================================================================
          STORE HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden pt-36 pb-16 lg:pt-44 lg:pb-24 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1920&q=80"
            alt="Heaven Gym Supplements & Gear"
            className="h-full w-full object-cover filter brightness-[0.2] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent" />
          <div className="absolute -top-20 right-10 h-72 w-72 rounded-full bg-brand-600/20 blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <ScrollReveal animation="fade-down">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400 backdrop-blur-md">
                  <Sparkles size={13} /> Official Pro Store
                </span>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={150}>
                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-tight">
                  FUEL YOUR WORK. <br />
                  <span className="public-text-crimson-gradient">CERTIFIED NUTRITION.</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={250}>
                <p className="mt-4 text-base text-surface-300 leading-relaxed max-w-xl">
                  Tested supplements, premium whey isolates, creatine compounds, and athlete gear curated directly by the Heaven Gym training staff.
                </p>
              </ScrollReveal>
            </div>

            {/* Cart quick access pill */}
            <ScrollReveal animation="fade-left" delay={200}>
              <Link to="/user/cart">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-xl transition hover:border-brand-500 hover:bg-brand-500/10 group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wider text-surface-400">
                      Your Shopping Cart
                    </p>
                    <p className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors">
                      {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} Ready
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-surface-400 group-hover:text-white group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </ScrollReveal>
          </div>

          {/* Value Badges */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-6 text-xs text-surface-400 font-mono">
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" /> 100% Genuine Brands
            </span>
            <span className="flex items-center gap-2">
              <Zap size={16} className="text-amber-400" /> Direct Counter Pickup
            </span>
            <span className="flex items-center gap-2">
              <Package size={16} className="text-sky-400" /> Climate Controlled Storage
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-400" /> Coach Approved Formulas
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CATALOG CONTROLS: SEARCH & CATEGORIES
          ========================================================================= */}
      <section className="py-8 bg-ink-950/90 border-b border-white/5 sticky top-[68px] z-30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                size={18}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search supplements, proteins, gear..."
                className="w-full rounded-xl border border-white/10 bg-black/50 py-3 pl-11 pr-4 text-sm text-white placeholder-surface-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition ${
                  !category
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                All Products ({products.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id || cat._id}
                  type="button"
                  onClick={() => setCategory(cat.id || cat._id)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition ${
                    category === (cat.id || cat._id)
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PRODUCT GRID
          ========================================================================= */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {loading ? (
            <div className="py-24 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-surface-400 font-mono">Loading store inventory...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((product) => {
                const imgUrl = product.image_url || product.images?.[0]?.url;
                const isAdded = added === product.id;
                const price = product.sale_price || product.price;

                return (
                  <ScrollReveal key={product.id} animation="fade-up">
                    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500 hover:-translate-y-1 shadow-md h-full">
                      <div>
                        {/* Image Canvas */}
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-black/40 p-6 overflow-hidden relative border border-white/5">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <ShoppingBag size={54} className="text-brand-500/40" />
                          )}

                          {product.sale_price && (
                            <span className="absolute top-3 right-3 rounded bg-brand-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                              Special Price
                            </span>
                          )}
                        </div>

                        {/* Product Meta */}
                        <div className="mt-4">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                            {product.category_id?.name || product.brand || 'Nutrition'}
                          </p>

                          <h3 className="mt-1 font-display text-base font-bold text-white line-clamp-2 min-h-[44px] group-hover:text-brand-400 transition-colors">
                            {product.name}
                          </h3>

                          {product.description && (
                            <p className="mt-1 text-xs text-surface-400 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-display text-xl font-black text-white">
                              {formatCurrency(price)}
                            </span>
                            {product.sale_price && (
                              <span className="text-xs text-surface-400 line-through font-mono">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="mt-5 pt-3 border-t border-white/10">
                        <Button
                          onClick={() => add(product)}
                          className={`w-full text-xs font-bold uppercase tracking-wider py-3 transition-all duration-200 ${
                            isAdded
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20'
                          }`}
                        >
                          {isAdded ? (
                            <span className="flex items-center justify-center gap-1.5">
                              <Check size={16} strokeWidth={3} /> Added To Cart
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1.5">
                              <ShoppingBag size={15} /> Add To Cart
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-surface-400 mb-4">
                <Filter size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">No products found</h3>
              <p className="mt-2 text-xs text-surface-400 leading-relaxed">
                No items match your active search or category filter. Try clearing your query to browse all available supplements.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                }}
                className="mt-5 inline-block text-xs font-mono font-bold text-brand-400 hover:underline uppercase tracking-wider"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
