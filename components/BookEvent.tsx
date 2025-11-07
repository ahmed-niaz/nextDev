"use client";
import { useState } from "react";

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1000);
    console.log(e);
    console.log(email);
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">🎉 You’re in! Thanks for signing up</p>
      ) : (
        <form onSubmit={handleSubmit}>
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
