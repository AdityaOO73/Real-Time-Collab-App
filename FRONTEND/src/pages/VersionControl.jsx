import { useState, useEffect } from "react";
import { RotateCcw, Eye } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { docStart, setVersions, docFail } from "../redux/slices/documentSlice";
import API from "../utils/api";

const VersionControl = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { versions, loading, currentDoc, error } = useSelector(
    (state) => state.docs,
  );

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchVersions = async () => {
      dispatch(docStart());

      try {
        const res = await API.get(`/docs/${id}/versions`);
        dispatch(setVersions(res.data));
      } catch (err) {
        console.log(err.response?.data || err.message);
        dispatch(docFail("Failed to fetch versions "));
      }
    };

    fetchVersions();
  }, [id, dispatch]);

  const handleRestore = async (version) => {
    await API.post(`/docs/${id}/revert`, {
      content: version.content,
    });

    alert("Version Restored!");
    window.location.reload();
  };

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/*  HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Version History</h1>
        <p className="text-sm text-gray-500">
          Track and restore previous versions of your document
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/*  LEFT PANEL */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-4 h-[70vh] overflow-y-auto">
          <h2 className="font-semibold mb-4 text-gray-700">All Versions</h2>

          {loading ? (
            <p>Loading...</p>
          ) : versions.length === 0 ? (
            <p className="text-gray-400">No versions yet </p>
          ) : (
            versions.map((v, i) => (
              <div
                key={i}
                onClick={() => setSelected(v)}
                className={`p-3 mb-3 rounded-xl cursor-pointer transition-all
  ${
    selected === v
      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
      : "bg-gray-50 hover:bg-purple-50"
  }`}
              >
                <p className="font-medium">Version {versions.length - i}</p>

                <p className="text-xs mt-1 opacity-80">
                  📄 {currentDoc?.title || "Untitled"}
                </p>

                <p className="text-xs opacity-80">
                  👤 {v.editorName || "Unknown"}
                </p>

                <p className="text-xs opacity-70">
                  {new Date(v.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/*  RIGHT PANEL */}
        <div className="md:col-span-2 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 flex flex-col h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-lg text-gray-700">
              <Eye size={18} /> Preview
            </h2>

            {selected && currentDoc?.role === "editor" && (
              <button
                onClick={() => handleRestore(selected)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:scale-105 transition"
              >
                <RotateCcw size={16} />
                Restore
              </button>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-auto rounded-2xl p-4 bg-gray-50 shadow-inner">
            {selected ? (
              <div dangerouslySetInnerHTML={{ __html: selected.content }} />
            ) : (
              <p className="text-gray-400 text-center mt-20">
                Select a version to preview
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionControl;
