import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

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
