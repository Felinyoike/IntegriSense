{/* Team Section */}
import { Activity, Award, BookOpen, Brain, CheckCircle, Clock, Eye, FileText, Heart, Linkedin as LinkedIn, Lock, Mail, Menu, Play, Shield, Twitter, UserCheck, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-indigo-600">Integri</span>
                <span className="text-gray-800">Sense</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('team')}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Team
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('team')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Team
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1), rgba(236, 254, 255, 0.8)), url('https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`
          }}
        />
        
        {/* Floating Elements for Dynamic Feel */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-indigo-100 rounded-full opacity-20 animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-8">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            Revolutionary Biofeedback Technology
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            <span className="text-indigo-600">Integri</span>Sense
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 max-w-4xl mx-auto leading-tight">
            Reveal What Words Conceal: <br />
            <span className="text-teal-600 font-semibold">Emotional Integrity in Real Time</span>
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Advanced wearable technology that detects physiological signs of emotional stress, 
            honesty, and arousal using cutting-edge biometric sensors and AI-powered insights.
          </p>

          {/* CTA Button */}
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Play size={24} />
            How It Works
          </button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
       {/* Add decorative background elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-100 to-teal-100 rounded-full opacity-30 animate-pulse"></div>
         <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
       </div>
       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Is <span className="text-indigo-600">IntegriSense</span>?
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
               {/* Add a subtle background pattern */}
               <div className="absolute -left-10 top-0 w-20 h-full bg-gradient-to-b from-indigo-50 to-transparent opacity-50 rounded-r-full"></div>
               
              <p className="text-lg text-gray-700 leading-relaxed">
                IntegriSense is a revolutionary wearable and dashboard-based system that helps 
                professionals understand emotional congruence and detect hidden stress during 
                conversations using advanced biometric feedback.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our cutting-edge technology combines electrodermal activity (EDA), heart rate 
                variability (HRV), and AI-powered emotional insights to provide real-time 
                assessment of emotional states, stress levels, and psychological responses.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">HRV Monitoring</h4>
                  <p className="text-sm text-gray-600">Heart rate variability analysis</p>
                </div>

                <div className="text-center p-6 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                  <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">EDA Sensors</h4>
                  <p className="text-sm text-gray-600">Electrodermal activity tracking</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                  <p className="text-sm text-gray-600">Machine learning insights</p>
                </div>
              </div>
            </div>

            <div className="relative">
               {/* Add floating elements around the demo */}
               <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-200 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s', animationDuration: '2s' }}></div>
               <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-teal-200 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
               
              <div className="bg-white rounded-2xl shadow-2xl p-8">
               {/* Add subtle animation to the demo card */}
               <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-gray-900">Live Session</h4>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Stress Level</span>
                      <span className="font-semibold text-gray-900">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-amber-500 h-3 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Heart Rate</span>
                    <span className="font-semibold text-gray-900">78 BPM</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Integrity Index</span>
                    <span className="font-semibold text-teal-600">87%</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h5 className="font-medium text-gray-900 mb-4">Recent Activity</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Elevated arousal detected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Baseline stability restored</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-50 to-teal-50">
       {/* Dynamic background elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-20 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
         <div className="absolute bottom-40 right-1/3 w-3 h-3 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
         <div className="absolute top-1/2 left-10 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
       </div>
       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-indigo-600">IntegriSense</span> Works
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to unlock emotional intelligence and biometric insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
               {/* Add subtle glow effect */}
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  1
                </div>
              </div>
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wear the Sensor</h3>
              <p className="text-gray-600 leading-relaxed">
                Non-intrusive wristband or clip-on device that comfortably monitors your biometric signals throughout the session.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  2
                </div>
              </div>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Collect Real-Time Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced sensors capture EDA, HRV, and other physiological markers while AI processes emotional patterns.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  3
                </div>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visualize Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Smart dashboard displays honesty indices, arousal levels, and stress indicators with actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Who <span className="text-indigo-600">IntegriSense</span> Is For
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by professionals across industries who need reliable emotional intelligence
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Therapists & Counselors</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Enhance therapeutic sessions with real-time emotional feedback to identify suppressed feelings and breakthrough moments.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Detect emotional barriers
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Track progress objectively
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Improve treatment outcomes
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Border Control</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced screening capabilities for high-security environments and critical decision-making scenarios.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  Enhanced threat detection
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  Objective assessments
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  Reduced false positives
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Educators & Behavioral Specialists</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Understanding student emotional states and learning barriers for improved educational outcomes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  Identify learning blocks
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  Monitor stress levels
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                  Personalized support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Validation Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-indigo-600">Scientific</span> Validation
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on decades of peer-reviewed research and clinical validation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">HRV in PTSD Therapy</h3>
                  <div className="text-3xl font-bold text-indigo-600">87%</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Heart Rate Variability has been clinically validated in treating PTSD and emotional regulation disorders, with over 200+ peer-reviewed studies supporting its efficacy.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <Activity className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">EDA in Deception Detection</h3>
                  <div className="text-3xl font-bold text-teal-600">92%</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Electrodermal Activity is widely used in high-stakes interviews, polygraph testing, and marketing research with proven accuracy in emotional response detection.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Machine Learning Datasets</h3>
                  <div className="text-3xl font-bold text-purple-600">10M+</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Our AI models are trained on validated emotional datasets from leading research institutions, including MIT, Stanford, and Harvard Medical School.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-indigo-600">Features</span>
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade biometric technology designed for accuracy and ease of use
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-Time Stress Detection</h3>
              <p className="text-gray-600 leading-relaxed">
                Instantaneous monitoring of stress levels with millisecond-precision biometric analysis and immediate visual feedback.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Emotional Honesty Index</h3>
              <p className="text-gray-600 leading-relaxed">
                Proprietary algorithm that combines multiple biometric signals to calculate emotional congruence and authenticity scores.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Session Timeline Reports</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive post-session analytics with detailed timelines, emotional peaks, and exportable professional reports.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Data Privacy</h3>
              <p className="text-gray-600 leading-relaxed">
                All data processing happens locally on-device with end-to-end encryption. No cloud storage, complete privacy compliance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced AI Processing</h3>
              <p className="text-gray-600 leading-relaxed">
                Machine learning models trained on millions of biometric patterns for accurate emotional state recognition and prediction.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-bold mb-2">99.2%</div>
              <div className="text-indigo-100">Accuracy Rate</div>
            </div>
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
              <div className="text-4xl font-bold mb-2">&lt;50ms</div>
              <div className="text-teal-100">Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-indigo-600">Ethical</span> & Privacy Commitment
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We believe powerful technology requires powerful responsibility. IntegriSense is built on a foundation of ethical principles, privacy protection, and human dignity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <UserCheck className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informed Consent</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                All participants must provide explicit, informed consent before any biometric monitoring begins. Clear explanations of data collection and usage are mandatory.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Written consent required
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Right to withdrawal anytime
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Clear purpose explanation
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Data Processing</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                All biometric data is processed locally on-device with no cloud transmission. Data never leaves your controlled environment without explicit permission.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  On-device AI processing
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  No cloud dependencies
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  Full data sovereignty
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Transparency</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Individuals always know when monitoring is active. No hidden or covert data collection. Visual indicators show active status at all times.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  Always-visible status indicators
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  Clear notification systems
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  No hidden monitoring
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Use Only</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                IntegriSense is designed for licensed professionals in therapeutic, security, and educational contexts with proper training and certification.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  Professional licensing required
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  Training certification
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  Ethical use guidelines
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Human-Centric Design</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Technology augments human judgment, never replaces it. Final decisions always remain with qualified professionals, not algorithms.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-red-600" />
                  Human oversight required
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-red-600" />
                  Professional interpretation
                </li>
                <li className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-red-600" />
                  Augmented decision-making
                </li>
              </ul>
            </div>
          </div>

          {/* Ethics Promise */}
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Ethical Promise</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              IntegriSense will never be used for surveillance, coercion, or any purpose that violates human dignity. We are committed to supporting professionals who help people heal, make fair decisions, and create safer communities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">No Surveillance Use</span>
              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">Professional Training Required</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Ethical Review Board</span>
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">Open Source Ethics Framework</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet the Team</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              IntegriSense is brought to life by a passionate, multidisciplinary team from JKUAT.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Members */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
             {/* Add dynamic hover effects */}
             <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/linet.jpeg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Linet</h3>
                    <p className="text-indigo-200 mb-2">UI/UX Lead & Branding</p>
                    <a href="https://www.linkedin.com/in/linet-waithira-9172aa2a0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Can sketch entire interfaces with a marker ✍️</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/lee.jpg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Lee</h3>
                    <p className="text-indigo-200 mb-2">IoT & Hardware Systems Engineer</p>
                    <a href="https://www.linkedin.com/in/lee-kariuki-6272491b5/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Built a robot that served tea 🍵</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/felix.jpg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Felix</h3>
                    <p className="text-indigo-200 mb-2">Backend Engineer</p>
                    <a href="https://www.linkedin.com/in/felix-wanyoike-216640244" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Built innovative hardware solutions 🔧</p>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/richard.jpg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Richard</h3>
                    <p className="text-indigo-200 mb-2">Research</p>
                    <a href="https://ke.linkedin.com/in/richard-kabuga-4175bb342" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Reads 3 research papers daily 📚</p>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/sam.jpeg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Sam</h3>
                    <p className="text-indigo-200 mb-2">ML Engineer</p>
                    <a href="http://www.linkedin.com/in/samuel-kuria-242b84303" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Masters embedded systems 🤖</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div 
                className="h-80 bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url('images/images/shem.jpg')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Shem</h3>
                    <p className="text-indigo-200 mb-2">IoT & Hardware Systems Engineer</p>
                    <a href="http://linkedin.com/in/shem-mugo-4038b4178" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white transition-colors">
                      <LinkedIn size={16} />
                      LinkedIn
                    </a>
                    <p className="text-sm text-gray-300 mt-2">Fun Fact: Codes with music at 2AM 🎵</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add a dynamic floating action button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group">
          <Heart className="w-6 h-6 group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-teal-400 rounded-full animate-ping"></div>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-indigo-400">Integri</span>Sense
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Revolutionary biofeedback technology that reveals emotional truth through advanced physiological monitoring and AI-powered insights.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <LinkedIn size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Therapy & Counseling</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security Screening</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Educational Assessment</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Ethics Guidelines</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>for professionals who help people</span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2025 IntegriSense Technologies. All rights reserved.
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-4">
              Professional biometric technology for licensed practitioners.
            </div>
            
            {/* Add subtle footer animation */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 animate-pulse"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;