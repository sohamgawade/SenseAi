import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { AiCareerAgent, AiResumeAgent } from "../../../inngest/functions";


export const { GET, POST, PUT } = serve({ 
  client: inngest, 
  functions: [ 
    /* your functions will be passed here later! */ 
    //when we created the functions like functions.ts in that AiCareerAgent and all should be added here 
    AiCareerAgent, 
    AiResumeAgent 
  ], 
});
