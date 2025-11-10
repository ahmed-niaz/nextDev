"use client";
import { useState } from "react";

interface BookEventProps {
  slug: string;
}

const BookEvent = ({ slug }: BookEventProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(slug);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("email", email);

      // todo: send booking data to the api
      const response = await fetch(`/api/events/${slug.toLowerCase()}`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitted(true);
        console.log("Booking successful:", { email, slug });
      } else {
        console.error("Booking failed");
        // Handle error - you might want to show an error message
      }
    } catch (e) {
      console.error("Error submitting booking:", e);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">🎉 You’re in! Thanks for signing up</p>
      ) : (
        <form onSubmit={handleBooking}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter your email address"
            />
          </div>
          <button className="button-submit" type="submit">
            participate
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
