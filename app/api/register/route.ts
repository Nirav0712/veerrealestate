export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await pool.query(
      "INSERT INTO register (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    return NextResponse.json({
      message: "Registration successful"
    });

  } catch (error: any) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { error: error.message || "Email already exists" },
      { status: 400 }
    );
  }
}
