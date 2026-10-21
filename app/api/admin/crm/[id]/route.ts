export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// PATCH /api/admin/crm/[id] - Update inquiry status, notes, assignment, followUpDate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    const inquiryId = parseInt(id);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ error: 'Invalid inquiry ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, assignedTo, internalNotes, followUpDate } = body;

    const allowedStatuses = [
      'New',
      'Contacted',
      'Qualified',
      'Site Visit Scheduled',
      'Negotiation',
      'Converted',
      'Lost',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    let updates: string[] = [];
    let values: any[] = [];

    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (assignedTo !== undefined) {
      updates.push('assignedTo = ?');
      values.push(assignedTo || null);
    }
    if (internalNotes !== undefined) {
      updates.push('internalNotes = ?');
      values.push(internalNotes || null);
    }
    if (followUpDate !== undefined) {
      updates.push('followUpDate = ?');
      values.push(followUpDate || null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }

    values.push(inquiryId);
    await pool.query(
      `UPDATE crm_inquiries SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM crm_inquiries WHERE id = ?',
      [inquiryId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      inquiry: rows[0],
      message: 'Inquiry updated successfully',
    });
  } catch (error: any) {
    console.error('[admin/crm/[id]] Error updating inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update CRM inquiry' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/crm/[id] - Remove inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    const inquiryId = parseInt(id);
    if (isNaN(inquiryId)) {
      return NextResponse.json({ error: 'Invalid inquiry ID' }, { status: 400 });
    }

    await pool.query('DELETE FROM crm_inquiries WHERE id = ?', [inquiryId]);

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully',
    });
  } catch (error: any) {
    console.error('[admin/crm/[id]] Error deleting inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
