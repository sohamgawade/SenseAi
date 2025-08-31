import { report } from 'process';
import React, { useState } from 'react'
import { Sparkles } from "lucide-react";
import ResumeUploadDialog from '@/app/(routes)/dashboard/_components/ResumeUploadDialog';
function Report({ aiReport }: any) {
    const [openResumeUpload,setOpenResumeDialog]=useState(false);
  // Debug: Log the aiReport structure to console
  console.log('aiReport structure:', aiReport);

  // Helper function to safely get nested values from sections array
  const getSectionData = (sectionName: string) => {
    const section = aiReport?.sections?.find((s: any) => s[sectionName]);
    return section?.[sectionName] || {};
  };

  const getScore = (sectionName: string) => {
    const sectionData = getSectionData(sectionName);
    return sectionData?.score || 0;
  };

  const getComment = (sectionName: string) => {
    const sectionData = getSectionData(sectionName);
    return sectionData?.comment || "No feedback available";
  };

  const getTips = (sectionName: string) => {
    const sectionData = getSectionData(sectionName);
    return sectionData?.tips_for_improvement || [];
  };

  const getWhatsGood = (sectionName: string) => {
    const sectionData = getSectionData(sectionName);
    return sectionData?.whats_good || [];
  };

  // Helper function to get border and background color based on score
  const getBorderColor = (score: number) => {
    if (score < 50) {
      return 'border-red-500';
    } else if (score < 80) {
      return 'border-yellow-500';
    } else {
      return 'border-green-500';
    }
  };

  // Helper function to get score number color based on score
  const getScoreColor = (score: number) => {
    if (score < 50) {
      return 'text-red-500';
    } else if (score < 80) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  };

  // Helper function to get hover border color based on score
  const getHoverBorderColor = (score: number) => {
    if (score < 50) {
      return 'bg-red-500';
    } else if (score < 80) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  };

  // Get global arrays safely
  const globalNeedsImprovement = aiReport?.needs_improvement || [];
  
  // Collect all tips from all sections
  // @ts-ignore
  const allTips: string[] = [];
  if (aiReport?.sections) {
    aiReport.sections.forEach((section: any) => {
      Object.keys(section).forEach(key => {
        const tips = section[key]?.tips_for_improvement || [];
        allTips.push(...tips);
      });
    });
  }

  // Collect all "what's good" from all sections
  // @ts-ignore
  const allWhatsGood: string[] = [];
  if (aiReport?.sections) {
    aiReport.sections.forEach((section: any) => {
      Object.keys(section).forEach(key => {
        const goods = section[key]?.whats_good || [];
        allWhatsGood.push(...goods);
      });
    });
  }

  return (
    
<div>
<div>
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-extrabold text-gray-800 gradient-component-text">
      AI Analysis Results
    </h2>
    <button
      type="button"
      className="flex items-center gap-2 text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 transition"
      onClick={()=>setOpenResumeDialog(true)}
    >
      Re-analyze <Sparkles className="w-4 h-4" />
    </button>
  </div>
</div>

      {/* Overall Score */}
      <div className="p-5 bg-gradient-to-r from-[#BE575F] via-[#A338E3] to-[#AC76D6] rounded-xl">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
        </h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-6xl font-extrabold text-white">
            {aiReport?.score || 0}
            <span className="text-2xl">/100</span>
          </span>
          <div className="flex items-center">
            <i className="fas fa-arrow-up text-green-500 text-lg mr-2"></i>
            <span className="text-green-500 text-lg font-bold">
              {aiReport?.overall_feedback || "Analysis Complete!"}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-white h-2.5 rounded-full"
            style={{ width: `${aiReport?.score || 0}%` }}
          ></div>
        </div>
        <p className="text-gray-200 text-sm">
          Overall assessment: {aiReport?.overall_feedback || "Resume analysis completed successfully."}
        </p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Contact Info */}
        <div className={`bg-white rounded-lg shadow-md p-5 border-2 ${getBorderColor(getScore('contact_info'))} relative overflow-hidden group`}>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            <i className="fas fa-user-circle text-gray-500 mr-2"></i> Contact Info
          </h4>
          <span className={`text-4xl font-bold ${getScoreColor(getScore('contact_info'))}`}>
            {getScore('contact_info')}%
          </span>
          <p className="text-sm text-gray-600 mt-2">
            {getComment('contact_info')}
          </p>
          <div className={`absolute inset-x-0 bottom-0 h-1 ${getHoverBorderColor(getScore('contact_info'))} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>

        {/* Experience */}
        <div className={`bg-white rounded-lg shadow-md p-5 border-2 ${getBorderColor(getScore('experience'))} relative overflow-hidden group`}>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            <i className="fas fa-briefcase text-gray-500 mr-2"></i> Experience
          </h4>
          <span className={`text-4xl font-bold ${getScoreColor(getScore('experience'))}`}>
            {getScore('experience')}%
          </span>
          <p className="text-sm text-gray-600 mt-2">
            {getComment('experience')}
          </p>
          <div className={`absolute inset-x-0 bottom-0 h-1 ${getHoverBorderColor(getScore('experience'))} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>

        {/* Education */}
        <div className={`bg-white rounded-lg shadow-md p-5 border-2 ${getBorderColor(getScore('education'))} relative overflow-hidden group`}>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            <i className="fas fa-graduation-cap text-gray-500 mr-2"></i> Education
          </h4>
          <span className={`text-4xl font-bold ${getScoreColor(getScore('education'))}`}>
            {getScore('education')}%
          </span>
          <p className="text-sm text-gray-600 mt-2">
            {getComment('education')}
          </p>
          <div className={`absolute inset-x-0 bottom-0 h-1 ${getHoverBorderColor(getScore('education'))} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>

        {/* Skills */}
        <div className={`bg-white rounded-lg shadow-md p-5 border-2 ${getBorderColor(getScore('skills'))} relative overflow-hidden group`}>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            <i className="fas fa-lightbulb text-gray-500 mr-2"></i> Skills
          </h4>
          <span className={`text-4xl font-bold ${getScoreColor(getScore('skills'))}`}>
            {getScore('skills')}%
          </span>
          <p className="text-sm text-gray-600 mt-2">
            {getComment('skills')}
          </p>
          <div className={`absolute inset-x-0 bottom-0 h-1 ${getHoverBorderColor(getScore('skills'))} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-5 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
          <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Tips for Improvement
        </h3>
        {allTips.length > 0 ? (
          <ol className="list-none space-y-4">
            {allTips.map((tip: string, i: number) => (
              <li className="flex items-start" key={i}>
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 text-xs">
                  {i + 1}
                </span>
                <div>
                  <p className="text-gray-600 text-sm">{tip}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 text-sm">No specific improvement tips available.</p>
        )}
      </div>

      {/* What's Good / Needs Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 border border-green-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-thumbs-up text-green-500 mr-2"></i> What's Good
          </h3>
          {allWhatsGood.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              {allWhatsGood.map((good: string, i: number) => (
                <li key={i}>{good}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Analyzing strengths...</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border border-red-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-thumbs-down text-red-500 mr-2"></i> Needs Improvement
          </h3>
          {globalNeedsImprovement.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              {globalNeedsImprovement.map((need: string, i: number) => (
                <li key={i}>{need}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Analyzing areas for improvement...</p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6 text-center gradient-button-bg">
        <h3 className="text-2xl font-bold mb-3">Ready to refine your resume? 💪</h3>
        <p className="text-base mb-4">
          Make your application stand out with our premium insights and features.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm bg-white text-blue-600 hover:bg-gray-100 transition"
        >
          Upgrade to Premium <i className="fas fa-arrow-right ml-2 text-blue-600"></i>
        </button>
      </div>

      <ResumeUploadDialog openResumeUpload={openResumeUpload} setOpenResumeDialog={ ()=>setOpenResumeDialog(false)}/>
    </div>
  )
}
export default  Report;