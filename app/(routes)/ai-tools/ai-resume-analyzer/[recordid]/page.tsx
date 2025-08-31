"use client"

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Report from './_components/Report';

function AiResumeAnalyzer() {
  const {recordid}=useParams();
  const [pdfUrl,setPdfUrl]=useState();
  const [aiReport,setAiReport]=useState();

  useEffect(()=>{
    recordid && GetResumeAnalyzerRecord();
  },[recordid])

  const GetResumeAnalyzerRecord=async()=>{
    const result=await axios.get('/api/history?recordId='+recordid);
    console.log(result.data);
    setPdfUrl(result.data?.metaData);
    setAiReport(result.data?.content);
  }

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Left Side - AI Report */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="font-bold text-2xl mb-4 text-gray-800">AI Resume Analysis</h2>
        <div className="overflow-y-auto max-h-[85vh] pr-2">
          <Report aiReport={aiReport} />
        </div>
      </div>

      {/* Right Side - Resume Preview */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="font-bold text-2xl mb-4 text-gray-800">Resume Preview</h2>
        <div className="overflow-hidden rounded-xl border">
          <iframe
            src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
            width="100%"
            height="900"
            className="rounded-xl"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}

export default AiResumeAnalyzer;
