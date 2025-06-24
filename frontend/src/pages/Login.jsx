import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/decodeToken';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ move this to the top level

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      alert('Login successful');

      const user = getUserFromToken();

      if (user?.role === 'admin') navigate('/admin/dashboard');
      else if (user?.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/attendee/dashboard');
    } catch (err) {
      alert('Login failed: ' + err.response.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-[12px] shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-[12px] hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
