import bcrypt from 'bcryptjs';
import db from './db';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(email, password, name, role = 'customer') {
  const hashedPassword = await hashPassword(password);
  const [result] = await db.execute(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, role]
  );
  return result.insertId;
}

export async function getUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}