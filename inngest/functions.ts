import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import ImageKit from "imagekit";

// AI Agent logic stays the same
export const AiCareerChatAgent = createAgent({
  name: 'AiCareerChatAgent',
  description: 'An Ai Agent that answers career related questions',
  system: `You are a helpful, professional AI Career Coach Agent.
Your role is to guide users with questions related to careers, including job search advice, interview preparation, resume improvement, skill development, career transitions, and industry trends.
Always respond with clarity, encouragement, and actionable advice tailored to the user's needs.
If the user asks something unrelated to careers, gently inform them that you are a career coach and suggest relevant career-focused questions instead,`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

// AiCareerAgent
export const AiCareerAgent = inngest.createFunction(
  { id: 'AiCareerAgent' },
  { event: 'AiCareerAgent' },
  async ({ event, step }) => {
    const { userInput } = event.data; // no await
    const result = await AiCareerChatAgent.run(userInput);
    return result;
  }
);

// Initialize ImageKit safely
var imagekit = new ImageKit({
  //@ts-ignore
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    //@ts-ignore
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    //@ts-ignore. //to avoid error
    urlEndpoint : process.env.IMGAGEKIT_ENDPOINT_URL
    
});

// AiResumeAgent
export const AiResumeAgent = inngest.createFunction(
  { id: 'AiResumeAgent' },
  { event: 'AiResumeAgent' },
  async ({ event, step }) => {
    
    const { recordId, base64ResumeFile, pdfText } = await event.data;

    //upload file to cloud for that we use image kit,it is free cluoud storage provider
    
  const uploadImageUrl=await step.run("uploadImage",async()=>{
    const imageKitFile=await imagekit.upload({
      file:base64ResumeFile,
      fileName:`${Date.now()}.pdf`,
      isPublished:true
    })
    return imageKitFile.url
  })
    
  }
);
