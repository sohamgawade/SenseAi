// API Route (route.ts) chatgpt
import { NextRequest, NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { inngest } from "@/inngest/client";
import axios from "axios";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile: any = formData.get("resumeFile");
    const recordId = formData.get("recordId");
    const user = await currentUser();

    if (!resumeFile) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    if (!recordId) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const loader = new WebPDFLoader(resumeFile);
    const docs = await loader.load();
    console.log("PDF first page:", docs[0]);

    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const resultIds = await inngest.send({
      name: "AiResumeAgent",
      data: {
        recordId: recordId as string, // Ensure it's a string
        base64ResumeFile: base64,
        pdfText: docs[0]?.pageContent || "",
        aiAgentType: "/ai-tools/ai-resume-analyzer", // Make sure this value is correct
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
      },
    });

    const runId = resultIds?.ids[0];
    
    if (!runId) {
      return NextResponse.json({ error: "Failed to start AI agent" }, { status: 500 });
    }

    let runStatus;
    let attempts = 0;
    const maxAttempts = 120; // 60 seconds timeout

    while (attempts < maxAttempts) {
      try {
        runStatus = await getRuns(runId);

        if (
          Array.isArray(runStatus?.data) &&
          runStatus.data[0]?.status === "Completed"
        ) {
          break;
        }

        if (runStatus?.data?.[0]?.status === "Failed") {
          console.error("Inngest function failed:", runStatus.data[0]);
          return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
        }

        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      } catch (error) {
        console.error("Error checking run status:", error);
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json({ error: "Processing timeout" }, { status: 408 });
    }

    return NextResponse.json(runStatus.data?.[0]?.output);
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
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