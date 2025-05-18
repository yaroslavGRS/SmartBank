import bcrypt from 'bcryptjs';
import users from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

export async function register(req, res) {
  const { email, phone, password } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Користувач вже існує' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email,
    phone,
    password: hashedPassword,
  };

  users.push(newUser);

  const token = generateToken(newUser.id);

  res.status(201).json({ user: { id: newUser.id, email, phone }, token });
}

export async function login(req, res) {
  const { identifier, password } = req.body;

  const user = users.find(u => u.email === identifier || u.phone === identifier);
  if (!user) {
    return res.status(400).json({ message: 'Користувача не знайдено' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Невірний пароль' });
  }

  const token = generateToken(user.id);

  res.status(200).json({ user: { id: user.id, email: user.email, phone: user.phone }, token });
}
