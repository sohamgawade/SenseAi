"use client"
import { Button } from '@/components/ui/button';
import {db} from '@/configs/db'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ResumeUploadDialog from './ResumeUploadDialog';
interface TOOL {
    name: string;
    desc: string;
    icon: string;
    button: string;
    path: string;
}

type AIToolProps = {
    tool: TOOL;
};

function AiToolCard({ tool }: AIToolProps) {
    const id=uuidv4(); //for creating diff id when user click on start chat from dashboard we are using uuidv4 

    const {user}=useUser();
    const router=useRouter();
const [openResumeUpload,setOpenResumeUpload]=useState(false);

    const onClickButton=async()=>{
    //create new record to history table
    if(tool.name=='AI Resume Analyzer')
    {
        setOpenResumeUpload(true);
  return ;
    }
    const result=await axios.post('/api/history',{
        recordId:id,
        content:[]
    });
    console.log(result);
   router.push(tool.path+"/"+id)
    }
    return (
        <div className='p-3 border rounded-lg'>
  <Image src={tool.icon} width={40} height={40} alt={tool.name} />
  <h3 className='font-bold mt-2'>{tool.name}</h3>
  <p className='text-grey-400'>{tool.desc}</p>

  {/* This will render your "Open" button inside the card */}
  
  {/* Your existing button stays as is */}
  <Button className='w-full mt-3' onClick={onClickButton}>
    {tool.button}
  </Button>
  <ResumeUploadDialog openResumeUpload= {openResumeUpload}
setOpenResumeDialog={setOpenResumeUpload} />
</div>

    );
}

export default AiToolCard;
