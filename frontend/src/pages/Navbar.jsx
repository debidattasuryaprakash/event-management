import { useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">🎓 CampusEvents</h1>
      <div className="flex gap-4 items-center">
        <p>{user?.email}</p>
        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded-[12px]">
          Logout
        </button>
      </div>
    </div>
  );
}
