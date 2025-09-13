'use client'
// RoadmapGenratorAgent.tsx
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import RoadmapCanvas from '../_components/RoadmapCanvas';
import RoadmapGeneratorDialog from '@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog';

function RoadmapGenratorAgent() {
  const { roadmapid } = useParams();
  const [roadMapDetail, setRoadMapDetails] = useState<any>();
const [openRoadmapDialog,setOpenRoadmapDialog]=useState(false);
  useEffect(() => {
    roadmapid && GetRoadmapDetails();
  }, [roadmapid]);

  const GetRoadmapDetails = async () => {
    try {
      const result = await axios.get('/api/history?recordId=' + roadmapid);
      const roadMapData = result.data?.content;

      if (roadMapData && roadMapData.initialNodes) {
        // Add the 'turbo' type to each node so ReactFlow knows which component to render
        const updatedNodes = roadMapData.initialNodes.map((node: any) => ({
          ...node,
          type: "turbo" 
        }));

        setRoadMapDetails({
          ...roadMapData,
          initialNodes: updatedNodes
        });
      } else {
        setRoadMapDetails(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-5 '>
      <div className='border rounded-xl p-5'>
        <h2 className='font-bold text-2xl'> {roadMapDetail?.roadmapTitle}</h2>
        <p className='mt-3 text-gray-500'><strong>Description</strong>:<br></br>{roadMapDetail?.description}</p>
        <h2 className='mt-5 font-medium text-blue-600'>Duration:{roadMapDetail?.duration}</h2>
        <Button onClick={()=>setOpenRoadmapDialog(true)} className='mt-5 w-full'>+ Create Another Roadmap</Button>
      </div>
      <div className='md:col-span-2 w-full h-[80vh]'>
        <RoadmapCanvas initialNodes={roadMapDetail?.initialNodes} initialEdges={roadMapDetail?.initialEdges} />
      </div>
       <RoadmapGeneratorDialog 
 openDialog={openRoadmapDialog}
 setOpenDialog={()=>setOpenRoadmapDialog(false)}
 />
    </div>
  );
}

export default RoadmapGenratorAgent;