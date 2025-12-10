import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PATCH(request) {
  try {
    const { userId, name, phone, profile_image } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }

    if (phone !== undefined) {
      updateFields.push('phone = ?');
      updateValues.push(phone);
    }

    if (profile_image !== undefined) {
      updateFields.push('profile_image = ?');
      updateValues.push(profile_image);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(userId);

    await db.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated user
    const [rows] = await db.execute(
      'SELECT id, email, name, phone, role, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}