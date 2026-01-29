import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  return NextResponse.json({
    isLoggedIn: !!session?.user,
    user: session?.user ? {
      email: session.user.email,
      name: session.user.name,
    } : null,
    sessionExists: !!session,
  });
}
