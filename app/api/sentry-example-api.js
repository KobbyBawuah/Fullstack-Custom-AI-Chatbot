// A faulty API route to test Sentry's error monitoring
export default function handler(_req, res) {
  try {
    throw new Error("Sentry Example API Route Error");
    res.status(200).json({ name: "John Doe" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
