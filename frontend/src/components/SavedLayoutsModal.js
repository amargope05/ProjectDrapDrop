import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SavedLayoutsModal({ onClose, onSelectLayout }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/layouts");
        setItems(data || []);
      } catch (e) {
        setErr("Failed to load saved layouts");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  return (
    <div className="editor-modal">
      <div className="editor-panel" style={{ width: 520 }}>
        <h4>Saved Layout</h4>
        {busy && <div>Loading...</div>}
        {err && <div style={{ color: "red" }}>{err}</div>}
        {!busy && !err && (
          <div className="saved-list">
            {items.length === 0 && <div>No saved layout</div>}
            {items.map((x) => (
              <div key={x._id} className="saved-item">
                <div className="saved-title">{x.name}</div>
                <div className="saved-meta">{new Date(x.createdAt).toLocaleString()}</div>
                <div className="saved-actions">
                  <button className="save_bttn" onClick={() => onSelectLayout(x._id)}>Open</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="editor-actions">
          <button className="save_bttn save_bttn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
