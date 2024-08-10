// app/api/register/route.js
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  const { email, password } = await req.json();

  await connectToDatabase();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return new Response(JSON.stringify({ message: 'User already exists' }), {
      status: 400,
    });
  }

  const user = await User.create({ email, password });

  if (user) {
    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 201,
    });
  } else {
    return new Response(JSON.stringify({ message: 'Invalid user data' }), {
      status: 400,
    });
  }
}
