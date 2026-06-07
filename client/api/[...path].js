export default async function handler(req, res) {
  const backendUrl = "https://mlbb-api.infinityfree.io";

  const path = req.query.path;
  const apiPath = Array.isArray(path) ? path.join("/") : path;

  const query = new URLSearchParams(req.query);
  query.delete("path");

  const targetUrl = `${backendUrl}/${apiPath}${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  try {
    const response = await fetch(targetUrl, {
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