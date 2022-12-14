'use client';
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ContactForm() {
  // Form states
  const [fname, setFName] = useState("John");
  const [lname, setLName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@email.com");
  const [message, setMessage] = useState("I was hoping to inquire about...");

  // State for Cloudflare Turnstile
  const [turnstile, setTurnstile] = useState("error");

  // Form button CSS states
  const [confirm, setConfirm] = useState("hidden");
  const [button, setButton] = useState(
    "text_gradient mt-2 cursor-pointer rounded-md py-2 font-extrabold"
  );

  async function verifyToken(token: string) {
    // Send the request to our own api endpoint for verification
    const result = await fetch("/api/verify-turnstile", {
      body: JSON.stringify({ token }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    const outcome = await result.json();
    if (outcome.success) {
      setTurnstile(token);
    } else {
      setTurnstile("error");
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    switch (turnstile) {
      case "error": {
        alert("Turnstile verification error. Please refresh and try again");
        break;
      }
      case "expired": {
        alert("Turnstile verification expired. Please refresh and try again");
        break;
      }
      default: {
        // This will create a webhook to send to Discord. I was going to do email but webhooks were way easier
        const contents = {
          content: "A new form has been submitted from reprogle.org",
          embeds: [
            {
              type: "rich",
              color: 0x0d1260,
              title: `From ${fname} ${lname}`,
              description: message,
              footer: {
                text: `Reply to ${email}`,
              },
            },
          ],
        };

        fetch(`${process.env.NEXT_PUBLIC_WEBHOOK}`, {
          method: "POST",
          body: JSON.stringify(contents),
          headers: {
            "Content-Type": "application/json",
          },
        });
        setConfirm("");
        setButton("hidden");
      }
    }
  }

  return (
    <div className={"mb-7 block text-white md:flex md:justify-between"}>
      <form className={"flex flex-col items-start"} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Name <span className="text-red-300">*</span>
          </label>
        </div>
        <div className={"block w-full md:flex md:justify-between md:space-x-5"}>
          <div className="mb-5">
            <input
              type="text"
              id="fname"
              name="fname"
              className="w-full rounded-sm p-1 text-black"
              onChange={(e) => setFName(e.target.value)}
              placeholder={fname}
              required
            />
            <br />
            <label htmlFor="name" className={"text-sm"}>
              First
            </label>
            <br />
          </div>
          <div className={"mb-5"}>
            <input
              type="text"
              id="lname"
              name="lname"
              className="w-full rounded-sm p-1 text-black"
              onChange={(e) => setLName(e.target.value)}
              placeholder={lname}
              required
            />
            <br />
            <label htmlFor="lname" className={"text-sm"}>
              Last
            </label>
            <br />
          </div>
        </div>
        <div className={"mb-7 w-full"}>
          <label htmlFor="email">
            Email <span className="text-red-300">*</span>
          </label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            className="w-full rounded-sm p-1 text-black"
            onChange={(e) => setEmail(e.target.value)}
            placeholder={email}
            required
          />
          <br />
        </div>
        <div className={"mb-4 w-full"}>
          <label htmlFor="message">
            Message <span className="text-red-300">*</span>
          </label>
          <textarea
            name="message"
            id="message"
            className="w-full rounded-sm p-1 text-black"
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder={message}
            required
          ></textarea>
        </div>
        <Turnstile
          siteKey={`${process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}`}
          // onSuccess passes the captured token to the verify function, where it verifies the token against cloudflare's
          // servers using the verify-turnstile api endpoint.
          onSuccess={(token) => verifyToken(token)}
          onError={() => setTurnstile("error")}
          onExpire={() => setTurnstile("expired")}
          options={{ theme: "dark" }}
        />
        <button type="submit" value="Submit" className={button}>
          SUBMIT
        </button>
        <h1 className={confirm}>
          Thanks for your message! I&apos;ll be in touch shortly
        </h1>
      </form>
    </div>
  );
}
