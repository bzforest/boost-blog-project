import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

async function proxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    const path = params.path.join('/');
    const targetUrl = `${BACKEND_URL}/${path}${req.nextUrl.search}`;

    const headers = new Headers(req.headers);
    headers.set('host', new URL(targetUrl).host);
    
    // Attach the access token if available
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    const init: RequestInit = {
      method: req.method,
      headers: headers,
      redirect: "manual",
    };

    // Forward the body for non-GET/HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        init.body = arrayBuffer;
      }
    }

    const response = await fetch(targetUrl, init);
    const responseHeaders = new Headers(response.headers);
    
    // Do not forward content-encoding to avoid browser decoding issues
    responseHeaders.delete("content-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error from Proxy" }, { status: 500 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
