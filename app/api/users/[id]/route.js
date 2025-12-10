import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user profile
    const [rows] = await db.execute(
      'SELECT id, email, name, phone, role, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    // Get user's services if they are a provider
    let services = [];
    if (user.role === 'provider') {
      const [serviceRows] = await db.execute(
        'SELECT id, title, category, description, hourly_rate, created_at FROM services WHERE provider_id = ? ORDER BY created_at DESC',
        [userId]
      );
      services = serviceRows;
    }

    // Get user's reviews if they are a provider
    let reviews = [];
    if (user.role === 'provider') {
      const [reviewRows] = await db.execute(`
        SELECT r.*, u.name as customer_name, u.profile_image as customer_image
        FROM reviews r
        JOIN users u ON r.customer_id = u.id
        WHERE r.provider_id = ?
        ORDER BY r.created_at DESC
      `, [userId]);
      reviews = reviewRows;
    }

    return NextResponse.json({
      user,
      services,
      reviews
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 });
  }
}
