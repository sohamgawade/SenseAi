
import { HistoryTable } from "@/configs/schema";
import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import ImageKit from "imagekit";
import { db } from "@/configs/db";
import { create } from "domain";
 
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
// This agent is only used for the resume analysis function.
export const AiResumeAnalyzerAgent = createAgent({
  name: 'AiResumeAnalyzerAgent',
  description: 'AI Resume Analyzer Agent help to Return Report',
  system: `You are an advanced AI Resume Analyzer Agent. Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format. The analysis must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.

🎯 INPUT: I will provide a plain text resume.
✅ GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0-100)

overall_feedback (short message e.g. "Excellent", "Needs improvement")

summary_comment (1-2 sentence evaluation summary)

Section scores for:

Contact info
Experience
Education
Skills

Each section should include:

score (as a percentage from 0 to 100)

Optional comment about that section
Tips for improvement (3-5 tips)
What's Good (3-5 strengths)
Needs Improvement (1-3 weaknesses)

🖥️ Output JSON Schema:

{
  "score": null,
  "overall_feedback": "",
  "summary_comment": "",
  "sections": [
    {
      "contact_info": {
        "score": null,
        "comment": ""
      }
    },
    {
      "experience": {
        "score": null,
        "comment": ""
      }
    },
    {
      "education": {
        "score": null,
        "comment": ""
      }
    },
    {
      "skills": {
        "score": null,
        "comment": ""
      }
    }
  ],
  "tips_for_improvement": [],
  "whats_good": [],
  "needs_improvement": []
}
`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});

// Initialize ImageKit safely
var imagekit = new ImageKit({
  //@ts-ignore
  publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
  //@ts-ignore
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  //@ts-ignore. //to avoid error
  urlEndpoint : process.env.IMGAGEKIT_ENDPOINT_URL
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
//Create AiRoadmapGeneratoragent
export const AIRoadmapGenratorAgent=createAgent({
  name:'AIRoadmapGeneratorAgent',
  description:'Generate Details Tree Like Flow Roadmap',
  system:`Generate a React flow tree-structured learning roadmap for user input position/ skills the following format:
 vertical tree structure with meaningful x/y positions to form a flow
Structure should be similar to roadmap.sh layout
Steps should be ordered from fundamentals to advanced
Include branching for different specializations (if applicable)
Each node must have a title, short description, and learning resource link
Use unique IDs for all nodes and edges
make it more specious node position,
Response in JSON format
{
roadmapTitle:"",
description:<3-5 Lines>,
duration:"",
initialNodes : [
{
id: '1',
type: 'turbo',
position: { x: 0, y: 0 },
data: {
title: 'Step Title',
description: 'Short two-line explanation of what the step covers.',
link: 'Helpful link for learning this step',
},
},
...
],
initialEdges : [
{
id: 'e1-2',
source: '1',
target: '2',
},
...
];
}
`,
  model: gemini({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY
  })
});


// AiResumeAgent
export const AiResumeAgent = inngest.createFunction(
  { id: "AiResumeAgent" },
  { event: "AiResumeAgent" },
  async ({ event, step }) => {
    console.log("Received event data:", event.data);
    
    const { recordId, base64ResumeFile, pdfText, userEmail, aiAgentType } = event.data;

    // Validate required data
    if (!base64ResumeFile) {
      throw new Error("Resume file (base64) is missing");
    }

    if (!recordId) {
      throw new Error("Record ID is missing");
    }

    if (!aiAgentType) {
      throw new Error("AI Agent Type is missing");
    }

    // Step 1: Upload the resume PDF to ImageKit
    const uploadFileUrl = await step.run("uploadImage", async () => {
      const imageKitFile = await imagekit.upload({
        file: base64ResumeFile,
        fileName: `${Date.now()}.pdf`,
        isPublished: true,
      });
      return imageKitFile.url;
    });

    let aiResumeReport;

    try {
      console.log("Sending PDF text to AI agent:", pdfText);
      
      aiResumeReport = await AiResumeAnalyzerAgent.run(pdfText);
      
      console.log("Received AI report:", aiResumeReport);
    } catch (error) {
      console.error("AI Agent failed to run:", error);
      throw new Error("Resume analysis failed. Please check the server logs for details.");
    }

    console.log("Final AI Resume Report:", aiResumeReport);

    // Step 2: Parse AI response
    const parsedJson = await step.run("Finalization", async () => {
      try {
        // @ts-ignore
        let rawContent = aiResumeReport.output[0].content;

        rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(rawContent);

        console.log("Parsed Resume Report:", parsed);

        return parsed;
      } catch (err) {
        console.error("Failed to parse AI resume report:", err);
        return { error: "Invalid JSON format in AI report", raw: aiResumeReport };
      }
    });

    // ✅ Step 3: Save to DB (Fixed)
    const SaveToDb = await step.run("SaveToDb", async () => {
      try {
        console.log("Attempting to save to DB with data:", {
          recordId,
          content: parsedJson,
          aiAgentType,
          userEmail,
          metaData:uploadFileUrl 
        });

        const result = await db.insert(HistoryTable).values({
          recordId: recordId as string, // Ensure it's a string
          content: parsedJson,
          aiAgentType: aiAgentType as string, // Ensure it's a string
          userEmail: userEmail as string, // Ensure it's a string
           metaData: uploadFileUrl, // createdAt will be auto-set by defaultNow()
        }).returning(); // Add .returning() to get the inserted record

        console.log("DB Insert Result:", result);
        
        if (result && result.length > 0) {
          console.log("Successfully inserted record with ID:", result[0].id);
          return parsedJson;
        } else {
          throw new Error("No record was inserted");
        }
      } catch (error) {
        console.error("Database insertion failed:", error);
        // Log the specific error details
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        throw error;
      }
    });

    return SaveToDb;
  }
);

export const AIRoadmapAgent = inngest.createFunction(
   {id:'AiRoadMapAgent'},
   {event:'AiRoadMapAgent'}, // Change this to match what you're sending
   async({event,step}) => {
     const {roadmapId,userInput,userEmail} = event.data; // Remove await here too
     const roadmapResult = await AIRoadmapGenratorAgent.run("UserInput:"+userInput);
       // @ts-ignore
        const rawContent = roadmapResult.output[0].content;

        const rawContentJson = rawContent.replace('```json', '').replace('```', '');

        const parseJson = JSON.parse(rawContentJson);

     //return roadmapResult;
     //Save to DB
const saveToDb = await step.run('SaveToDb', async () => {
  const result = await db.insert(HistoryTable).values({
    recordId: roadmapId,
    content: parseJson,
    aiAgentType:'/ai-tools/ai-roadmap-agent',
    createdAt: (new Date()),//is string not timestsmp
    userEmail: userEmail,
    metaData: userInput
  });
  console.log(result);
  return parseJson
})

   }
)