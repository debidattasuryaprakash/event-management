import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Navbar";

export default function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [qrCode, setQrCode] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const getMyRegistrations = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/register/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/register",
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setQrCode(res.data.qrCode);
      alert("Registered successfully!");
      getMyRegistrations(); // refresh reg list
    } catch (err) {
      alert("Registration failed: " + err.response?.data?.msg);
    }
  };

  const handleDownloadCertificate = async (eventId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:5000/api/certificates/generate/${eventId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "certificate.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download certificate");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
    getMyRegistrations();
  }, []);

    return (
    <> <Navbar />
    <div className="p-6 min-h-screen bg-blue-50">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Available Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const reg = registrations.find((r) => r.event === event._id);
          const checkedIn = reg?.checkedIn;

          return (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-[12px] p-4 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-blue-700">{event.title}</h2>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-sm mt-1 text-gray-500">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>

              {reg ? (
                <>
                  <p className="mt-2 text-green-600 font-medium">
                    Registered {checkedIn && "(Checked In ✅)"}
                  </p>
                  {checkedIn && (
                    <button
                      onClick={() => handleDownloadCertificate(event._id)}
                      className="mt-2 w-full bg-green-600 text-white py-2 rounded-[12px] hover:bg-green-700"
                    >
                      Download Certificate
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleRegister(event._id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-[12px] hover:bg-blue-700"
                >
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>

      {qrCode && (
        <div className="mt-10 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Your QR Code</h2>
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="QR Code"
            className="mx-auto w-64 h-64 rounded-[12px] border border-gray-300"
          />
          <p className="mt-2 text-gray-500">Scan this at the check-in desk</p>
        </div>
      )}
    </div>
    </>
  );
}
