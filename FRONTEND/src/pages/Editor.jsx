import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bold, Italic, List, Heading, Save } from "lucide-react";
import { setCurrentDoc } from "../redux/slices/documentSlice";
import API from "../utils/api";
import socket from "../utils/socket";

const Editor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentDoc } = useSelector((state) => state.docs);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user")) || { name: "User" };
  }, []);

  const [users, setUsers] = useState({});
  const [cursors, setCursors] = useState({});

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    editable: true,
    immediatelyRender: false,
  });

  //  JOIN ROOM
  useEffect(() => {
    if (!id) return;

    socket.emit("join-doc", {
      docId: id,
      user: user.name,
      token: localStorage.getItem("token"),
    });
  }, [id, user.name]);

  //  RESET CONTENT WHEN DOC CHANGES
  useEffect(() => {
    if (!editor) return;

    editor.commands.clearContent();
  }, [id, editor]);

  // USERS JOIN/LEAVE
  useEffect(() => {
    const handleJoin = ({ user, socketId }) => {
      setUsers((prev) => ({ ...prev, [socketId]: user }));
    };

    const handleLeave = (socketId) => {
      setUsers((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });

      setCursors((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    };

    socket.on("user-joined", handleJoin);
    socket.on("user-left", handleLeave);

    return () => {
      socket.off("user-joined", handleJoin);
      socket.off("user-left", handleLeave);
    };
  }, []);

  // LOAD DOC
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await API.get(`/docs/${id}`);
        dispatch(setCurrentDoc(res.data));
      } catch {
        dispatch(setCurrentDoc({ role: "denied" }));
      }
    };

    fetchDoc();
  }, [id, dispatch]);

  //  SAFE CONTENT SYNC (FIXED)
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    const incoming = currentDoc?.content || "<p></p>";

    if (current !== incoming) {
      editor.commands.setContent(incoming, false);
    }
  }, [currentDoc, editor]);

  // ROLE CONTROL
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(currentDoc?.role !== "viewer");
  }, [currentDoc, editor]);

  // SEND CHANGES
  useEffect(() => {
    if (!editor) return;

    let timeout;

    const handler = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const html = editor.getHTML();

        // dispatch(updateDoc(html));

        socket.emit("send-changes", {
          docId: id,
          content: html,
        });
      }, 300);
    };

    editor.on("update", handler);

    return () => editor.off("update", handler);
  }, [editor, dispatch, id]);

  // RECEIVE CHANGES
  useEffect(() => {
    const handler = (content) => {
      if (!editor) return;

      const current = editor.getHTML();

      if (current === content) return;

      editor.commands.setContent(content, false);
    };

    socket.on("receive-changes", handler);

    return () => socket.off("receive-changes", handler);
  }, [editor]);

  // CURSOR SEND
  useEffect(() => {
    if (!editor) return;

    let cursorTimeout;

    const cursorHandler = () => {
      clearTimeout(cursorTimeout);

      cursorTimeout = setTimeout(() => {
        const position = editor.state.selection.from;

        socket.emit("cursor-move", {
          docId: id,
          position,
          user: user.name,
        });
      }, 200);
    };

    editor.on("selectionUpdate", cursorHandler);

    return () => {
      editor.off("selectionUpdate", cursorHandler);
    };
  }, [editor, id, user.name]);

  // CURSOR RECEIVE
  useEffect(() => {
    const handler = ({ position, user, socketId }) => {
      setCursors((prev) => ({
        ...prev,
        [socketId]: { position, user },
      }));
    };

    socket.on("cursor-update", handler);

    return () => socket.off("cursor-update", handler);
  }, []);

  // AUTO SAVE
  useEffect(() => {
    if (!editor) return;

    const timeout = setTimeout(async () => {
      try {
        const html = editor.getHTML();

        await API.put(`/docs/${id}`, {
          content: html,
        });
      } catch {
        console.log("Auto save failed ");
      }
    }, 5000); // thoda relaxed

    return () => clearTimeout(timeout);
  }, [editor, id]);

  // SHARE
  const handleShare = async () => {
    try {
      await API.post(`/docs/${id}/share`, {
        email,
        role,
      });

      alert("User added successfully ");
      setEmail("");
    } catch (err) {
      alert(err.response?.data || "Error sharing doc ");
    }
  };

  if (!currentDoc) return <p className="text-center mt-10">Loading...</p>;
  if (currentDoc.role === "denied")
    return <p className="text-center mt-10 text-red-500">Access Denied </p>;
  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-purple-50">
      {/*  HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm">
        {/* LEFT */}
        <h1 className="text-sm md:text-base font-semibold text-gray-700">
          Document #{id}
        </h1>

        {/*  ONLINE USERS */}
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.values(users).map((u, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-purple-100 text-purple-600 px-2 py-1 rounded-full"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {u}
            </span>
          ))}
        </div>

        {/* 🔗 SHARE */}
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-1 rounded-full text-sm bg-gray-100 focus:outline-none"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-2 py-1 rounded-full text-sm bg-gray-100"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>

          <button
            onClick={handleShare}
            className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm hover:scale-105 transition"
          >
            Share
          </button>
        </div>

        {/*  AUTO SAVE */}
        <button className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full text-white bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse whitespace-nowrap">
          <Save size={14} />
          <span className="hidden sm:inline">Saving...</span>
        </button>
      </div>

      {/*  TOOLBAR */}
      <div className="flex flex-wrap gap-2 px-4 py-2 bg-white/80 backdrop-blur-md shadow-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <Heading size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <List size={16} />
        </button>
      </div>

      {/*  EDITOR AREA */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-lg">
          {/*  READ ONLY */}
          {currentDoc.role === "viewer" && (
            <p className="text-sm text-red-500 mb-3">
              Read Only Mode - You don't have edit permissions for this
              document.
            </p>
          )}

          {/*  EDITOR */}
          <EditorContent editor={editor} />

          {/*  CURSOR ACTIVITY */}
          <div className="mt-4 text-xs text-purple-600 space-y-1">
            {Object.values(cursors).map((c, i) => (
              <div key={i}>✏ {c.user} editing...</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
