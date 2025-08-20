import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const glistenStyle = `
@keyframes glisten {
  0% { background-position: -200% 200%; }
  100% { background-position: 200% -200%; }
}
.glisten-text {
  position: relative;
  display: inline-block;
  background: linear-gradient(45deg, #fff 0%, #f0e 40%, #fff 60%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glisten 2s linear infinite;
}
`;

const OnJoin = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [modalText, setModalText] = useState("Joining the room");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/room/getrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    const intervalId = setInterval(fetchRooms, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleJoinRoom = async (roomId) => {
    try {
      setModalText("Joining the room...");
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:8080/room/join`,
        { roomId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("roomId", roomId);
      localStorage.setItem("host", false);
      navigate(`/waiting_room/${roomId}`);
    } catch (err) {
      console.error("Join failed:", err?.response?.data || err.message);
      setModalText("Sorry, the game has already started.");

      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));

      setTimeout(() => {
        setLoading(false);
        setModalText("Joining the room");
      }, 2000);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      
      <style>{glistenStyle}</style>
      <div className="mx-auto w-full md:w-1/3 rounded-2xl shadow-lg mb-8"
        style={{
          background: "linear-gradient(45deg, #a78bfa 0%, #f472b6 100%)",
        }}
      >
        <h1 className="text-2xl font-bold py-6 text-center glisten-text">
          Available Rooms
        </h1>
      </div>
      {rooms.length === 0 ? (
        <p>No Available Rooms found.</p>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <button
              key={room.roomId}
              className="p-4 border-2 border-black rounded-xl shadow bg-white text-left transition-all
                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 hover:border-blue-500 hover:ring-4 hover:ring-blue-300 hover:ring-offset-2"
              onClick={() => handleJoinRoom(room.roomId)}
            >
              <p className="text-center text-xl font-bold mb-2">{room.roomId}</p>
              <p className="text-center text-lg font-semibold mb-2">
                {room.hostUsername}'s Room
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(room.createdAt).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      )}
      <Modal open={loading}>
        {modalText}
      </Modal>
    </div>
  );
};

export default OnJoin;
