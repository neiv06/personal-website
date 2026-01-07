import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Terminal, Code, Briefcase, User, Award } from 'lucide-react';
import profileImage from './IMG_5040.JPG';

const Portfolio = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalText, setTerminalText] = useState('');
  const [particles, setParticles] = useState([]);
  
  const fullText = "neivgupta@portfolio:~$ whoami";
  
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
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100,
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const projects = [
    {
      title: "CudaFire",
      description: "GPU-accelerated wildfire simulation achieving 7,643x real-time speed using CUDA and real geospatial data",
      tags: ["CUDA", "C++", "GPU Computing", "GIS"],
      link: "#"
    },
    {
      title: "BruinMarket",
      description: "UCLA student marketplace with real-time messaging, JWT auth, and mobile-responsive design",
      tags: ["Go", "React", "WebSocket", "PostgreSQL"],
      link: "#"
    },
    {
      title: "AI Group Project Manager",
      description: "FastAPI application that extracts deliverables from PDFs and automates task management",
      tags: ["Python", "FastAPI", "GPT-4", "Docker", "Kubernetes"],
      link: "#"
    }
  ];
  
  const skills = [
    { category: "Languages", items: ["Go", "Rust", "Python", "C++", "CUDA", "JavaScript", "TypeScript"] },
    { category: "Frontend", items: ["React", "Tailwind CSS", "WebSocket", "Responsive Design"] },
    { category: "Backend", items: ["FastAPI", "Node.js", "PostgreSQL", "JWT Auth", "RESTful APIs"] },
    { category: "DevOps", items: ["Docker", "Kubernetes", "Railway", "Vercel", "CI/CD"] },
  ];
  
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-blue-500 opacity-20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
      
      {/* Cursor Glow Effect */}
      <div 
        className="fixed w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20 bg-blue-500 transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            <span className="font-mono text-lg font-bold">neivgupta.dev</span>
          </div>
          <div className="flex space-x-8">
            {['home', 'about', 'projects', 'skills', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="hover:text-blue-400 transition-colors capitalize font-medium"
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <img 
                  src={profileImage} 
                  alt="Neiv Gupta" 
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-gray-700 shadow-2xl hover:border-blue-500 transition-all duration-300 hover:scale-105"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-8 inline-block">
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-left border border-gray-700 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-green-400">
                    {terminalText}<span className="animate-pulse">▊</span>
                  </div>
                  <div className="text-gray-300 mt-2">
                    &gt; Full-Stack Developer | Systems Programmer | UCLA Student
                  </div>
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Neiv Gupta
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
                Building scalable applications from GPU-accelerated simulations to full-stack web platforms
              </p>
              
              <div className="flex justify-center md:justify-start space-x-4 mb-12">
                <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-all hover:scale-110">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
              
              <div className="flex justify-center md:justify-start">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="animate-bounce"
                >
                  <ChevronDown className="w-8 h-8 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative">
        <div className="max-w-4xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <User className="w-10 h-10 mr-4 text-blue-400" />
            About Me
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Who I Am</h3>
              <p className="text-gray-300 leading-relaxed">
                I'm a computer science student at UCLA with a passion for building practical applications 
                that solve real-world problems. From GPU-accelerated simulations to full-stack web platforms, 
                I love tackling complex technical challenges across the entire stack.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">What I Do</h3>
              <p className="text-gray-300 leading-relaxed">
                I specialize in systems programming, web development, and GPU computing. 
                Whether it's optimizing CUDA kernels, building scalable backends in Go, 
                or creating responsive React frontends, I thrive on turning ambitious ideas into production-ready solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative">
        <div className="max-w-6xl mx-auto px-6 z-10">
          <h2 className="text-4xl font-bold mb-12 flex items-center">
            <Briefcase className="w-10 h-10 mr-4 text-blue-400" />
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <div 
                key={idx}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all hover:scale-105 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <Code className="w-8 h-8 text-blue-400" />
                  <a href={project.link} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                  </a>
                </div>
                
                <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
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
            <Award className="w-10 h-10 mr-4 text-blue-400" />
            Technical Skills
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skillSet, idx) => (
              <div 
                key={idx}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-400">{skillSet.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillSet.items.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-4 py-2 bg-gray-700 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
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
          <h2 className="text-4xl font-bold mb-8">Let's Build Something Together</h2>
          <p className="text-xl text-gray-300 mb-12">
            I'm always open to discussing new projects, opportunities, or collaborations.
          </p>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:your.email@ucla.edu"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span>Get In Touch</span>
            </a>
            
            <a 
              href="#"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-all hover:scale-105 flex items-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>View GitHub</span>
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p className="font-mono">© 2026 Neiv Gupta.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;