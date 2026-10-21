export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import type { RowDataPacket } from 'mysql2';

// PATCH /api/admin/leads/[id] - Update status, notes, assignment, followUpDate
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    const body = await request.json();

    const allowedStatuses = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];

    const updates: string[] = [];
    const values: any[] = [];

    if (body.status !== undefined) {
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid lead status' }, { status: 400 });
      }
      updates.push('status = ?');
      values.push(body.status);
    }

    if (body.assignedTo !== undefined) {
      updates.push('assignedTo = ?');
      values.push(body.assignedTo || null);
    }

    if (body.internalNotes !== undefined) {
      updates.push('internalNotes = ?');
      values.push(body.internalNotes || null);
    }

    if (body.followUpDate !== undefined) {
      updates.push('followUpDate = ?');
      values.push(body.followUpDate || null);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields provided to update' }, { status: 400 });
    }

    values.push(id);
    await pool.query(
      `UPDATE builder_leads SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM builder_leads WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      lead: updated[0],
    });
  } catch (error: any) {
    console.error('[admin/leads/[id]] Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

// DELETE /api/admin/leads/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if ('errorResponse' in authResult) return authResult.errorResponse;

    const { id } = await params;
    await pool.query('DELETE FROM builder_leads WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error: any) {
    console.error('[admin/leads/[id]] Error deleting lead:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
