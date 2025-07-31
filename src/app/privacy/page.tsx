import Link from "next/link";

const lastUpdated = "Sep 2024";

export default function page() {
  return (
    <article className="prose mt-8 pb-16 dark:prose-invert">
      <div className="space-y-4">
        <h1 className="title text-5xl">Privacy Policy.</h1>
      </div>

      <div className="space-y-4">
        <h2 className="title text-3xl">Welcome 👋</h2>
        <p>
          This portfolio is all about sharing my work in cybersecurity,
          red teaming, and creative tools — <strong>not collecting your data</strong>.
        </p>

        <h2 className="title text-2xl">What I collect</h2>
        <p>
          Pretty much nothing. There are no cookies, no trackers, no login
          systems, no analytics — just static pages showing my projects.
        </p>

        <h3>Contact Info</h3>
        <p>
          If you contact me, I’ll only use your info to reply — no newsletters,
          no spam, no selling your data.
        </p>

        <h2 className="title text-2xl">How I use your info</h2>
        <ul>
          <li>Replying to your messages</li>
          <li>Improving the website based on your feedback</li>
        </ul>

        <h2 className="title text-2xl">What I don’t do</h2>
        <p>
          I don’t sell, trade, or give away your personal info. Ever.
        </p>

        <h2 className="title text-2xl">Security Notice</h2>
        <p>
          I do my best to keep everything secure. But remember: no website is
          bulletproof. Don’t share personal data unless it’s necessary.
        </p>

        <h2 className="title text-2xl">Questions?</h2>
        <p>
          Just email me at{" "}
          <Link href="mailto:younselbarj00@gmail.com">younselbarj00@gmail.com</Link> or use the{" "}
          <Link href="/contact">contact page</Link>. I’ll reply as soon as I can.
        </p>
      </div>
    </article>
  );
}
