import { NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const rawAudioFile = formData.get("file") as File;

    if (!rawAudioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Sarvam API rejects MIME types with codec parameters (e.g. 'audio/webm;codecs=opus')
    // We normalize to simple allowed types like 'audio/webm' or 'audio/wav'
    let baseMime = rawAudioFile.type ? rawAudioFile.type.split(";")[0].trim() : "audio/webm";
    const allowedTypes = [
      "audio/webm",
      "video/webm",
      "audio/wav",
      "audio/mp4",
      "audio/mpeg",
      "audio/ogg",
      "audio/opus",
    ];

    if (!allowedTypes.includes(baseMime)) {
      baseMime = "audio/webm";
    }

    const arrayBuffer = await rawAudioFile.arrayBuffer();
    const normalizedFile = new File([arrayBuffer], "recording.webm", {
      type: baseMime,
    });

    const response = await client.speechToText.transcribe({
      file: normalizedFile,
      model: "saaras:v3",
      mode: "transcribe",
    });

    return NextResponse.json({ transcript: response.transcript || "" });
  } catch (error: any) {
    console.error("STT Error:", error);
    return NextResponse.json(
      { error: error?.message || "Speech transcription failed" },
      { status: 500 }
    );
  }
}
