"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import RefreshToken from "@/lib/models/RefreshToken";
import { connectDB } from "@/lib/mongoose";
import { requireEnv } from "@/lib/utils/requireEnv";

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("refreshToken")?.value;
  if (!token)
    return NextResponse.json({ msg: "Not authenticated" }, { status: 401 });

  let payload: any;
  try {
    payload = jwt.verify(token, requireEnv("REFRESH_TOKEN_SECRET"));
  } catch {
    return NextResponse.json({ msg: "Invalid token" }, { status: 401 });
  }

  if (typeof payload === "string")
    return NextResponse.json({ msg: "Invalid token" }, { status: 401 });

  const refreshDoc = await RefreshToken.findOne({ tokenId: payload.tokenId });
  if (!refreshDoc || refreshDoc.expiresAt < new Date()) {
    return NextResponse.json({ msg: "Session expired" }, { status: 401 });
  }

  // Optional: ensure JWT id matches stored refresh token
  if (refreshDoc.userId.toString() !== payload.id) {
    return NextResponse.json({ msg: "Token user mismatch" }, { status: 401 });
  }

  const user = await User.findById(payload.id).select("-password");
  if (!user)
    return NextResponse.json({ msg: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
}
