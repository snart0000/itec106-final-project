export default async function handler(req, res) {
  const backendUrl = "https://mlbb-api.infinityfree.io";

  const target = req.query.path;

  if (!target) {
    return res.status(400).json({
      success: false,
      message: "Missing API path.",
    });
  }

  const url = `${backendUrl}/${target}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "text/plain",
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch {
      return res.status(500).json({
        success: false,
        message: "Backend returned invalid response.",
        raw: text,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect to backend.",
    });
  }
}