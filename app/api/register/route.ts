export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { requireAdmin, requirePermission } from "@/lib/auth";

export async function POST(req: Request) {
  // CRITICAL SECURITY: Public registration is strictly disabled.
  // Only authenticated admins with user creation permissions can register new users.
  const auth = await requirePermission(req, 'users', 'create');
  if ('errorResponse' in auth) {
    return auth.errorResponse;
  }

  try {
    const { name, email, phone, password, role_id, role } = await req.json();

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Name, email, phone, and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existing]: any = await pool.query(
      "SELECT id FROM register WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A user with this email address already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Resolve role and role_id
    let assignedRoleId = role_id ? parseInt(role_id, 10) : null;
    let assignedRole = role || 'user';

    if (assignedRoleId) {
      const [roleRow]: any = await pool.query(
        "SELECT id, name FROM roles WHERE id = ? LIMIT 1",
        [assignedRoleId]
      );
      if (roleRow.length > 0) {
        if (roleRow[0].name === 'Super Admin') {
          assignedRole = 'admin';
        }
      }
    } else if (assignedRole === 'admin') {
      const [superRole]: any = await pool.query(
        "SELECT id FROM roles WHERE name = 'Super Admin' LIMIT 1"
      );
      if (superRole.length > 0) assignedRoleId = superRole[0].id;
    }

    // Insert into database
    const [result]: any = await pool.query(
      "INSERT INTO register (name, email, phone, password, role, role_id, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [name.trim(), email.trim().toLowerCase(), phone.trim(), hashedPassword, assignedRole, assignedRoleId]
    );

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: result.insertId,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
