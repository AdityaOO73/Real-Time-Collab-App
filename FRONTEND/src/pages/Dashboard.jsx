import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  FileText,
  Star,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { docStart, setDocs, docFail } from "../redux/slices/documentSlice";
import API from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { docs } = useSelector((state) => state.docs);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [pinned, setPinned] = useState([]);
  const [recent, setRecent] = useState([]);

  const fetchDocs = useCallback(async () => {
    dispatch(docStart());
    try {
      const res = await API.get("/docs");
      dispatch(setDocs(res.data));
    } catch {
      dispatch(docFail("Failed to load docs"));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const filteredDocs = docs.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDoc = async () => {
    const res = await API.post("/docs");
    navigate(`/editor/${res.data._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this doc?")) return;
    await API.delete(`/docs/${id}`);
    fetchDocs();
  };

  const handleEdit = (doc) => {
    setEditingId(doc._id);
    setTitle(doc.title);
  };

  const handleSaveTitle = async (id) => {
    await API.put(`/docs/${id}`, { title });
    setEditingId(null);
    fetchDocs();
  };

  const togglePin = (id) => {
    setPinned((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };

  const openDoc = (doc) => {
    navigate(`/editor/${doc._id}`);

    setRecent((prev) => {
      const filtered = prev.filter((d) => d._id !== doc._id);
      return [doc, ...filtered].slice(0, 5);
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">

      {/*  HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm opacity-80">
            Manage your documents like a pro ✨
          </p>
        </div>

        <button
          onClick={handleCreateDoc}
          className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-full font-medium shadow hover:scale-105 transition"
        >
          <Plus size={18} /> New
        </button>
      </div>

      {/*  STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Total Docs</p>
          <h2 className="text-xl font-bold">{docs.length}</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Pinned</p>
          <h2 className="text-xl font-bold">{pinned.length}</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md">
          <p className="text-sm text-gray-500">Recent</p>
          <h2 className="text-xl font-bold">{recent.length}</h2>
        </div>
      </div>

      {/*  SEARCH */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border-none shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/*  DOC GRID */}
      {filteredDocs.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3" />
          <p>No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/*  COLOR STRIP */}
              <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-3"></div>

              {/* TITLE */}
              {editingId === doc._id ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleSaveTitle(doc._id)}
                  autoFocus
                  className="border px-2 py-1 w-full mb-2 rounded"
                />
              ) : (
                <h3
                  onClick={() => openDoc(doc)}
                  className="font-semibold cursor-pointer text-gray-800 hover:text-purple-600 transition"
                >
                  {doc.title || "Untitled"}
                </h3>
              )}

              {/* BADGES */}
              <div className="flex gap-2 mt-1 mb-2">
                {recent[0]?._id === doc._id && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                    Last Opened
                  </span>
                )}

                {pinned.includes(doc._id) && (
                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                    Pinned
                  </span>
                )}
              </div>

              {/* DATE */}
              <p className="text-xs text-gray-500 mb-4">
                Updated: {new Date(doc.updatedAt).toLocaleDateString()}
              </p>

              {/* ACTIONS */}
              <div className="flex justify-between items-center">

                <button
                  onClick={() => togglePin(doc._id)}
                  className={`p-2 rounded-full transition ${
                    pinned.includes(doc._id)
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-gray-100 text-gray-400 hover:bg-yellow-50"
                  }`}
                >
                  <Star size={16} />
                </button>

                <button
                  onClick={() => handleEdit(doc)}
                  className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(doc._id)}
                  className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🕒 RECENT PANEL */}
      <div>
        <h2 className="font-semibold mb-3">Recent Activity</h2>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-4">
          {recent.length === 0 ? (
            <p className="text-gray-400">No recent activity</p>
          ) : (
            recent.map((doc) => (
              <div
                key={doc._id}
                onClick={() => openDoc(doc)}
                className="cursor-pointer py-2 border-b hover:bg-gray-50"
              >
                <p className="text-sm">{doc.title}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;