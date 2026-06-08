export default async function handler(req, res) {
  const backendUrl = "https://mlbb-api.infinityfree.io";

  const path =
    req.query.path ||
    req.query["...path"] ||
    req.query["0"];

  const apiPath = Array.isArray(path)
    ? path.join("/")
    : path;

  if (!apiPath) {
    return res.status(400).json({
      success: false,
      message: "Missing API path.",
      query: req.query,
    });
  }

  const query = new URLSearchParams(req.query);

  query.delete("path");
  query.delete("...path");
  query.delete("0");

  const targetUrl = `${backendUrl}/${apiPath}${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "text/plain",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
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
        targetUrl,
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