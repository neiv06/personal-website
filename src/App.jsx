import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, MapPin, FileText } from 'lucide-react';
import profileImage from './images/headshot.JPG';
import cudaFireImage from './images/CudaFire.png';
import bruinMarketImage from './images/BruinMarket.png';
import yumImage from './images/YUM.png';
import stairmastersImage from './images/Stairmasters.png';
import './App.css';

const resume = `${import.meta.env.BASE_URL}Neiv_Gupta_Resume.pdf`;
const stravaProfileUrl = 'https://www.strava.com/athletes/2047652902';
const spotifyProfileUrl = 'https://open.spotify.com/user/uhvto2o8rz5yv89376o7y1noi';

const sections = ['home', 'introduction', 'experiences', 'projects', 'skills', 'interests', 'contact'];

const Reveal = ({ children, className = '', delay = 0, asHeading = false }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-visible', entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${asHeading ? 'reveal-heading' : 'reveal'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const RouteMap = ({ points }) => {
  if (!points || points.length < 2) return null;

  const width = 240;
  const height = 120;
  const padding = 10;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const latRange = Math.max(...lats) - Math.min(...lats) || 1;
  const lngRange = Math.max(...lngs) - Math.min(...lngs) || 1;
  const minLat = Math.min(...lats);
  const minLng = Math.min(...lngs);

  const scale = Math.min(
    (width - padding * 2) / lngRange,
    (height - padding * 2) / latRange
  );
  const offsetX = (width - lngRange * scale) / 2;
  const offsetY = (height - latRange * scale) / 2;

  const path = points
    .map(([lat, lng], i) => {
      const x = offsetX + (lng - minLng) * scale;
      const y = height - (offsetY + (lat - minLat) * scale);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="route-map" aria-label="Route map outline" role="img">
      <path d={path} fill="none" stroke="#C4A484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StravaIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
  </svg>
);

const SpotifyIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.719-.66 13.439 1.621.361.181.54.78.301 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const Soundwave = ({ active }) => (
  <span className={`soundwave ${active ? 'is-playing' : ''}`} aria-hidden="true">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </span>
);

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false);
  const [cookingSlide, setCookingSlide] = useState(0);
  const [cookingWindowHeight, setCookingWindowHeight] = useState(null);
  const cookingTrackRef = useRef(null);
  const [strava, setStrava] = useState({ status: 'loading' });
  const [spotify, setSpotify] = useState({ status: 'loading' });
  const idleTimerRef = useRef(null);
  const experienceTimelineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setShowTimeline(y > 40);

      const timeline = experienceTimelineRef.current;
      if (timeline) {
        const timelineRect = timeline.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (window.innerHeight * 0.7 - timelineRect.top) / timelineRect.height)
        );
        const fillableHeight = Math.max(0, timeline.offsetHeight - 24);
        timeline.style.setProperty('--timeline-fill-height', `${progress * fillableHeight}px`);
      }

      if (y <= 40) {
        setShowScrollHint(true);
        clearTimeout(idleTimerRef.current);
      } else {
        setShowScrollHint(false);
      }

      const viewportMid = y + window.innerHeight / 3;
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= viewportMid) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const onActivity = () => {
      if (window.scrollY <= 40) {
        setShowScrollHint(true);
        clearTimeout(idleTimerRef.current);
        return;
      }

      setShowScrollHint(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowScrollHint(true), 2200);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'];
    events.forEach((event) => window.addEventListener(event, onActivity, { passive: true }));

    return () => {
      events.forEach((event) => window.removeEventListener(event, onActivity));
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const activeCard = cookingTrackRef.current?.children[cookingSlide];
    if (!activeCard) return;

    const updateHeight = () => {
      setCookingWindowHeight(activeCard.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(activeCard);
    return () => observer.disconnect();
  }, [cookingSlide]);

  useEffect(() => {
    let cancelled = false;

    const loadStrava = async () => {
      try {
        const res = await fetch('/api/strava');
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        if (!cancelled) setStrava({ status: 'ready', data });
      } catch {
        if (!cancelled) setStrava({ status: 'error' });
      }
    };

    const loadSpotify = async () => {
      try {
        const res = await fetch('/api/spotify');
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        if (!cancelled) setSpotify({ status: 'ready', data });
      } catch {
        if (!cancelled) setSpotify({ status: 'error' });
      }
    };

    loadStrava();
    loadSpotify();
    const spotifyInterval = setInterval(loadSpotify, 30_000);

    return () => {
      cancelled = true;
      clearInterval(spotifyInterval);
    };
  }, []);

  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "Pairwise Technologies",
      location: "Los Angeles, CA",
      period: "June 2026 – Present",
      description: "Built Django backend services and a semantic-and-lexical deduplication pipeline, and engineered FastMCP and OAuth CIMD integrations for Claude Connector workflows."
    },
    {
      title: "Undergraduate Student Researcher",
      company: "UCLA Computational Machine Learning Laboratory",
      location: "Los Angeles, CA",
      period: "May 2026 – Present",
      description: "Researching audio-LLM defense robustness against harmful and adversarial queries by developing PGD-optimized perturbations and an attack-aware defense foundation."
    },
    {
      title: "Software Engineering Intern",
      company: "ThinkScan Technologies",
      location: "Pleasanton, CA",
      period: "Apr. 2025 – Sep. 2025",
      description: "Developed an object-detection and scene-reasoning AI agent for defense threat detection, pairing FAISS and CLIP retrieval with image preprocessing for reliable field inference."
    },
    {
      title: "Computer Vision Student Researcher",
      company: "Argonne National Laboratory",
      location: "Lemont, IL",
      period: "June 2024 – Aug. 2024",
      description: "Developed TensorFlow, PyTorch, and CLIP computer-vision pipelines for wildfire and drought monitoring, including a zero-shot model that achieved 93% mAP."
    },
    {
      title: "Geographic Information Systems Intern",
      company: "Northern Change Research Laboratory, Brown University",
      location: "Providence, RI",
      period: "Apr. 2023 – Aug. 2024",
      description: "Applied ResNet-50 transfer learning to Sentinel-2 imagery and built geospatial data pipelines that produced 15K+ labeled samples for glacial ice-loss and sea-level-rise research."
    }
  ];

  const projects = [
    {
      title: "CudaFire",
      description: "GPU-accelerated wildfire spread simulator using CUDA and Rothermel fire behavior model. Processed 8.7 million terrain cells in parallel using 8-connected cellular automaton on RTX 3080, achieving 7,643× real-time simulation performance. Integrated GeoTIFF terrain ingestion via GDAL and real-time OpenGL 3D visualization pipeline. Worked on this so I could learn how CUDA works and I've always been interested in wildfire mitigation research.",
      tags: ["CUDA", "C++17", "C","CMake", "GDAL", "OpenGL", "GPU Computing"],
      image: cudaFireImage,
      github: "https://www.github.com/neiv06/CudaFire",
      demo: "https://docs.google.com/presentation/d/1WCsvc8KwYqlWda7qSRX8m6OD9evagoQ5LCFSYURKPXo/edit?usp=sharing"
    },
    {
      title: "BruinMarket",
      description: "Full-stack UCLA-exclusive student marketplace with real-time peer-to-peer transactions and messaging. Architected backend using Go with PostgreSQL database, JWT authentication, and email verification. Deployed production app on Railway and Vercel with custom domain configuration and CI/CD pipeline.",
      tags: ["Go", "React", "PostgreSQL", "WebSockets", "Docker", "Railway", "Vercel"],
      image: bruinMarketImage,
      github: "https://github.com/neiv06/BruinMarket",
      demo: "https://www.figma.com/proto/y54NXFdnuFkzPJTdHdHDyb/BruinMarket-Slide-Demo?node-id=27-2&p=f&t=QkAnH0jYKLx1KVzg-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1"
    },
    {
      title: "YUM",
      description: "UCLA mobile dining app providing live dining updates, commenting workflows, and personal profiles. Architected full-stack MERN mobile app with JWT-based authentication and real-time state synchronization. Implemented RESTful API endpoints with Express.js middleware and MongoDB aggregation pipelines.",
      tags: ["React Native", "Expo", "Node.js", "Express.js", "MongoDB Atlas", "REST APIs"],
      image: yumImage,
      github: "https://github.com/angelayang9483/YUM",
      demo: "https://docs.google.com/presentation/d/1qACK5aozxHnX-dhyt6w7rcdGo981hq4PslgyszBCE4U/edit?usp=sharing"
    },
    {
      title: "Stairmasters",
      description: "Swift iOS accessibility app helping UCLA students with disabilities find accessible campus routes. Leveraged Apple's MapKit framework with MKDirections API for accessible route calculations and navigation. Mapped elevator access points using Swift Core Location framework for wheelchair-accessible campus navigation.",
      tags: ["Swift", "iOS", "MapKit", "Core Location", "Accessibility"],
      image: stairmastersImage,
      github: "https://github.com/AnthonyChui/NovaStairMasters",
      demo: "https://www.figma.com/proto/y4lvQBRiMufqRgDByuwWlK/stairmasters?node-id=289-196&p=f&t=RlkCXJg1euAIK7EP-1&scaling=contain&content-scaling=fixed&page-id=289%3A195"
    }
  ];
  
  const skills = [
    { 
      category: "Languages", 
      items: ["Java", "Python", "C", "C++", "Go", "JavaScript", "TypeScript", "HTML/CSS", "XML", "JSON", "Swift", "Bash", "SQL", "CUDA"] 
    },
    { 
      category: "Frameworks", 
      items: ["PyTorch", "TensorFlow", "LangChain", "React", "React Native", "Node.js", "Express.js", "Gin", "Django", "Celery"] 
    },
    { 
      category: "Dev. Tools", 
      items: ["Git", "Github", "Docker", "Vercel", "REST APIs", "WebSockets", "MongoDB", "PostgreSQL", "OpenGL", "FastMCP"] 
    },
    { 
      category: "Libraries", 
      items: ["NumPy", "pandas", "Matplotlib", "Scikit-learn", "OpenCV", "CLIP", "OpenCLIP", "YOLO", "XGBoost", "Tailwind CSS"] 
    },
  ];

  const cookingGallery = [
    {
      image: "IMG_0298.JPG",
      title: "Spicy masala chicken curry",
      caption: "Inspired by Vij's recipe. My dad would always cook this for me when I was a kid. Spiced with garam masala, smoked paprika, turmeric, cumin, coriander, cayenne, cinnamon, and black pepper."
    },
    {
      image: "IMG_6556.jpg",
      title: "Tuna in three ways",
      caption: "Mini poke bowl, ahi tuna steak, and tuna-on-toast."
    },
    {
      image: "IMG_6701.jpg",
      title: "Breakfast toast",
      caption: "Sourdough, cream cheese, capers, smoked salmon, runny egg, and orange slices—tasty and packed with micronutrients."
    },
    {
      image: "IMG_7568.jpg",
      title: "Garlic butter shrimp with sweet potato",
      caption: "Served in a boat of fried sweet potato skin (left) and over boiled mash (right)."
    },
    {
      image: "IMG_7697.JPG",
      title: "Red-wine braised lamb shank with sweet potato mash",
      caption: "My favorite dish to cook. The lamb is marinated overnight, then slow-cooked for four hours. A long process, but worth it in the end."
    },
    {
      image: "IMG_8040.JPG",
      title: "Rosemary lamb chops with yogurt sauce",
      caption: "Simple to make, exactly like cooking a steak. Made the yogurt sauce a bit spicier with smoked paprika."
    },
    {
      image: "IMG_8306.JPG",
      title: "Pad kra pow with sweet potato",
      caption: "aka. Spicy Thai basil chicken. I make this at least three times a week—simple, tasty, and macro- and micro-friendly."
    },
    {
      image: "IMG_8349.JPG",
      title: "Shrimp boat",
      caption: "Shrimp boat."
    },
    {
      image: "IMG_8407.JPG",
      title: "Pork char siu",
      caption: "Chinese barbecue pork with broccoli and egg over Japanese sweet potato. Made this once, will make it again sometime. "
    },
    {
      image: "IMG_8766.JPG",
      title: "Garlic butter lamb loin chops with sweet potato",
      caption: "Simple and tasty—my second favorite way to cook lamb after the braised lamb shank."
    },
    {
      image: "IMG_7807.JPG",
      title: "Baked salmon, ahi tuna steak, sweet potato, egg, and gochujang",
      caption: "Was in the mood for fish. Added a little bit of spice."
    },
    {
      image: "IMG_7860.jpg",
      title: "Filipino chicken adobo over sweet potato",
      caption: "The sauce came out a bit brothy, but it was still tasty. I will make the sauce a bit thicker next time."
    },
    {
      image: "IMG_0344.JPG",
      title: "Tomato turkey boat",
      caption: "Spiced up the turkey mince with paprika, cumin, cayenne, and turmeric. Cooked with diced tomatoes, garlic, and onions. Served in a boat of baked sweet potato."
    }
  ];
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goNext = () => {
    const idx = sections.indexOf(activeSection);
    if (idx < sections.length - 1) {
      scrollToSection(sections[idx + 1]);
    } else {
      scrollToSection('home');
    }
  };

  const showPreviousDish = () => {
    setCookingSlide((current) => (current - 1 + cookingGallery.length) % cookingGallery.length);
  };

  const showNextDish = () => {
    setCookingSlide((current) => (current + 1) % cookingGallery.length);
  };

  const iconBtn =
    "p-3 text-[#FFF2D7] border border-[#C4A484]/45 rounded-full hover:bg-[#C4A484] hover:text-[#1f1e1d] hover:border-[#C4A484] transition-all duration-300 hover:scale-105";

  return (
    <div className="min-h-screen bg-[#1f1e1d] text-[#FFF2D7] overflow-x-hidden page-noise">
      {/* Scroll timeline */}
      <aside
        className={`fixed right-6 top-1/2 z-40 hidden md:flex sidebar-panel ${
          showTimeline ? 'is-visible' : ''
        }`}
        aria-label="Page sections"
      >
        <div className="relative flex flex-col justify-between h-64 py-1">
          <div className="absolute right-0 top-0 bottom-0 w-px bg-[#C4A484]/25" aria-hidden="true" />
          <div
            className="absolute right-0 top-0 w-px bg-[#C4A484] transition-all duration-500 ease-out"
            style={{ height: `${(sections.indexOf(activeSection) / (sections.length - 1)) * 100}%` }}
            aria-hidden="true"
          />
          {sections.map((section) => {
            const isActive = activeSection === section;
            return (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="group relative flex items-center justify-end pr-4 focus:outline-none"
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`font-ui text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'opacity-100 text-[#C4A484]'
                      : 'opacity-40 text-[#FFF2D7] group-hover:opacity-100 group-hover:text-[#C4A484]'
                  }`}
                >
                  {section}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <div className="text-center">
              <h1 className="fade-in-up text-7xl md:text-9xl font-bold mb-4 text-[#FFF2D7] transition-all duration-300 cursor-pointer name-glow">
                Neiv Gupta
              </h1>
              
              <div className="fade-in-up-delay-3 flex justify-center space-x-4">
                <a href="https://www.github.com/neiv06" target="_blank" rel="noopener noreferrer" className={iconBtn}>
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/neiv-gupta/" target="_blank" rel="noopener noreferrer" className={iconBtn}>
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:neiv06@g.ucla.edu" className={iconBtn}>
                  <Mail className="w-6 h-6" />
                </a>
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Resume"
                  className={iconBtn}
                >
                  <FileText className="w-6 h-6" />
                </a>
              </div>
          </div>
        </div>
      </section>

      <button
        onClick={goNext}
        className={`scroll-hint font-ui fixed bottom-10 left-1/2 z-50 flex flex-col items-center gap-2 text-[#C4A484]/80 hover:text-[#C4A484] transition-colors ${
          showScrollHint ? 'is-visible' : ''
        }`}
        aria-label="Scroll to next section"
      >
        <span className="text-xs tracking-[0.2em] uppercase">
          {activeSection === 'contact' ? 'Top' : 'Scroll'}
        </span>
        <ChevronDown className={`w-5 h-5 ${activeSection === 'contact' ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Introduction Section */}
      <section id="introduction" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12">
              Introduction
            </h2>
          </Reveal>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Reveal className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={profileImage} 
                  alt="Neiv Gupta" 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-[4px] object-cover border border-transparent shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-[#C4A484]/50 transition-all duration-500"
                />
              </div>
            </Reveal>
            
            <Reveal className="flex-1" delay={120}>
              <div className="panel p-8">
                <p className="font-ui text-sm font-medium tracking-[0.12em] text-[#C4A484] mb-5">
                  B.S. Computer Science · UCLA · Class of 2028
                </p>
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
                  I am a third-year computer science student at UCLA, passionate about building practical applications 
                  that solve real-world problems.
                </p>
                <br />
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
                  Most recently, I worked as a Software Engineering Intern at Pairwise Technologies where I developed and deployed frontend and backend services for their AI-powered agentic recruiting platform.
                </p>
                <br />
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
                  I'm also involved in the UCLA tech community through ACM-AI and Glitch UCLA.
                  When I'm not coding, you can find me cooking, running, and weightlifting.
                  I'm always excited to collaborate on projects that create meaningful impacts.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      
      {/* Experiences Section */}
      <section id="experiences" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12">
              Experiences
            </h2>
          </Reveal>
          
          <ol ref={experienceTimelineRef} className="experience-timeline">
            {experiences.map((exp, idx) => (
              <li
                key={exp.company}
                className={`experience-timeline-item ${idx % 2 === 0 ? 'is-left' : 'is-right'}`}
              >
                <Reveal className="experience-timeline-reveal" delay={idx * 120}>
                  <header className="experience-timeline-heading">
                    <h3 className="text-2xl font-bold accent-text mb-2">{exp.company}</h3>
                    <div className="text-[#FFF2D7]/70">
                      <span className="font-semibold">{exp.title}</span>
                      <div className="experience-timeline-meta flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span>{exp.location}</span>
                        <span className="text-[#C4A484]/40" aria-hidden="true">·</span>
                        <span className="text-sm tracking-wide text-[#C4A484]/80">
                        {exp.period}
                        </span>
                      </div>
                    </div>
                  </header>

                  <article className="experience-timeline-card p-6 md:p-7">
                    <p className="text-[#FFF2D7]/70 leading-relaxed">{exp.description}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12">
              Projects
            </h2>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="panel p-5 h-full flex flex-col group">
                  {project.image && (
                    <div className="mb-5 overflow-hidden rounded-[4px]">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-44 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-[#FFF2D7]/55 mb-4 text-sm leading-relaxed flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="chip">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-slim flex-1"
                    >
                      <Github className="w-4 h-4" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-slim flex-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-20 relative">
        <div className="max-w-4xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12">
              Technical Skills
            </h2>
          </Reveal>
          
          <div className="grid md:grid-cols-2 gap-5">
            {skills.map((skillSet, idx) => (
              <Reveal key={idx} delay={idx * 90}>
                <div className="panel p-6 h-full">
                  <h3 className="text-lg font-bold mb-4 tracking-wide">
                    <span className="accent-text">{skillSet.category}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillSet.items.map((skill, i) => (
                      <span key={i} className="chip">{skill}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Interests Section */}
      <section id="interests" className="py-8 relative">
        <div className="max-w-6xl mx-auto px-6 md:pr-24 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-3">Interests</h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="font-ui text-sm font-medium tracking-[0.12em] text-[#C4A484] uppercase mb-4">
              A bit more about me
            </p>
          </Reveal>

          <div className="currently-layout">
            <Reveal className="currently-cooking" delay={160}>
              <div className="currently-section-heading">
                <div>
                  <p className="font-ui text-xs font-medium tracking-[0.12em] text-[#C4A484] uppercase">
                    Cooking 
                  </p>

                </div>
                <div className="cooking-carousel-controls">
                  <button
                    type="button"
                    className="cooking-carousel-button"
                    onClick={showPreviousDish}
                    aria-label="Show previous dish"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-ui text-xs tracking-[0.12em] text-[#C4A484]/75">
                    {String(cookingSlide + 1).padStart(2, '0')} / {String(cookingGallery.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="cooking-carousel-button"
                    onClick={showNextDish}
                    aria-label="Show next dish"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                className="cooking-carousel-window"
                style={cookingWindowHeight ? { height: `${cookingWindowHeight}px` } : undefined}
              >
                <div
                  ref={cookingTrackRef}
                  className="cooking-carousel-track"
                  style={{ transform: `translateX(-${cookingSlide * 100}%)` }}
                >
                  {cookingGallery.map((dish) => (
                    <article key={dish.image} className="cooking-card cooking-carousel-card">
                      <img
                        src={`${import.meta.env.BASE_URL}cooking/${dish.image}`}
                        alt={dish.title}
                        className="cooking-card-image"
                        loading="lazy"
                      />
                      <div className="cooking-card-copy">
                        <h3 className="text-lg font-bold accent-text">{dish.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#FFF2D7]/70">{dish.caption}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal className="currently-strava" delay={240}>
              <article className="current-service-card">
                <div className="flex items-center justify-between">
                  <p className="font-ui text-xs font-medium tracking-[0.12em] text-[#C4A484] uppercase">Strava</p>
                  <a
                    href={stravaProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-logo-btn"
                    aria-label="Open Strava profile"
                  >
                    <StravaIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h3 className="mt-2 text-2xl font-bold">Latest run</h3>
                {strava.status === 'loading' && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">Loading latest activity…</p>
                )}
                {strava.status === 'error' && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">Couldn't load Strava right now.</p>
                )}
                {strava.status === 'ready' && !strava.data.hasActivity && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">No recent activity.</p>
                )}
                {strava.status === 'ready' && strava.data.hasActivity && (
                  <div className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">
                    <p className="text-lg text-[#FFF2D7] font-semibold">{strava.data.name}</p>
                    <p className="mt-1 text-sm tracking-wide text-[#C4A484]/80">{strava.data.date}</p>

                    <div className="strava-stats-grid">
                      <div className="strava-stat">
                        <span className="strava-stat-label">Distance</span>
                        <span className="strava-stat-value">
                          {strava.data.distanceMi} mi · {strava.data.distanceKm} km
                        </span>
                      </div>
                      <div className="strava-stat">
                        <span className="strava-stat-label">Time</span>
                        <span className="strava-stat-value">{strava.data.movingTimeMin} min</span>
                      </div>
                      <div className="strava-stat">
                        <span className="strava-stat-label">Pace</span>
                        <span className="strava-stat-value">
                          {strava.data.pacePerMile} · {strava.data.pacePerKm}
                        </span>
                      </div>
                      {strava.data.elevationGainFt != null && (
                        <div className="strava-stat">
                          <span className="strava-stat-label">Elevation</span>
                          <span className="strava-stat-value">{strava.data.elevationGainFt} ft</span>
                        </div>
                      )}
                      {strava.data.averageHeartrate != null && (
                        <div className="strava-stat">
                          <span className="strava-stat-label">Avg HR</span>
                          <span className="strava-stat-value">
                            {Math.round(strava.data.averageHeartrate)} bpm
                          </span>
                        </div>
                      )}
                      {strava.data.maxSpeedMph != null && (
                        <div className="strava-stat">
                          <span className="strava-stat-label">Max speed</span>
                          <span className="strava-stat-value">{strava.data.maxSpeedMph} mph</span>
                        </div>
                      )}
                      {strava.data.kudosCount != null && (
                        <div className="strava-stat">
                          <span className="strava-stat-label">Kudos</span>
                          <span className="strava-stat-value">{strava.data.kudosCount}</span>
                        </div>
                      )}
                    </div>

                    <RouteMap points={strava.data.route} />
                  </div>
                )}
              </article>
            </Reveal>

            <Reveal className="currently-spotify" delay={280}>
              <article className="current-service-card">
                <div className="flex items-center justify-between">
                  <p className="font-ui text-xs font-medium tracking-[0.12em] text-[#C4A484] uppercase">Spotify</p>
                  <a
                    href={spotifyProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-logo-btn"
                    aria-label="Open Spotify profile"
                  >
                    <SpotifyIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h3 className="mt-2 text-lg font-bold flex items-center">
                  {spotify.status === 'ready' && spotify.data.isPlaying ? 'Listening now' : 'Last played'}
                  {spotify.status === 'ready' && spotify.data.track && (
                    <Soundwave active={spotify.data.isPlaying} />
                  )}
                </h3>
                {spotify.status === 'loading' && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">Loading…</p>
                )}
                {spotify.status === 'error' && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">Couldn't load Spotify right now.</p>
                )}
                {spotify.status === 'ready' && !spotify.data.track && (
                  <p className="mt-3 text-sm leading-relaxed text-[#FFF2D7]/70">Nothing played recently.</p>
                )}
                {spotify.status === 'ready' && spotify.data.track && (
                  <>
                    <a
                      href={spotify.data.url ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-3 text-sm leading-relaxed text-[#FFF2D7]/70 hover:text-[#FFF2D7] transition-colors"
                    >
                      {spotify.data.albumArt && (
                        <img
                          src={spotify.data.albumArt}
                          alt=""
                          className="w-12 h-12 rounded-[4px] object-cover flex-shrink-0"
                        />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[#FFF2D7] font-semibold">{spotify.data.track}</span>
                        <span className="block truncate">{spotify.data.artist}</span>
                      </span>
                    </a>

                    {spotify.data.recentTracks?.length > 0 && (
                      <div className="spotify-recent-list">
                        <p className="font-ui text-[10px] font-medium tracking-[0.12em] text-[#C4A484]/70 uppercase">
                          Recently played
                        </p>
                        {spotify.data.recentTracks.slice(0, 5).map((t, idx) => (
                          <a
                            key={`${t.track}-${idx}`}
                            href={t.url ?? undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spotify-recent-item"
                          >
                            {t.albumArt && <img src={t.albumArt} alt="" />}
                            <span className="min-w-0 flex-1 truncate">
                              <span className="text-[#FFF2D7]/90">{t.track}</span> — {t.artist}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-2xl mx-auto px-6 text-center z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          </Reveal>

          <Reveal delay={100}>
            <div className="mb-10">
              <span className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 border border-[#C4A484]/30 rounded-[4px] text-[#C4A484]">
                <MapPin className="w-5 h-5" />
                <span>Los Angeles, CA</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="mailto:neiv06@g.ucla.edu" className="btn-slim px-6 py-3">
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
              
              <a 
                href="https://github.com/neiv06"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-slim px-6 py-3"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/neiv-gupta/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-slim px-6 py-3"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-[#C4A484]/15 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#C4A484]/60">
          <p className="text-sm tracking-wide">© 2026 Neiv Gupta</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
