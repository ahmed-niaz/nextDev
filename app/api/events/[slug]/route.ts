import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Booking, Event } from "@/database";

type RoutesParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RoutesParams
): Promise<NextResponse> {
  try {
    // todo: connect database
    await connectDB;

    // todo: await and extract slug from the params
    const { slug } = await params;

    // todo: validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "invalid slug parameter" },
        { status: 400 }
      );
    }

    // todo: remove any potential malicious input
    const sanitizedSlug = slug.trim().toLowerCase();

    // todo: query event by slug
    const event = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `event with slug '${sanitizedSlug}' not found 🤒` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "event fetch successfully",
      event,
    });
  } catch (e) {
    // log error
    if (e instanceof Error) {
      if (e.message.includes("MONGODB_URI")) {
        return NextResponse.json(
          { message: "database configuration error" },
          { status: 500 }
        );
      }

      // generic error
      return NextResponse.json(
        {
          message: "failed to fetch",
          e: e.message,
        },
        { status: 500 }
      );
    }

    // unknown error
    return NextResponse.json(
      { message: "an unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RoutesParams) {
  try {
    // Connect to database
    await connectDB;

    // Extract slug from params
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query event by slug
    const event = await Event.findOne({
      slug: sanitizedSlug,
    }).lean();

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const eventId = event?._id;

    // Get form data
    const formData = await req.formData();
    const email = formData.get("email") as string;

    // Validate email
    if (!email || typeof email !== "string" || email.trim() === "") {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Create booking with email and event data
    const bookingData = {
      email: email.trim().toLowerCase(),
      eventId: eventId,
    };

    const newBooking = await Booking.create(bookingData);

    return NextResponse.json(
      {
        message: "Booking created successfully",
        booking: {
          id: newBooking._id,
          email: newBooking.email,
          eventId: newBooking.eventId,
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Booking error:", e);
    return NextResponse.json(
      {
        message: "Failed to create booking",
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 400 }
    );
  }
}
