"use server";
import { Event } from "@/database";
import connectDB from "./../mongodb";

export const getSimilarEventBySlug = async (slug: string) => {
  try {
    await connectDB;

    const event = await Event.findOne({ slug });

    if (!event) {
      console.warn(`No event found for slug: ${slug}`);
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();

    return similarEvents;
  } catch (error) {
    console.error("Error fetching similar events:", error);
    return [];
  }
};
