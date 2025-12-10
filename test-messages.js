import db from './lib/db.js';

async function testMessagesTable() {
  try {
    console.log('Testing database connection...');

    // Check if messages table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'messages'");
    console.log('Messages table exists:', tables.length > 0);

    if (tables.length > 0) {
      // Check table structure
      const [columns] = await db.execute("DESCRIBE messages");
      console.log('Messages table structure:');
      columns.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('Messages table does not exist. Creating it...');
      await db.execute(`
        CREATE TABLE messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sender_id INT NOT NULL,
          receiver_id INT NOT NULL,
          message TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sender_id) REFERENCES users(id),
          FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
      `);
      console.log('Messages table created successfully');
    }

    // Test inserting a sample message
    console.log('Testing message insertion...');
    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [1, 2, 'Test message']
    );
    console.log('Test message inserted with ID:', result.insertId);

    // Clean up test message
    await db.execute('DELETE FROM messages WHERE id = ?', [result.insertId]);
    console.log('Test message cleaned up');

  } catch (error) {
    console.error('Database error:', error);
  }
}

testMessagesTable();
