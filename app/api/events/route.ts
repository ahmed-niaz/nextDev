import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

export async function POST(req: NextRequest) {
  try {
    await connectDB;

    // todo: pass the data using formData
    const formData = await req.formData();

    // todo: need to parse form data
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        {
          message: "invalid json data",
          error: e instanceof Error ? e.message : String(e),
        },
        { status: 400 }
      );
    }

    // todo: cloudinary image uploader
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "NextDev" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    event.image = (uploadImage as { secure_url: string }).secure_url;

    // todo: if properly parse formData then create an event into DB
    const createdEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: "event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}
