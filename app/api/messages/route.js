import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Get messages (conversations)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationWith = searchParams.get('conversationWith');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get specific conversation
    if (conversationWith) {
      const [messages] = await db.execute(`
        SELECT m.*, 
               sender.name as sender_name,
               receiver.name as receiver_name
        FROM messages m
        JOIN users sender ON m.sender_id = sender.id
        JOIN users receiver ON m.receiver_id = receiver.id
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `, [userId, conversationWith, conversationWith, userId]);

      // Mark messages as read
      await db.execute(`
        UPDATE messages 
        SET is_read = TRUE 
        WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE
      `, [userId, conversationWith]);

      return NextResponse.json({ messages });
    }

    // Get all conversations (unique users)
    const [conversations] = await db.execute(`
      SELECT DISTINCT
        CASE
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END as user_id,
        CASE
          WHEN m.sender_id = ? THEN receiver.name
          ELSE sender.name
        END as user_name,
        CASE
          WHEN m.sender_id = ? THEN receiver.email
          ELSE sender.email
        END as user_email,
        CASE
          WHEN m.sender_id = ? THEN receiver.profile_image
          ELSE sender.profile_image
        END as user_profile_image,
        (SELECT message FROM messages
         WHERE (sender_id = ? AND receiver_id = user_id)
            OR (sender_id = user_id AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages
         WHERE (sender_id = ? AND receiver_id = user_id)
            OR (sender_id = user_id AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages
         WHERE sender_id = user_id AND receiver_id = ? AND is_read = FALSE) as unread_count
      FROM messages m
      JOIN users sender ON m.sender_id = sender.id
      JOIN users receiver ON m.receiver_id = receiver.id
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY last_message_time DESC
    `, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId]);

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send message
export async function POST(request) {
  try {
    const { sender_id, receiver_id, message } = await request.json();

    if (!sender_id || !receiver_id || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message.trim()]
    );

    return NextResponse.json({ 
      message: 'Message sent', 
      messageId: result.insertId 
    }, { status: 201 });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}