// app/api/auth/register/route.js
import { hash } from 'bcryptjs';
import connectToDatabase from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
  const { name, email, password } = await req.json();

  await connectToDatabase();

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: 'User already exists' }), {
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await hash(password, 10);

  // Create a new user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return new Response(JSON.stringify({ message: 'User created successfully' }), {
    status: 201,
  });
}
