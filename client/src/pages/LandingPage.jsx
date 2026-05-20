import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'

const MOCK_SIMULATOR_FOODS = [
  {
    id: 'mediterranean-salad',
    name: 'Vibrant Salmon & Avocado Salad Bowl',
    indianName: 'प्रीमियम मेडिटेरेनियन सलाद',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWWPzn2_Puy9pXuM5vB67SEXs6ufrGXdqyY3ABQjrZq1XcCcUk5PkGOOUnZwCxY_kMmx3H-TJphQhBK0JucHcH_cfEMiQ48jzXHqveTjnj1-viK6SOjPDn5GIBjCiPovQGmGIYFB7LSA109-YynIq0yyU2McoXxBXOuzAVyf-FmgCwMYpeYvd_Be6VhTygpxHmU766g8omGWeZ1Z76o_jwFwpqDtR0G-NkwCFr9mH5lhhNTPQW_7TTAcon9dZY63-GNyPFvDdBkNI',
    calories: 542,
    macros: { protein: 30.8, carbs: 45.2, fat: 26.4 },
    ingredients: [
      { name: 'Grilled Salmon Fillet (ग्रील्ड सैल्मन फिलेट)', quantity: '130g', calories: 240, protein: 26, carbs: 0, fat: 14.5 },
      { name: 'Fresh Avocado Slices (ताजा एवोकैडो स्लाइस)', quantity: '80g', calories: 120, protein: 1.5, carbs: 6.5, fat: 10 },
      { name: 'Pomegranate Seeds (अनार के दाने)', quantity: '50g', calories: 42, protein: 0.8, carbs: 9.2, fat: 0.1 },
      { name: 'Quinoa & Rice Base (किनोआ और चावल)', quantity: '100g', calories: 110, protein: 2.5, carbs: 23, fat: 0.8 },
      { name: 'Honey-Lemon dressing & greens (सलाद ड्रेसिंग)', quantity: '60g', calories: 30, protein: 0, carbs: 6.5, fat: 1 }
    ]
  },
  {
    id: 'paneer-thali',
    name: 'North Indian Paneer Thali',
    indianName: 'पनीर मखनी थाली',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80',
    calories: 720,
    macros: { protein: 26, carbs: 84, fat: 31 },
    ingredients: [
      { name: 'Paneer Makhani (पनीर मखनी)', quantity: '150g', calories: 280, protein: 12, carbs: 8, fat: 22 },
      { name: 'Dal Makhani (दाल मखनी)', quantity: '100g', calories: 150, protein: 6, carbs: 16, fat: 7 },
      { name: 'Jeera Rice (जीरा राइस)', quantity: '150g', calories: 200, protein: 4, carbs: 44, fat: 0.5 },
      { name: 'Butter Tandoori Roti (तंदूरी रोटी)', quantity: '1 pc (50g)', calories: 90, protein: 4, carbs: 16, fat: 1.5 }
    ]
  },
  {
    id: 'masala-dosa',
    name: 'South Indian Masala Dosa',
    indianName: 'मसाला डोसा',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    calories: 465,
    macros: { protein: 9, carbs: 68, fat: 17 },
    ingredients: [
      { name: 'Dosa Batter Base (डोसा)', quantity: '1 large pc (80g)', calories: 165, protein: 3, carbs: 32, fat: 2.5 },
      { name: 'Potato Masala filling (आलू मसाला)', quantity: '100g', calories: 180, protein: 3, carbs: 28, fat: 6 },
      { name: 'Mixed Vegetable Sambar (सांबर)', quantity: '150ml', calories: 75, protein: 2, carbs: 6, fat: 5 },
      { name: 'Coconut Chutney (नारियल चटनी)', quantity: '30g', calories: 45, protein: 1, carbs: 2, fat: 3.5 }
    ]
  },
  {
    id: 'chicken-biryani',
    name: 'Hyderabadi Chicken Biryani',
    indianName: 'चिकन बिरयानी',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    calories: 650,
    macros: { protein: 32, carbs: 78, fat: 22 },
    ingredients: [
      { name: 'Basmati Biryani Rice (बासमती चावल)', quantity: '200g', calories: 340, protein: 6, carbs: 72, fat: 2 },
      { name: 'Spiced Chicken Pieces (चिकन टिक्का)', quantity: '120g', calories: 210, protein: 24, carbs: 2, fat: 12 },
      { name: 'Fried Onions & Ghee (प्याज और घी)', quantity: '15g', calories: 75, protein: 0, carbs: 4, fat: 6.5 },
      { name: 'Mint Cucumber Raita (रायता)', quantity: '50g', calories: 25, protein: 2, carbs: 0, fat: 1 }
    ]
  }
];

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  
  // Interactive Simulator States
  const [selectedFood, setSelectedFood] = useState(MOCK_SIMULATOR_FOODS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanResult, setShowScanResult] = useState(true);

  // Intersection Observer scroll reveal & parallax floating mouse move effect
  useEffect(() => {
    // 1. Intersection Observer for scroll reveal
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Parallax effect for floating cards
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      document.querySelectorAll('[class*="floating-card"]').forEach((el, index) => {
        const factor = (index + 1) * 0.4;
        el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    // 3. Custom micro-interaction for icon scaling on glass-cards
    const glassCards = document.querySelectorAll('.glass-card');
    const hoverListeners = [];

    glassCards.forEach(card => {
      const icon = card.querySelector('.material-symbols-outlined');
      if (icon) {
        const enterHandler = () => {
          icon.style.transform = 'scale(1.2) rotate(5deg)';
          icon.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        };
        const leaveHandler = () => {
          icon.style.transform = 'scale(1) rotate(0deg)';
        };
        card.addEventListener('mouseenter', enterHandler);
        card.addEventListener('mouseleave', leaveHandler);
        hoverListeners.push({ card, enterHandler, leaveHandler });
      }
    });

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      hoverListeners.forEach(({ card, enterHandler, leaveHandler }) => {
        card.removeEventListener('mouseenter', enterHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);

  const triggerScanSimulator = (food) => {
    if (isScanning) return;
    setIsScanning(true);
    setShowScanResult(false);
    setSelectedFood(food);

    setTimeout(() => {
      setIsScanning(false);
      setShowScanResult(true);
    }, 2200);
  };

  const handleTryDemoClick = () => {
    const simulatorSection = document.getElementById('simulator');
    if (simulatorSection) {
      simulatorSection.scrollIntoView({ behavior: 'smooth' });
      triggerScanSimulator(MOCK_SIMULATOR_FOODS[0]);
    }
  };

  return (
    <div className="font-body-md text-body-md selection:bg-primary/30 selection:text-primary min-h-screen bg-black text-[#e5e2e1] relative overflow-x-hidden">
      {/* Neural Background Layer */}
      <div className="neural-bg"></div>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-6 md:px-margin-desktop py-4 bg-surface/60 backdrop-blur-20 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-8">
          <Link className="font-headline-md text-headline-md font-bold tracking-tight text-primary" to="/">MacroMind</Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1" to="/">Home</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to={isAuthenticated ? "/dashboard" : "/login"}>Dashboard</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" to={isAuthenticated ? "/scanner" : "/login"}>Scanner</Link>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-on-surface transition-colors" href="#simulator">Simulator</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to={isAuthenticated ? "/profile" : "/login"} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">account_circle</Link>
          {isAuthenticated ? (
            <Link className="hidden md:block px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md glow-primary transition-all duration-300 active:scale-95 text-center font-bold" to="/dashboard">
              Console Dashboard
            </Link>
          ) : (
            <Link className="hidden md:block px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md glow-primary transition-all duration-300 active:scale-95 text-center font-bold" to="/signup">
              Get Started
            </Link>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col justify-center px-6 md:px-margin-desktop py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center container-max mx-auto">
            <div className="z-20">
              <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight">
                Snap Your Food. <br/>
                <span className="text-primary">Instantly Know</span> <br/>
                Calories &amp; Nutrition.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
                AI-powered food recognition with real-time calorie tracking. Simply take a photo and let our Architectural Intelligence dissect your macros with surgical precision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={isAuthenticated ? "/scanner" : "/signup"} className="px-8 py-4 rounded-xl shimmer-btn text-on-primary font-headline-md text-label-md glow-primary transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden font-bold">
                  <span className="material-symbols-outlined">upload_file</span>
                  Upload Photo
                </Link>
                <button onClick={handleTryDemoClick} className="px-8 py-4 rounded-xl glass-card text-on-surface font-headline-md text-label-md transition-all duration-300 hover:scale-105 flex items-center gap-2 font-bold border border-white/10">
                  <span className="material-symbols-outlined">play_circle</span>
                  Try Demo
                </button>
              </div>
            </div>
            
            <div className="relative group">
              {/* Main Food Image with Scanning Overlay */}
              <div className="relative rounded-3xl overflow-hidden glass-card p-2 border border-white/5 shadow-2xl">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <div className="scanning-line"></div>
                  <img className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="Mediterranean salad bowl featuring avocado slices, pomegranate seeds, and grilled salmon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWWPzn2_Puy9pXuM5vB67SEXs6ufrGXdqyY3ABQjrZq1XcCcUk5PkGOOUnZwCxY_kMmx3H-TJphQhBK0JucHcH_cfEMiQ48jzXHqveTjnj1-viK6SOjPDn5GIBjCiPovQGmGIYFB7LSA109-YynIq0yyU2McoXxBXOuzAVyf-FmgCwMYpeYvd_Be6VhTygpxHmU766g8omGWeZ1Z76o_jwFwpqDtR0G-NkwCFr9mH5lhhNTPQW_7TTAcon9dZY63-GNyPFvDdBkNI"/>
                </div>
              </div>
              
              {/* Floating Macro Cards */}
              <div className="absolute -top-10 -right-4 md:-right-10 floating-card-1">
                <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary">nutrition</span>
                    <span className="text-label-md font-label-md text-on-surface-variant">Carbs</span>
                  </div>
                  <div className="text-headline-md font-headline-md text-on-surface font-mono">45.2g</div>
                  <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary w-[65%]"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-4 md:-left-10 floating-card-2">
                <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-secondary">fitness_center</span>
                    <span className="text-label-md font-label-md text-on-surface-variant">Protein</span>
                  </div>
                  <div className="text-headline-md font-headline-md text-on-surface font-mono">30.8g</div>
                  <div className="w-24 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-secondary w-[82%]"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-20 floating-card-3 hidden xl:block">
                <div className="glass-card p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                  </div>
                  <div>
                    <div className="text-label-md font-label-md text-on-surface-variant">Energy</div>
                    <div className="text-headline-md font-headline-md text-on-surface font-mono">542 kcal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10"></div>
        </section>

        {/* How it Works */}
        <section className="py-32 px-6 md:px-margin-desktop bg-surface-container-lowest overflow-hidden">
          <div className="container-max mx-auto">
            <div className="text-center mb-20 reveal">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">Precision Engineering</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Our workflow combines computer vision with clinical-grade nutritional databases to give you the most accurate data possible.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden group reveal" style={{ transitionDelay: '100ms' }}>
                <div className="absolute -right-4 -top-4 text-primary/10 font-bold text-9xl font-mono select-none">01</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Visual Input</h3>
                <p className="text-on-surface-variant font-body-md leading-relaxed">Capture or upload any meal. Our AI recognizes volume, ingredients, and hidden components with 98% accuracy.</p>
              </div>
              
              {/* Step 2 */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden group reveal" style={{ transitionDelay: '200ms' }}>
                <div className="absolute -right-4 -top-4 text-primary/10 font-bold text-9xl font-mono select-none">02</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <h3 class="font-headline-md text-headline-md text-on-surface mb-4">Neural Analysis</h3>
                <p className="text-on-surface-variant font-body-md leading-relaxed">Multi-layer neural networks cross-reference your meal against 5 million verified food items globally.</p>
              </div>
              
              {/* Step 3 */}
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden group reveal" style={{ transitionDelay: '300ms' }}>
                <div className="absolute -right-4 -top-4 text-primary/10 font-bold text-9xl font-mono select-none">03</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">dashboard_customize</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Instant Insight</h3>
                <p className="text-on-surface-variant font-body-md leading-relaxed">Get a complete breakdown of macros, micros, and glycemic load in less than 3 seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Simulator View (directly resolving user request) */}
        <section id="simulator" className="py-32 px-6 md:px-margin-desktop bg-black scroll-mt-20">
          <div className="container-max mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 reveal">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                Experience the Intelligence
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Interactive AI Scanner Simulator
              </h2>
              <p className="text-on-surface-variant font-body-lg max-w-xl mx-auto leading-relaxed">
                Click one of the authentic meals below to run our visual food recognizer live. Watch it map complex recipes, exact weights, and correct Indian names.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left: Food Selector & Scan Viewport */}
              <div className="lg:col-span-7 space-y-6">
                <div className="glass-card p-2 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center">
                    <img 
                      src={selectedFood.image} 
                      alt={selectedFood.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${isScanning ? 'blur-sm scale-105 brightness-50' : 'brightness-90'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Scanning Animation line overlay */}
                    {isScanning && (
                      <>
                        <div className="scanning-line absolute top-0 left-0 w-full z-20" />
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        <div className="flex flex-col items-center justify-center gap-3 z-30 absolute">
                          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          <span className="text-xs uppercase font-bold text-primary tracking-widest bg-black/80 px-4 py-1.5 rounded-full backdrop-blur-md">
                            Analyzing Pixels...
                          </span>
                        </div>
                      </>
                    )}

                    {/* Bounding box mock indicators when scan is successful */}
                    {!isScanning && showScanResult && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[15%] left-[8%] w-[45%] h-[65%] border-2 border-dashed border-primary/60 rounded-2xl shadow-[0_0_20px_rgba(78,222,163,0.2)]">
                          <span className="absolute -top-5 left-2 bg-primary text-black font-extrabold uppercase text-[9px] px-2 py-0.5 rounded">
                            {selectedFood.indianName}
                          </span>
                        </div>
                        <div className="absolute top-[40%] left-[55%] w-[38%] h-[40%] border-2 border-dashed border-secondary/60 rounded-2xl shadow-[0_0_20px_rgba(173,198,255,0.2)]">
                          <span className="absolute -top-5 left-2 bg-secondary text-black font-extrabold uppercase text-[9px] px-2 py-0.5 rounded">
                            Portion Verified
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Image title overlay */}
                    <div className="absolute bottom-4 left-6 z-10 text-left">
                      <p className="text-xs font-bold text-primary tracking-widest uppercase font-mono">{selectedFood.indianName}</p>
                      <h3 className="text-xl font-bold text-on-surface">{selectedFood.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Selection Pills */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MOCK_SIMULATOR_FOODS.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => triggerScanSimulator(food)}
                      disabled={isScanning}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all ${
                        selectedFood.id === food.id
                          ? 'bg-primary/15 border-primary/45 shadow-[0_0_15px_rgba(78,222,163,0.15)] text-on-surface'
                          : 'glass-card border-white/5 text-on-surface-variant hover:border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs font-bold tracking-tight truncate max-w-full">{food.name}</span>
                      <span className="text-[10px] font-bold text-primary/80 mt-1 uppercase tracking-wider truncate max-w-full font-sans">
                        {food.indianName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Rich AI breakdown Panel */}
              <div className="lg:col-span-5">
                {showScanResult && !isScanning ? (
                  <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden text-left">
                    {/* Background glow overlay */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[40px]" />
                    
                    {/* Header */}
                    <div className="border-b border-white/5 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-primary tracking-widest font-mono">
                          Scan Verified (सत्यापित)
                        </span>
                        <span className="text-xs font-mono font-bold text-on-surface-variant/80">
                          Qty: ~400g Total
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-on-surface mt-1">
                        {selectedFood.name}
                      </h3>
                      <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 mt-1 font-sans">
                        <span className="material-symbols-outlined text-secondary text-sm">restaurant</span>
                        Traditional Recipe: <span className="text-secondary font-bold font-sans">{selectedFood.indianName}</span>
                      </p>
                    </div>

                    {/* Total Calorie capsule */}
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-2xl">bolt</span>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-mono">Total Energy</p>
                          <p className="text-lg font-black text-on-surface font-mono">{selectedFood.calories} kcal</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-black/40 text-primary border border-primary/25 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                        98% True Estim.
                      </span>
                    </div>

                    {/* Macro Bento Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="glass-card p-3 rounded-2xl text-center border border-white/5 hover:transform-none">
                        <p className="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-wider">Protein (प्रोटिन)</p>
                        <p className="text-base font-black text-secondary mt-1 font-mono">{selectedFood.macros.protein}g</p>
                        <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: `${(selectedFood.macros.protein / 50) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="glass-card p-3 rounded-2xl text-center border border-white/5 hover:transform-none">
                        <p className="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-wider">Carbs (कार्ब्स)</p>
                        <p className="text-base font-black text-primary mt-1 font-mono">{selectedFood.macros.carbs}g</p>
                        <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(selectedFood.macros.carbs / 120) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="glass-card p-3 rounded-2xl text-center border border-white/5 hover:transform-none">
                        <p className="text-[9px] uppercase font-bold text-on-surface-variant/60 tracking-wider">Fat (वसा)</p>
                        <p className="text-base font-black text-tertiary mt-1 font-mono">{selectedFood.macros.fat}g</p>
                        <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-tertiary" style={{ width: `${(selectedFood.macros.fat / 60) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Ingredient list and estimated quantities */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5 font-mono">
                        <span className="material-symbols-outlined text-primary text-base">list</span>
                        Dissected Ingredients &amp; Quantities
                      </h4>
                      <div className="space-y-2 font-mono text-xs text-on-surface-variant">
                        {selectedFood.ingredients.map((ing, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="truncate max-w-[65%] font-sans font-medium text-on-surface text-xs">
                              {ing.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">{ing.quantity}</span>
                              <span className="text-primary font-bold">{ing.calories} kcal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center aspect-[16/13] hover:transform-none">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                    <h4 className="font-bold text-on-surface text-base">Waiting for Scan Pipeline</h4>
                    <p className="text-xs text-on-surface-variant max-w-xs mt-2 leading-relaxed">
                      Our system is running computer vision modeling on the meal colors, boundaries, and textures.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Science-Backed Metabolic Benefits */}
        <section className="py-32 px-6 md:px-margin-desktop bg-surface-container-lowest">
          <div className="container-max mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4 reveal">
              <span className="px-3 py-1 rounded-full bg-secondary/15 border border-secondary/20 text-secondary text-xs font-semibold uppercase tracking-wider">
                Health & Physiology
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Science-Backed Metabolic Benefits
              </h2>
              <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto leading-relaxed">
                Tracking your nutrients with MacroMind is not just about weight loss. By tracking correct portion ratios, you unlock systemic cardiovascular and metabolic advantages.
              </p>
            </div>

            {/* Bento grid health cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {/* Benefit 1: Glucose Control */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all duration-300 group reveal">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-primary text-xl">pulse</span>
                  </div>
                  <h3 className="font-headline-md text-base text-on-surface font-bold leading-snug">
                    Insulin Sensitivity & Glucose Control
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Pacing simple carbohydrates with lean proteins and active fibers prevents steep blood sugar spikes. Stabilizes energy levels and prevents post-meal fatigue.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] uppercase font-bold text-primary flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">check_circle</span> Stabilizes Energy
                </div>
              </div>

              {/* Benefit 2: Heart Health */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all duration-300 group reveal" style={{ transitionDelay: '100ms' }}>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-secondary text-xl">favorite</span>
                  </div>
                  <h3 className="font-headline-md text-base text-on-surface font-bold leading-snug">
                    Arterial Flexibility & Cardio Care
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Tracking polyunsaturated fats and limiting saturated oils helps manage LDL/HDL ratios. Supports coronary health and prevents endothelial thickening.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] uppercase font-bold text-secondary flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">check_circle</span> Cardio Shielding
                </div>
              </div>

              {/* Benefit 3: Muscle & Metabolism */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-tertiary/20 transition-all duration-300 group reveal" style={{ transitionDelay: '200ms' }}>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center border border-tertiary/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-tertiary text-xl">bolt</span>
                  </div>
                  <h3 className="font-headline-md text-base text-on-surface font-bold leading-snug">
                    Muscle Synthesis & High Metabolism
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Consistent amino-acid monitoring facilitates lean tissue recovery and skeletal synthesis. Increases your Basal Metabolic Rate (BMR) for effortless calorie management.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] uppercase font-bold text-tertiary flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">check_circle</span> Muscle Synthesis
                </div>
              </div>

              {/* Benefit 4: Gut Health */}
              <div className="glass-card p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-error/20 transition-all duration-300 group reveal" style={{ transitionDelay: '300ms' }}>
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center border border-error/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-error text-xl">nutrition</span>
                  </div>
                  <h3 className="font-headline-md text-base text-on-surface font-bold leading-snug">
                    Gut Microbiome & Digest Synergy
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Monitoring soluble fibers encourages active cultivation of healthy bacteria in the digestive tract. Optimizes food extraction and reinforces immune response.
                  </p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6 text-[10px] uppercase font-bold text-error flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">check_circle</span> Digest Synergy
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Bento Grid */}
        <section className="py-32 px-6 md:px-margin-desktop bg-black">
          <div className="container-max mx-auto">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="reveal">
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">The Premium Suite</h2>
                <p className="text-on-surface-variant max-w-xl font-body-lg leading-relaxed">Unlock the full potential of your metabolic health with advanced AI nutrition tools.</p>
              </div>
              <button onClick={handleTryDemoClick} className="px-8 py-3 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all font-label-md font-bold">
                Explore All Features
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
              {/* Large Card: Analytics */}
              <div className="md:col-span-2 md:row-span-2 glass-card p-10 rounded-3xl flex flex-col justify-between group overflow-hidden relative reveal">
                <div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-label-md text-xs mb-6 inline-block font-bold">ADVANCED DATA</span>
                  <h3 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface mb-4">Deep Analytics</h3>
                  <p className="text-on-surface-variant font-body-lg leading-relaxed">Track trends over months with interactive heatmaps and metabolic correlation charts.</p>
                </div>
                <div className="mt-8 relative h-40">
                  <img className="w-full h-full object-cover rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" alt="Futuristic dashboard interface showing emerald green line graph and circular progress indicators" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI3njVXmoHIbrqIPxCrOwaNwH4JQEkDvOmGGyfIz1ztQMkaiSSFjucaZxZQytWzjuk6EhWxJFbAOAZzG93euQEVnrJyoUSqCNi0zjF-7aOQlPDs5XMOpxXwSMo41molcVN2qgA7Ryqv20f7ygQBhmG60X_TKu_ULhcXMGbRbrbvft-Oq9uznFey_PyKZ-DxR1iEG3NXCilJcHPXzbRvNaf5zh3bNqAxU7ACC_z898FWJLGiF4N-NCItMEzP3pU8xMR3LJADIAlUI4"/>
                </div>
              </div>
              
              {/* Wide Card: Recipes */}
              <div className="md:col-span-2 glass-card p-8 rounded-3xl flex items-center gap-8 group reveal">
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">AI Recipe Forge</h3>
                  <p className="text-on-surface-variant font-body-md leading-relaxed">Generate custom meals based on the ingredients you have and your macro goals.</p>
                </div>
                <div className="w-24 h-24 rounded-2xl bg-on-tertiary-container/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-tertiary-container text-4xl">auto_fix_high</span>
                </div>
              </div>
              
              {/* Small Card 1 */}
              <div className="glass-card p-8 rounded-3xl group reveal" style={{ transitionDelay: '100ms' }}>
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">devices</span>
                </div>
                <h3 className="font-label-md text-on-surface font-bold mb-2">Sync Anywhere</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Apple Health, Google Fit, and Garmin integration.</p>
              </div>
              
              {/* Small Card 2 */}
              <div className="glass-card p-8 rounded-3xl group reveal" style={{ transitionDelay: '200ms' }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                </div>
                <h3 className="font-label-md text-on-surface font-bold mb-2">Expert Coaching</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Human verified logs for athletes and clinical users.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-margin-desktop bg-black">
          <div className="container-max mx-auto rounded-[40px] bg-gradient-to-br from-primary-container/20 to-secondary-container/10 border border-white/5 p-12 md:p-24 text-center relative overflow-hidden reveal">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface mb-8 relative z-10">Start Tracking Smarter Today.</h2>
            <p className="text-on-surface-variant font-body-lg mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">Join 500,000+ biohackers and health enthusiasts optimizing their nutrition with MacroMind AI.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="px-10 py-5 rounded-full shimmer-btn text-on-primary font-headline-md text-label-md glow-primary hover:scale-105 transition-all font-bold text-center">
                Get Unlimited Access
              </Link>
              <Link to={isAuthenticated ? "/scanner" : "/login"} className="px-10 py-5 rounded-full glass-card text-on-surface font-headline-md text-label-md hover:scale-105 transition-all font-bold border border-white/10 text-center">
                Try AI Scanner
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-6 md:px-margin-desktop bg-surface-container-lowest border-t border-white/5 text-left font-sans text-xs">
        <div className="container-max mx-auto grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-start gap-12">
          <div>
            <Link className="font-headline-md text-headline-md font-bold text-on-surface mb-4 block" to="/">MacroMind</Link>
            <p className="text-on-surface-variant font-body-md max-w-xs leading-relaxed">Computational nutrition for the modern era. Architectural Intelligence at your fingertips.</p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div>
              <h4 className="text-on-surface font-label-md mb-6 tracking-widest uppercase text-xs font-bold font-mono">Product</h4>
              <ul className="space-y-4">
                <li><Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md" to="/dashboard">Dashboard</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md" to="/scanner">AI Scanner</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary transition-colors font-body-md" to="/history">Meal History</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-on-surface font-label-md mb-6 tracking-widest uppercase text-xs font-bold font-mono">Legal</h4>
              <ul className="space-y-4">
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Privacy Policy</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Terms of Service</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-on-surface font-label-md mb-6 tracking-widest uppercase text-xs font-bold font-mono">Contact</h4>
              <ul className="space-y-4">
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Support</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Sales</a></li>
                <li><a className="text-on-surface-variant hover:text-primary transition-colors font-body-md" href="#">Twitter/X</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="container-max mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant font-label-md text-sm">© 2026 MacroMind AI. Computational Nutrition.</p>
          <div className="flex gap-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">language</span></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
