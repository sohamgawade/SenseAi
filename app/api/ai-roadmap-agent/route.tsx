import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { useReducer } from "react";

export async function POST(req:NextRequest){
    const {roadmapId,userInput}=await req.json();
 const user=await currentUser();

const resultIds=await inngest.send({
        name:'AiRoadMapAgent',
        data:{
            userInput:userInput,
            roadmapId:roadmapId,
            userEmail:user?.primaryEmailAddress?.emailAddress
        }
    });
    const runId=resultIds?.ids[0];

    let runStatus;
    //use polling to check run status
while (true) {
  runStatus = await getRuns(runId);

  if (Array.isArray(runStatus?.data) && runStatus.data[0]?.status === "Completed") {
    break;
  }

  await new Promise(resolve => setTimeout(resolve, 500));
}

return NextResponse.json(runStatus.data?.[0]?.output?.output?.[0]);
}

export async function getRuns(runId: string) {
  const result = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );
  return result.data;
}