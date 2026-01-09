import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Terminal, Code, Briefcase, User, Award, Building2, MapPin, FileText } from 'lucide-react';
import profileImage from './images/headshot.JPG';
import cudaFireImage from './images/CudaFire.png';
import bruinMarketImage from './images/BruinMarket.png';
import yumImage from './images/YUM.png';
import stairmastersImage from './images/Stairmasters.png';
import './App.css';

const resume = '/Neiv_Gupta_Resume.pdf';

const Portfolio = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  const [particles, setParticles] = useState([]);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shootingStars, setShootingStars] = useState([]);
  const [poppedStars, setPoppedStars] = useState(new Set());
  
  const fullText = "neivgupta:~$ whoami";
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 0.1,
      speedY: (Math.random() - 0.5) * 0.1,
      opacity: Math.random() * 0.8 + 0.2,
      twinkle: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
        opacity: Math.max(0.2, Math.min(1, p.opacity + (Math.random() - 0.5) * 0.1)),
      })));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // At the top, always show
        setIsScrollingDown(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrollingDown(true);
      } else {
        // Scrolling up
        setIsScrollingDown(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const experiences = [
    {
      title: "Software Engineering Intern",
      company: "ThinkScan Technologies",
      location: "Pleasanton, CA",
      period: "Apr. 2025 – Sep. 2025",
      description: [
        "Developed AI Agent integrating YOLOv11 and OCR pipelines for object detection and scene reasoning",
        "Improved inference accuracy by 34% with average latency reduced to 25 ms per frame on Apple M3 Silicon",
        "Optimized TinyLlama to scale inference using MLX on Apple M3, reducing latency 22% and power 14%",
        "Engineered image quality assessment using Laplacian variance and bilateral filtering for noise detection"
      ],
      technologies: ["YOLOv11", "OCR", "MLX", "TinyLlama", "Computer Vision", "AI"]
    },
    {
      title: "Computer Vision Researcher",
      company: "Argonne National Laboratory",
      location: "Lemont, IL",
      period: "June 2024 – Aug. 2024",
      description: [
        "Deployed TensorFlow/PyTorch CNN models on ARM Cortex-A78 edge nodes for environmental monitoring",
        "Built high-performance CLIP-based zero-shot classification achieving 93% mAP across 12 environmental classes",
        "Implemented model optimization techniques including quantization, reducing edge deployment time",
        "Fine-tuned OpenCLIP ViT-B/32 models on domain-specific environmental datasets for improved accuracy"
      ],
      technologies: ["TensorFlow", "PyTorch", "CLIP", "OpenCLIP", "Edge Computing", "Computer Vision"]
    },
    {
      title: "Geographic Information Systems Intern",
      company: "Northern Change Research Laboratory, Brown University",
      location: "Providence, RI",
      period: "Apr. 2023 – Aug. 2024",
      description: [
        "Executed ResNet-50 transfer learning with TensorFlow/PyTorch, processing Sentinel-2 multi-spectral imagery",
        "Engineered data pipelines using GDAL/Rasterio, creating 15K+ labeled training samples via QGIS digitization",
        "Achieved 14% accuracy improvement using U-Net segmentation architecture with focal loss optimization",
        "Quantified glacial ice loss contributing to sea level rise projections using geodetic mass balance calculations"
      ],
      technologies: ["TensorFlow", "PyTorch", "ResNet-50", "U-Net", "GDAL", "QGIS", "Remote Sensing"]
    },
    {
      title: "Student Researcher",
      company: "Doer School of Sustainability, Stanford University",
      location: "Palo Alto, CA",
      period: "Nov. 2021 – Nov. 2023",
      description: [
        "Implemented Random Forest and XGBoost learning algorithms for Sierra Nevada tree species classification",
        "Achieved 96% classification accuracy using ensemble methods on 100,000+ labeled forest imagery samples",
        "Developed LSTM RNN architecture for wildfire progression prediction from multi-spectral satellite imagery",
        "Integrated NOAA meteorological APIs and topographical datasets for enhanced feature engineering processes"
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
      demo: "#"
    },
    {
      title: "BruinMarket",
      description: "Full-stack UCLA-exclusive student marketplace with real-time peer-to-peer transactions and messaging. Architected backend using Go with PostgreSQL database, JWT authentication, and email verification. Deployed production app on Railway and Vercel with custom domain configuration and CI/CD pipeline.",
      tags: ["Go", "React", "PostgreSQL", "WebSockets", "Docker", "Railway", "Vercel"],
      image: bruinMarketImage,
      github: "https://github.com/neiv06/BruinMarket",
      demo: "https://www.instagram.com/p/DQ88soCFKnf/?img_index=1"
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
      items: ["Git", "Github", "Docker", "Railway", "Vercel", "REST APIs", "WebSockets", "MongoDB Atlas", "PostgreSQL", "OpenGL", "CMake", "QGIS"] 
    },
    { 
      category: "Libraries", 
      items: ["NumPy", "pandas", "Matplotlib", "Scikit-learn", "OpenCV", "CLIP", "OpenCLIP", "YOLO", "XGBoost", "Tailwind CSS"] 
    },
  ];
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackgroundClick = (e) => {
    // Only trigger if clicking directly on the main container (empty space), not on content
    if (e.target === e.currentTarget) {
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      // Generate random angle for shooting star direction
      const angle = Math.random() * Math.PI * 2;
      
      const shootingStar = {
        id: Date.now(),
        startX: clickX,
        startY: clickY,
        angle: angle * (180 / Math.PI), // Convert to degrees
      };
      
      setShootingStars(prev => [...prev, shootingStar]);
      
      // Remove shooting star after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== shootingStar.id));
      }, 1500);
    }
  };

  return (
    <div 
      className="min-h-screen bg-black text-gray-100 overflow-x-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Shooting Stars */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: `${star.startX}px`,
            top: `${star.startY}px`,
            width: '3px',
            height: '150px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0.5), rgba(255,255,255,0))',
            boxShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)',
            transform: `rotate(${star.angle}deg)`,
            transformOrigin: '0 0',
            animation: 'shootStar 1.5s ease-out forwards',
          }}
        />
      ))}
      
      {/* Starry Night Background */}
      <div className="fixed inset-0 bg-black">
        {particles.map(p => {
          // Calculate distance from cursor to particle (using viewport dimensions)
          const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
          const particleX = (p.x / 100) * viewportWidth;
          const particleY = (p.y / 100) * viewportHeight;
          
          // Calculate vector from particle to cursor (direction of pull)
          const dx = mousePosition.x - particleX;
          const dy = mousePosition.y - particleY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Black hole effect: pull stars towards cursor
          const pullRadius = 300; // Maximum distance for black hole effect
          const minDistance = 5; // Minimum distance to prevent division issues
          
          let pullStrength = 0;
          let pullX = 0;
          let pullY = 0;
          
          if (distance < pullRadius && distance > minDistance) {
            // Calculate pull strength (stronger when closer to cursor)
            // Using inverse square law for realistic gravitational effect
            const normalizedDistance = (distance - minDistance) / (pullRadius - minDistance);
            pullStrength = 1 - normalizedDistance;
            // Apply cubic falloff for more dramatic effect near cursor
            pullStrength = pullStrength * pullStrength * pullStrength;
            
            // Calculate direction towards cursor (normalized)
            const angle = Math.atan2(dy, dx);
            const pullDistance = pullStrength * 200; // Maximum pull distance
            
            pullX = Math.cos(angle) * pullDistance;
            pullY = Math.sin(angle) * pullDistance;
          }
          
          // Black hole visual effect: stars shrink and fade as they approach cursor
          const interactionStrength = Math.max(0, 1 - distance / pullRadius);
          // Stars get smaller and more transparent as they're sucked in
          const blackHoleSize = p.size * (1 - interactionStrength * 0.8); // Shrink up to 80%
          const blackHoleOpacity = p.opacity * (1 - interactionStrength * 0.9); // Fade up to 90%
          const blackHoleGlow = blackHoleSize * (2 - interactionStrength * 1.5);
          
          const isPopped = poppedStars.has(p.id);
          
          const handleStarClick = (e) => {
            e.stopPropagation(); // Prevent background click from triggering
            setPoppedStars(prev => new Set([...prev, p.id]));
            // Remove from popped set after animation completes
            setTimeout(() => {
              setPoppedStars(prev => {
                const newSet = new Set(prev);
                newSet.delete(p.id);
                return newSet;
              });
            }, 600);
          };
          
          return (
            <div
              key={p.id}
              onClick={handleStarClick}
              className="absolute rounded-full bg-white transition-all duration-200 cursor-pointer"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${Math.max(0.5, blackHoleSize)}px`,
                height: `${Math.max(0.5, blackHoleSize)}px`,
                opacity: Math.max(0.1, blackHoleOpacity),
                boxShadow: `0 0 ${blackHoleGlow}px rgba(255, 255, 255, ${blackHoleOpacity})`,
                animation: isPopped 
                  ? `starPop 0.6s ease-out forwards, twinkle ${p.twinkle}s ease-in-out infinite alternate` 
                  : `twinkle ${p.twinkle}s ease-in-out infinite alternate`,
                transform: `translate(${pullX}px, ${pullY}px)`,
                pointerEvents: 'auto',
              }}
            />
          );
        })}
      </div>
      
      {/* Black Hole Cursor Effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-10 bg-black transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      <div 
        className="fixed w-64 h-64 rounded-full pointer-events-none blur-2xl opacity-20 bg-black transition-all duration-300"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />
      <div 
        className="fixed w-32 h-32 rounded-full pointer-events-none blur-xl opacity-30 bg-black transition-all duration-300"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
        }}
      />
      
      {/* Navigation */}
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrollingDown ? '-translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className="bg-gray-900/20 backdrop-blur-md rounded-full px-8 py-4 border border-gray-700/50 shadow-lg">
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {['home', 'about', 'experiences', 'projects', 'skills', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="hover:text-white transition-all duration-300 capitalize font-medium hover:scale-110 transform"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <div className="text-center">
              <h1 className="text-7xl md:text-9xl font-bold mb-4 text-white fade-in-up transition-all duration-300 cursor-pointer name-glow">
                Neiv Gupta
              </h1>
              
              <h2 className="text-xl md:text-2xl text-white-300 mb-8 fade-in-up-delay-1">
                Software Engineer <span className="font-bold mx-2 text-md">✦</span> Researcher <span className="font-bold mx-2 text-md">✦</span> UCLA Student
              </h2>
              
              <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto fade-in-up-delay-2">
               Full-stack developer interested in app development, machine learning systems, computer vision, AI and high-performance GPU computing.
              </p>
              
              <div className="flex justify-center space-x-4 mb-4 fade-in-up-delay-3">
                <a href="https://www.github.com/neiv06" target="_blank" rel="noopener noreferrer" className="p-3 bg-black text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/neiv-gupta/" target="_blank" rel="noopener noreferrer" className="p-3 bg-black text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:neiv06@g.ucla.edu" className="p-3 bg-black text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all hover:scale-110">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-gray-300 mb-12 fade-in-up-delay-3">
                <MapPin className="w-5 h-5" />
                <span>Los Angeles, CA</span>
              </div>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="px-8 py-4 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 fade-in-up-delay-3"
                >
                  About Me
                </button>
              </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <User className="w-10 h-10 mr-4 text-white" />
            About Me
          </h2>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <img 
                  src={profileImage} 
                  alt="Neiv Gupta" 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-gray-700 shadow-2xl hover:border-white transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
            
            <div className="flex-1 bg-transparent p-8 rounded-xl border border-gray-700 hover:border-white transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <p className="text-white-300 leading-relaxed text-lg">
              I am a second-year computer science student at UCLA, passionate about building practical applications 
              that solve real-world problems. I am currently looking for a Summer 2026 internship where I can continue 
              to build my skills and tackle new challenges.
            </p>
            <br />
            <p className="text-white-300 leading-relaxed text-lg">
              Most recently, I worked as a Software Engineering Intern at ThinkScan Technologies, an AI startup where 
              I developed low-power AI agents for computer vision tasks. My research experience includes applying deep learning
              and computer vision techniques to environmental monitoring with the Argonne National Laboratory and the Northern Change Research
              Laboratory at Brown University.
            </p>
            <br />
            <p className="text-white-300 leading-relaxed text-lg">
              I'm also involved in the UCLA tech community through ACM-AI, Nova–Tech for Good, and Glitch UCLA. 
              When I'm not coding, you can find me cooking, lifting weights, or playing for the UCLA Men's Ice Hockey team! 
              I'm always excited to collaborate on projects that push the boundaries of what's possible with technology.
            </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experiences Section */}
      <section id="experiences" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Building2 className="w-10 h-10 mr-4 text-white" />
            Professional Experience
          </h2>
          
          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-8 border border-gray-700 hover:border-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-gray-300 mb-4">
                      <span className="font-semibold">{exp.company}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <div className="text-gray-400 font-mono text-sm md:text-base">
                    {exp.period}
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-300 flex items-start">
                      <span className="text-white mr-2">▹</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
                  {exp.technologies.map((tech, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Briefcase className="w-10 h-10 mr-4 text-white" />
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-6 border border-gray-700 hover:border-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] group"
              >
                {project.image && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-gray-700">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-20 relative">
        <div className="max-w-4xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Award className="w-10 h-10 mr-4 text-white" />
            Technical Skills
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillSet, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-6 border border-gray-700 hover:border-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                <h3 className="text-xl font-bold mb-4 text-white">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-white/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-2xl mx-auto px-6 text-center z-10">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-8">
            I'm always open to discussing new projects, opportunities, or collaborations.
          </p>
          
          {/* Contact Info */}
          <div className="mb-12">
            <a
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              <span>Los Angeles, CA</span>
            </a>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:neiv06@g.ucla.edu"
              className="px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            
            <a 
              href="https://github.com/neiv06"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/neiv-gupta/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            
            <a 
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p className="font-mono">© 2026 Neiv Gupta</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;