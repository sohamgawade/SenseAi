"use client"
import React, { useState } from 'react';

import { useRouter } from "next/navigation";


import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Menu, X, Brain, MessageCircle, FileText, Route, PenTool, ChevronRight, Sparkles, Target, TrendingUp, Users, Clock, Star } from 'lucide-react';

export default function Home() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const router = useRouter();
   

  const aiTools = [
    {
      icon: MessageCircle,
      title: "AI Career Q&A Chat",
      description: "Chat with AI Agent",
      action: "Ask Now",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "AI Resume Analyzer",
      description: "Improve your resume",
      action: "Analyze Now",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Route,
      title: "Career Roadmap Generator",
      description: "Build your roadmap",
      action: "Generate Now",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: PenTool,
      title: "Cover Letter Generator",
      description: "Write a cover letter",
      action: "Create Now",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "Get tailored career advice based on your unique profile and goals"
    },
    {
      icon: TrendingUp,
      title: "Real-time Market Insights",
      description: "Stay ahead with current industry trends and job market data"
    },
    {
      icon: Users,
      title: "Expert AI Analysis",
      description: "Leverage advanced AI for professional resume and skill analysis"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access career guidance whenever you need it, day or night"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">WorkspaceAI</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Tools</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">My History</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Billing</a>
                <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">Profile</a>
              </div>
            </div>

            {/* Auth Button */}
            <div className="hidden md:block">
              {!user ? (
                <SignInButton mode='modal' signUpForceRedirectUrl={'/dashboard'}>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                    Get Started
                  </button>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-lg border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Tools</a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">My History</a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Billing</a>
              <a href="#" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Profile</a>
              {!user && (
                <SignInButton mode='modal' signUpForceRedirectUrl={'/dashboard'}>
                  <button className="w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 text-white block px-3 py-2 text-base font-medium rounded-lg mt-4">
                    Get Started
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white p-1 ps-3 rounded-full mb-8 hover:bg-white/15 transition-all duration-300 cursor-pointer">
            <Sparkles className="w-4 h-4" />
            Build Awesome Skills
            <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/20 font-semibold text-sm">
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            <span className="block">AI Career</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Coach Agent
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Smarter career decisions start here - get tailored advice, real-time market insights, 
            and a roadmap built just for you with the power of AI
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <a 
              href="/dashboard"
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Let's Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our AI Career Coach?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of career development with intelligent insights and personalized guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Available AI Tools
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Start Building and Shape Your Career with these exclusive AI Tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiTools.map((tool, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${tool.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <tool.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-400 mb-4">{tool.description}</p>
                <button   onClick={() => router.push("/dashboard")}
                 className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group-hover:gap-3 transition-all">
                  {tool.action}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Previous History
            </h2>
            <p className="text-xl text-gray-400">
              What you previously worked on, you can find here
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">You Do Not Have Any History</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring our AI tools to build your career development history
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
              Explore AI Tools
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                10K+
              </div>
              <p className="text-gray-400">Career Plans Created</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                95%
              </div>
              <p className="text-gray-400">Success Rate</p>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                24/7
              </div>
              <p className="text-gray-400">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-400">Crafted by <span className="text-white font-semibold">Soham Gawade</span></span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">Trusted by professionals worldwide</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}