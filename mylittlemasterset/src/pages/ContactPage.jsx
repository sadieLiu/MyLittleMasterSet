import FeedbackForm from "../components/FeedbackForm.jsx";

export default function Contact() {
  return (
    <section className="card shadow-sm mb-4">
      <div className="card-body feedback-card-body">
        <h2 className="card-title">Feedback and Suggestions</h2>
        <FeedbackForm />
      </div>
    </section>
  );
}
