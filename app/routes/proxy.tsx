import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({request}: LoaderFunctionArgs) {
  let { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    throw new Response("URL is required", { status: 400 });
  }
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "text/html";
  let body = await response.text();
  debugger

  // Rewrite URLs in the response body to go through the proxy
  const proxyBaseUrl = "http://localhost:3000/proxy?url=";
  const absoluteUrlPattern = /https?:\/\/[^\s"']+/g;
  const relativeUrlPattern = /(?:href|src)=["']([^"']+)["']/g;

  // Convert relative URLs to absolute URLs
  const baseUrl = new URL(url);
  body = body.replace(relativeUrlPattern, (match, p1) => {
    const absoluteUrl = new URL(p1, baseUrl).href;
    return match.replace(p1, `${proxyBaseUrl}${encodeURIComponent(absoluteUrl)}`);
  });

  // Rewrite absolute URLs
  body = body.replace(absoluteUrlPattern, (match) => `${proxyBaseUrl}${encodeURIComponent(match)}`);

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": contentType,
      "X-Frame-Options": "ALLOWALL",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
