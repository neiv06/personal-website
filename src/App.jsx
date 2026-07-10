import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Terminal, Code, Briefcase, User, Award, Building2, MapPin, FileText } from 'lucide-react';
import profileImage from './images/headshot.JPG';
import cudaFireImage from './images/CudaFire.png';
import bruinMarketImage from './images/BruinMarket.png';
import yumImage from './images/YUM.png';
import stairmastersImage from './images/Stairmasters.png';
import './App.css';

const resume = `${import.meta.env.BASE_URL}Neiv_Gupta_Resume.pdf`;

const Portfolio = () => {
  const [terminalText, setTerminalText] = useState('');
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#343231] text-[#FFF2D7] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrollingDown ? '-translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className="bg-[#343231]/60 backdrop-blur-md rounded-full px-8 py-4 border border-[#FFF2D7]/20 shadow-lg">
          <div className="flex items-center space-x-8">
            <div className="flex space-x-8">
              {['home', 'about', 'experiences', 'projects', 'skills', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="hover:text-[#FFF2D7] transition-all duration-300 capitalize font-medium hover:scale-110 transform"
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
              <h1 className="text-7xl md:text-9xl font-bold mb-4 text-[#FFF2D7] fade-in-up transition-all duration-300 cursor-pointer name-glow">
                Neiv Gupta
              </h1>
              
              <h2 className="text-xl md:text-2xl text-[#FFF2D7]/85 mb-8 fade-in-up-delay-1">
                Software Engineer <span className="font-bold mx-2 text-md">✦</span> Researcher <span className="font-bold mx-2 text-md">✦</span> UCLA Student
              </h2>
              
              <p className="text-base md:text-lg text-[#FFF2D7]/75 mb-8 max-w-2xl mx-auto fade-in-up-delay-2">
               Full-stack developer interested in app development, machine learning systems, computer vision, AI and high-performance GPU computing.
              </p>
              
              <div className="flex justify-center space-x-4 mb-4 fade-in-up-delay-3">
                <a href="https://www.github.com/neiv06" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] rounded-full hover:bg-[#FFF2D7] hover:text-[#343231] transition-all hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/neiv-gupta/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] rounded-full hover:bg-[#FFF2D7] hover:text-[#343231] transition-all hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:neiv06@g.ucla.edu" className="p-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] rounded-full hover:bg-[#FFF2D7] hover:text-[#343231] transition-all hover:scale-110">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-[#FFF2D7]/75 mb-12 fade-in-up-delay-3">
                <MapPin className="w-5 h-5" />
                <span>Los Angeles, CA</span>
              </div>
              
              <div className="flex justify-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 fade-in-up-delay-3 inline-flex items-center justify-center space-x-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Resume</span>
                  </a>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="px-8 py-4 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 fade-in-up-delay-3"
                  >
                    About Me
                  </button>
                </div>
              </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <User className="w-10 h-10 mr-4 text-[#FFF2D7]" />
            About Me
          </h2>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFF2D7] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <img 
                  src={profileImage} 
                  alt="Neiv Gupta" 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-[#FFF2D7]/25 shadow-2xl hover:border-[#FFF2D7] transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
            
            <div className="flex-1 bg-transparent p-8 rounded-xl border border-[#FFF2D7]/20 hover:border-[#FFF2D7] transition-all hover:shadow-[0_0_30px_rgba(255,242,215,0.25)]">
            <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
              I am a second-year computer science student at UCLA, passionate about building practical applications 
              that solve real-world problems. I am currently looking for a Summer 2026 internship where I can continue 
              to build my skills and tackle new challenges.
            </p>
            <br />
            <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
              Most recently, I worked as a Software Engineering Intern at ThinkScan Technologies, an AI startup where 
              I developed low-power AI agents for computer vision tasks. My research experience includes applying deep learning
              and computer vision techniques to environmental monitoring with the Argonne National Laboratory and the Northern Change Research
              Laboratory at Brown University.
            </p>
            <br />
            <p className="text-[#FFF2D7]/85 leading-relaxed text-lg">
              I'm also involved in the UCLA tech community through ACM-AI and Glitch UCLA. 
              When I'm not coding, you can find me cooking, running, and weightlifting. 
              I'm always excited to collaborate on projects that create meaningful impact.
            </p>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => scrollToSection('experiences')}
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Experiences</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Experiences Section */}
      <section id="experiences" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Building2 className="w-10 h-10 mr-4 text-[#FFF2D7]" />
            Professional Experience
          </h2>
          
          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-8 border border-[#FFF2D7]/20 hover:border-[#FFF2D7] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,242,215,0.25)]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#FFF2D7] mb-2">{exp.title}</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-[#FFF2D7]/75 mb-4">
                      <span className="font-semibold">{exp.company}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>
                  <div className="text-[#FFF2D7]/60 font-mono text-sm md:text-base">
                    {exp.period}
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-[#FFF2D7]/75 flex items-start">
                      <span className="text-[#FFF2D7] mr-2">▹</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#FFF2D7]/20">
                  {exp.technologies.map((tech, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-[#FFF2D7]/15 text-[#FFF2D7] rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Projects</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Briefcase className="w-10 h-10 mr-4 text-[#FFF2D7]" />
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-6 border border-[#FFF2D7]/20 hover:border-[#FFF2D7] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,242,215,0.25)] group"
              >
                {project.image && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-[#FFF2D7]/20">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-[#FFF2D7]/60 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-[#FFF2D7]/15 text-[#FFF2D7] rounded-full text-xs font-medium"
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
                    className="flex-1 px-4 py-2 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                  <a 
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => scrollToSection('skills')}
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Skills</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="min-h-screen py-20 relative">
        <div className="max-w-4xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Award className="w-10 h-10 mr-4 text-[#FFF2D7]" />
            Technical Skills
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillSet, idx) => (
              <div 
                key={idx}
                className="bg-transparent rounded-xl p-6 border border-[#FFF2D7]/20 hover:border-[#FFF2D7] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,242,215,0.25)]"
              >
                <h3 className="text-xl font-bold mb-4 text-[#FFF2D7]">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-[#FFF2D7]/10 rounded-lg text-sm hover:bg-[#FFF2D7]/25 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Contact</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-2xl mx-auto px-6 text-center z-10">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-xl text-[#FFF2D7]/75 mb-8">
            I'm always open to discussing new projects, opportunities, or collaborations.
          </p>
          
          {/* Contact Info */}
          <div className="mb-12">
            <a
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105"
            >
              <MapPin className="w-5 h-5" />
              <span>Los Angeles, CA</span>
            </a>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:neiv06@g.ucla.edu"
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </a>
            
            <a 
              href="https://github.com/neiv06"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/neiv-gupta/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => scrollToSection('home')}
              className="px-6 py-3 bg-[#343231] text-[#FFF2D7] border-2 border-[#FFF2D7] hover:bg-[#FFF2D7] hover:text-[#343231] rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-[#FFF2D7]/15 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-[#FFF2D7]/60">
          <p className="font-mono">© 2026 Neiv Gupta</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;