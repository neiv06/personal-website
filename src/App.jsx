import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Briefcase, User, Award, Building2, MapPin, FileText } from 'lucide-react';
import profileImage from './images/headshot.JPG';
import cudaFireImage from './images/CudaFire.png';
import bruinMarketImage from './images/BruinMarket.png';
import yumImage from './images/YUM.png';
import stairmastersImage from './images/Stairmasters.png';
import './App.css';

const resume = `${import.meta.env.BASE_URL}Neiv_Gupta_Resume.pdf`;

const sections = ['home', 'about', 'experiences', 'projects', 'skills', 'contact'];

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

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [homeProgress, setHomeProgress] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const homeProgressRef = useRef(0);
  const idleTimerRef = useRef(null);
  const homeUnlocked = homeProgress >= 1;

  const setProgress = (next) => {
    const clamped = Math.min(1, Math.max(0, next));
    homeProgressRef.current = clamped;
    setHomeProgress(clamped);
  };

  useEffect(() => {
    document.body.style.overflow = homeUnlocked ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [homeUnlocked]);

  useEffect(() => {
    const onWheel = (e) => {
      const current = homeProgressRef.current;

      if (current < 1) {
        e.preventDefault();
        setProgress(current + e.deltaY * 0.00115);
        return;
      }

      if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault();
        setProgress(1 + e.deltaY * 0.00115);
      }
    };

    let touchY = null;
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (touchY == null) return;
      const dy = touchY - e.touches[0].clientY;
      const current = homeProgressRef.current;

      if (current < 1) {
        e.preventDefault();
        setProgress(current + dy * 0.0035);
        touchY = e.touches[0].clientY;
        return;
      }

      if (window.scrollY <= 0 && dy < 0) {
        e.preventDefault();
        setProgress(current + dy * 0.0035);
        touchY = e.touches[0].clientY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    const onKeyDown = (e) => {
      if (homeProgressRef.current >= 1 && !(window.scrollY <= 0 && (e.key === 'ArrowUp' || e.key === 'PageUp'))) {
        return;
      }

      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) {
        if (homeProgressRef.current < 1) {
          e.preventDefault();
          setProgress(homeProgressRef.current + 0.12);
        }
      }

      if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (homeProgressRef.current < 1 || window.scrollY <= 0) {
          e.preventDefault();
          setProgress(homeProgressRef.current - 0.12);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewportMid = window.scrollY + window.innerHeight / 3;
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
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const resetIdle = () => {
      setShowScrollHint(false);
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setShowScrollHint(true), 2200);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel', 'scroll'];
    events.forEach((event) => window.addEventListener(event, resetIdle, { passive: true }));
    resetIdle();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdle));
      clearTimeout(idleTimerRef.current);
    };
  }, []);
  
  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "ThinkScan Technologies",
      location: "Pleasanton, CA",
      period: "Apr. 2025 – Sep. 2025",
      description: [
        "Developed an object detection and scene reasoning AI Agent for threat detection in defense field deployments",
        "Built multi-modal retrieval system over FAISS vector store for search across CLIP-embedded imagery datasets",
        "Implemented Laplacian variance and bilateral filtering to enhance noisy field imagery for inference"
      ],
      technologies: ["FAISS", "CLIP", "Computer Vision", "AI", "Image Processing"]
    },
    {
      title: "Computer Vision Researcher",
      company: "Argonne National Laboratory",
      location: "Lemont, IL",
      period: "June 2024 – Aug. 2024",
      description: [
        "Deployed TensorFlow/PyTorch CNN pipelines for wildfire response and drought monitoring",
        "Built CLIP-based zero-shot classification model achieving 93% mAP for wildfire and drought imagery datasets",
        "Fine-tuned OpenCLIP ViT-B/32 multi-modal models on imagery datasets for improved accuracy"
      ],
      technologies: ["TensorFlow", "PyTorch", "CLIP", "OpenCLIP", "Computer Vision"]
    },
    {
      title: "Geographic Information Systems Intern",
      company: "Northern Change Research Laboratory, Brown University",
      location: "Providence, RI",
      period: "Apr. 2023 – Aug. 2024",
      description: [
        "Executed ResNet-50 transfer learning with TensorFlow/PyTorch, processing Sentinel-2 multi-spectral imagery",
        "Engineered data pipelines using GDAL/Rasterio, creating 15K+ labeled training samples via QGIS digitization",
        "Contributed to glacial ice loss and sea level rise projections achieved via geodetic mass balance calculations"
      ],
      technologies: ["TensorFlow", "PyTorch", "ResNet-50", "GDAL", "QGIS", "Remote Sensing"]
    },
    {
      title: "Student Researcher",
      company: "Doer School of Sustainability, Stanford University",
      location: "Palo Alto, CA",
      period: "Nov. 2021 – Nov. 2023",
      description: [
        "Implemented Random Forest and XGBoost learning algorithms for Sierra Nevada tree species classification",
        "Achieved 96% classification accuracy using ensemble methods on 100,000+ labeled forest imagery samples",
        "Developed LSTM RNN architecture for wildfire progression prediction from multi-spectral satellite imagery"
      ],
      technologies: ["Random Forest", "XGBoost", "LSTM", "RNN", "Machine Learning", "Remote Sensing"]
    }
  ];

  const projects = [
    {
      title: "CudaFire",
      description: "GPU-accelerated wildfire spread simulator using CUDA and Rothermel fire behavior model. Processed 8.7 million terrain cells in parallel using 8-connected cellular automaton on RTX 3080, achieving 7,643× real-time simulation performance. Integrated GeoTIFF terrain ingestion via GDAL and real-time OpenGL 3D visualization pipeline.",
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
      items: ["PyTorch", "TensorFlow", "LangChain", "React", "React Native", "Node.js", "Express.js", "Gin", "Apple MLX"] 
    },
    { 
      category: "Developer Tools", 
      items: ["Git", "Github", "Docker", "Railway", "Vercel", "REST APIs", "WebSockets", "MongoDB", "PostgreSQL", "OpenGL", "CMake", "QGIS", "FAISS"] 
    },
    { 
      category: "Libraries", 
      items: ["NumPy", "pandas", "Matplotlib", "Scikit-learn", "OpenCV", "CLIP", "OpenCLIP", "YOLO", "XGBoost", "Tailwind CSS"] 
    },
  ];
  
  const scrollToSection = (id) => {
    if (id !== 'home' && homeProgressRef.current < 1) {
      setProgress(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goNext = () => {
    if (homeProgressRef.current < 1) {
      setProgress(Math.min(1, homeProgressRef.current + 0.35));
      return;
    }

    const idx = sections.indexOf(activeSection);
    if (idx < sections.length - 1) {
      scrollToSection(sections[idx + 1]);
    } else {
      scrollToSection('home');
    }
  };

  const nameOpacity = Math.min(1, homeProgress / 0.45);
  const iconsOpacity = Math.min(1, Math.max(0, (homeProgress - 0.4) / 0.45));

  const iconBtn =
    "p-3 text-[#FFF2D7] border border-[#C4A484]/45 rounded-full hover:bg-[#C4A484] hover:text-[#1f1e1d] hover:border-[#C4A484] transition-all duration-300 hover:scale-105";

  return (
    <div className="min-h-screen bg-[#1f1e1d] text-[#FFF2D7] overflow-x-hidden page-noise">
      {/* Scroll timeline */}
      <aside className="fixed right-6 top-1/2 z-40 hidden md:flex sidebar-enter" aria-label="Page sections">
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
                  className={`text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 ${
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
              <h1
                className="home-stage text-7xl md:text-9xl font-bold mb-4 text-[#FFF2D7] transition-all duration-300 cursor-pointer name-glow"
                style={{
                  opacity: nameOpacity,
                  transform: `translateY(${(1 - nameOpacity) * 28}px)`,
                }}
              >
                Neiv Gupta
              </h1>
              
              <div
                className="home-stage flex justify-center space-x-4"
                style={{
                  opacity: iconsOpacity,
                  transform: `translateY(${(1 - iconsOpacity) * 18}px)`,
                  pointerEvents: iconsOpacity > 0.2 ? 'auto' : 'none',
                }}
              >
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
        className={`scroll-hint fixed bottom-10 left-1/2 z-50 flex flex-col items-center gap-2 text-[#C4A484]/80 hover:text-[#C4A484] transition-colors ${
          showScrollHint ? 'is-visible' : ''
        }`}
        aria-label={homeUnlocked ? 'Scroll to next section' : 'Reveal home'}
      >
        <span className="text-xs tracking-[0.2em] uppercase">
          {activeSection === 'contact' ? 'Top' : 'Scroll'}
        </span>
        <ChevronDown className={`w-5 h-5 ${activeSection === 'contact' ? 'rotate-180' : ''}`} />
      </button>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12 flex items-center">
              <User className="w-10 h-10 mr-4 accent-icon" />
              About Me
            </h2>
          </Reveal>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <Reveal className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={profileImage} 
                  alt="Neiv Gupta" 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-[4px] object-cover border border-[#C4A484]/25 shadow-[0_20px_60px_rgba(0,0,0,0.35)] hover:border-[#C4A484]/60 transition-all duration-500"
                />
              </div>
            </Reveal>
            
            <Reveal className="flex-1" delay={120}>
              <div className="panel p-8">
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg font-display">
                  I am a second-year computer science student at UCLA, passionate about building practical applications 
                  that solve real-world problems.
                </p>
                <br />
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg font-display">
                  Most recently, I worked as a Software Engineering Intern at ThinkScan Technologies, an AI startup where 
                  I developed low-power AI agents for computer vision tasks. My research experience includes applying deep learning
                  and computer vision techniques to environmental monitoring with the Argonne National Laboratory and the Northern Change Research
                  Laboratory at Brown University.
                </p>
                <br />
                <p className="text-[#FFF2D7]/85 leading-relaxed text-lg font-display">
                  I'm also involved in the UCLA tech community through ACM-AI and Glitch UCLA. 
                  When I'm not coding, you can find me cooking, running, and weightlifting. 
                  I'm always excited to collaborate on projects that create meaningful impact.
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
            <h2 className="text-4xl font-bold mb-12 flex items-center">
              <Building2 className="w-10 h-10 mr-4 accent-icon" />
              Professional Experience
            </h2>
          </Reveal>
          
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <Reveal key={idx} delay={idx * 90}>
                <div className="panel p-7 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#FFF2D7] mb-2">{exp.title}</h3>
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-3 text-[#FFF2D7]/70">
                        <span className="font-semibold accent-text">{exp.company}</span>
                        <span className="hidden md:inline text-[#C4A484]/40">/</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <div className="text-[#C4A484]/80 text-sm tracking-wide">
                      {exp.period}
                    </div>
                  </div>
                  
                  <ul className="space-y-2.5 mb-6">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-[#FFF2D7]/70 flex items-start">
                        <span className="accent-dot mr-3 mt-1.5 text-[0.5rem]">●</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2 pt-5 border-t border-[#C4A484]/15">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="chip">{tech}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <Reveal asHeading>
            <h2 className="text-4xl font-bold mb-12 flex items-center">
              <Briefcase className="w-10 h-10 mr-4 accent-icon" />
              Featured Projects
            </h2>
          </Reveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="panel p-5 h-full flex flex-col group">
                  {project.image && (
                    <div className="mb-5 overflow-hidden rounded-[4px] border border-[#C4A484]/15">
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
            <h2 className="text-4xl font-bold mb-12 flex items-center">
              <Award className="w-10 h-10 mr-4 accent-icon" />
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
      
      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-2xl mx-auto px-6 text-center z-10">
          <Reveal>
            <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
            <p className="text-xl text-[#FFF2D7]/65 mb-10 font-display">
              I'm always open to discussing new projects, opportunities, or collaborations.
            </p>
            
            <div className="mb-10">
              <span className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 border border-[#C4A484]/30 rounded-[4px] text-[#C4A484]">
                <MapPin className="w-5 h-5" />
                <span>Los Angeles, CA</span>
              </span>
            </div>
            
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
