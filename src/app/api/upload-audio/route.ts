import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "audio/aac",
      "audio/m4a",
      "audio/x-m4a",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|webm|aac|m4a)$/i)) {
      return NextResponse.json(
        { error: "Invalid audio file type. Supported: MP3, WAV, OGG, WebM, AAC, M4A" },
        { status: 400 }
      );
    }

    await ensureUploadsDir();

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(file.name) || ".mp3";
    const filename = `audio-${timestamp}-${randomSuffix}${extension}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    await writeFile(filepath, uint8Array);

    // Return the public URL
    // Duration will be detected on the client side using the Audio element
    const audioUrl = `/uploads/${filename}`;

    return NextResponse.json({
      audioUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Error uploading audio:", error);
    return NextResponse.json(
      { error: "Failed to upload audio file" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json(
        { error: "No filename provided" },
        { status: 400 }
      );
    }

    // Security: Ensure filename doesn't contain path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const filepath = path.join(UPLOADS_DIR, filename);

    // Check if file exists and delete
    if (existsSync(filepath)) {
      const { unlink } = await import("fs/promises");
      await unlink(filepath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting audio:", error);
    return NextResponse.json(
      { error: "Failed to delete audio file" },
      { status: 500 }
    );
  }
}
