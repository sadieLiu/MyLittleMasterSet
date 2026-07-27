import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  topic: "suggestion",
  message: ""
};

export default function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [output, setOutput] = useState(null);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const topic = form.topic;
    const message = form.message.trim();

    if (!name || !email || !message) {
      setOutput({
        heading: "Please complete your name, email, and message before submitting.",
        reply: null
      });
      return;
    }

    setOutput({
      heading: `Thank you, ${name}!`,
      reply: {
        topic,
        email: `[${email}]`,
        message: `"${message}"`
      }
    });
    setForm(initialForm);
  }

  return (
    <>
      <form id="feedback-form" className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="form-control"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={updateForm}
          />
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            className="form-control"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={updateForm}
          />
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="topic">Topic</label>
          <select
            id="topic"
            name="topic"
            className="form-control"
            value={form.topic}
            onChange={updateForm}
          >
            <option value="suggestion">Card suggestion</option>
            <option value="feedback">Website feedback</option>
            <option value="issue">Report an issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            rows={5}
            placeholder="Share your feedback or suggestion"
            value={form.message}
            onChange={updateForm}
          />
        </div>

        <div className="col-12">
          <button className="btn btn-primary navbar-theme-color" type="submit">
            Send Message
          </button>
        </div>
      </form>

      {output && (
        <div
          id="feedback-output"
          className={`alert ${output.reply ? "alert-success" : "alert-warning"} mt-4`}
          aria-live="polite"
        >
          <strong id="feedback-heading">{output.heading}</strong>

          {output.reply && (
            <p id="feedback-reply" className="mb-1 mt-1">
              We received your <span id="feedback-topic">{output.reply.topic}</span> message
              and can reply to <strong id="feedback-email">{output.reply.email}</strong>.
              <br />
              <em id="feedback-message">{output.reply.message}</em>
            </p>
          )}
        </div>
      )}
    </>
  );
}
