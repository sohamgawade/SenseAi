'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Emptystate from '../_components/EmptyState'
import axios from 'axios'

import ReactMarkdown from 'react-markdown';
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
type messages={
    content:string ;
    role:string,
    type:string
}

function AiChat() {
    const [userInput,setUserInput]=useState<string>('');
    const [loading,setLoding]=useState(false);
   

   const [messageList,setMessageList]=useState<messages[]>([]);
    const {chatid}:any=useParams();
    const router=useRouter();
    console.log(chatid);

    useEffect(()=>{
   chatid && GetMessageList();
     
    
     },[chatid])
    const GetMessageList=async()=>{
      //from here we get hisorty of the url that we chat from the previous search 
      const result=await axios.get('/api/history?recordId='+chatid);
       console.log(result.data);
       setMessageList(result?.data?.content||[])//here changed ||[] this
    }

    const onSend=async()=>{
        setLoding(true);
        setMessageList(prev=>[...prev,{
           content: userInput,
            role:'user',
            type:'text'
        }])
        setUserInput('');
        const result=await axios.post('/api/ai-career-chat-agent',{
             userInput:userInput
        });
        console.log(result.data);
        setMessageList(prev=>[...prev,result.data])
        setLoding(false);
    }

     console.log(messageList);

    useEffect(()=>{
  //save messages into Database
  messageList.length>0 && updateMessageList(); 
},[messageList])


     

     const updateMessageList= async()=>{
      const result =await axios.put('/api/history',{
        content:JSON.stringify(messageList),//here we make change use chatgpt
        recordId:chatid
      });
      console.log(result);
     }

//means user when click on new hat then it will create new id for that
    const onNewChat=async()=>{
       const id=uuidv4();
    //create new record to history table
    const result=await axios.post('/api/history',{
        recordId:id,
        content:[]
    });
    console.log(result);
   router.replace("/ai-tools/ai-chat/"+id)
    }
  return (
    <div className='px-10 md:px-24 lg:px-36 xl:px-48'>
        <div className='flex items-center justify-between gap-8'>
        <div>
 <h2 className='font-bold text-lg'>AI Carrer Q/A Chat</h2>
     <p>Smarter carrer decisions start here - get tailored advice,real time market insights </p> 
        </div>
      <Button onClick={ onNewChat}>+ New Chat</Button>
      </div>

      <div className='flex flex-col h-[75vh]'>

     {messageList?.length<=0&& <div className='mt-5'>

        {/* Empty state options*/}
        <Emptystate selectedQuestion={(question:string)=>setUserInput(question)} />
      </div>}
      <div className='flex-1'>
        {/*message list displaying of chat bot*/}
        {messageList?.map((message,index)=>(
            <div>
            
            <div key={index} className={`flex mb-2 ${message.role=='user'?'justify-end':'justify-start'}`}>
            <div className={`p-3 rounded-lg gap-2 ${message.role=='user'?
                'bg-gray-200 text-black rounded-lg':
                "bg-gray-50 text-black"
            }`}>
        
               <ReactMarkdown>
            {message.content}
         </ReactMarkdown>

            </div>
            </div>
              {loading&&messageList?.length-1==index&&<div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2'>
              <LoaderCircle className='animate-spin'/> Thinking...
                </div>}
            </div>
       ))}
      </div>
       <div className='flex justify-between items-center gap-6'>
        {/*input field*/}
        <Input placeholder='Type here' value={userInput} 
        onChange={(event)=>setUserInput(event.target.value)}
        />
        <Button onClick={onSend} disabled={loading}> <Send /></Button>
      </div>

      </div>
    </div>
  )
}

export default AiChat
