import { NextRequest, NextResponse } from "next/server";
import { processIncomingMessage } from "@/lib/services/messageProcessingService";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const userRole = (formData.get("userRole") as string) || "Event Organizer";
    const senderName = (formData.get("senderName") as string) || "Document Submitter";
    const eventId = (formData.get("eventId") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 10MB size limit" }, { status: 400 });
    }

    const textContent = await file.text();
    const cleanText = textContent.slice(0, 3000); // Extract relevant context

    const result = await processIncomingMessage({
      message: `[Document Upload: ${file.name}]\n${cleanText}`,
      sourceType: "document",
      userRoleOverride: userRole,
      senderNameOverride: senderName,
      eventId,
    });

    return NextResponse.json(
      {
        success: true,
        fileName: file.name,
        sizeBytes: file.size,
        result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Document processing failed";
    console.error("[EventMind Upload API Error]", errMessage);
    return NextResponse.json(
      { error: "Document processing failed", details: errMessage },
      { status: 500 }
    );
  }
}
