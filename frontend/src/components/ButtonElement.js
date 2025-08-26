import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function ButtonElement({ element, moveElement, updateElement, removeElement, isPreviewMode }) {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(element.label);

  const [, drag] = useDrag({ type: "ELEMENT", item: { id: element.id } });
  const [, drop] = useDrop({
    accept: "ELEMENT",
    hover(item, monitor) {
      const node = ref.current;
      const pos = monitor.getClientOffset();
      if (!node || !pos) return;
      const parentRect = node.parentElement.getBoundingClientRect();
      const left = pos.x - parentRect.left - node.offsetWidth / 2;
      const top = pos.y - parentRect.top - node.offsetHeight / 2;
      moveElement(item.id, Math.max(0, left), Math.max(0, top));
    }
  });

  drag(drop(ref));

  const openEditor = () => { if (!isPreviewMode) { setDraft(element.label); setEditing(true); } };
  const saveLabel = () => { updateElement(element.id, { label: draft }); setEditing(false); };
  const toggleColor = () => {
    const next = element.styles.backgroundColor === "#1976d2" ? "#6a1b9a" : "#1976d2";
    updateElement(element.id, { styles: { ...element.styles, backgroundColor: next } });
  };

  // const onClickHanlder = () => {
  //   if (isPreviewMode) {
  //     alert(`Button "${element.label}" clicked!`);
  //   }
  // }

  const setRadius = (delta) => {
    const next = Math.max(0, (element.styles.borderRadius || 6) + delta);
    updateElement(element.id, { styles: { ...element.styles, borderRadius: next } });
  };
  const deleteMe = () => removeElement(element.id);

  return (
    <>
      <div
        ref={ref}
        className="element button-element"
        onDoubleClick={openEditor}
        style={{ left: element.left, top: element.top, position: "absolute", cursor: isPreviewMode ? "default" : "move" }}
      >
        <button
          style={{
            padding: element.styles.padding,
            background: element.styles.backgroundColor,
            color: element.styles.color,
            borderRadius: element.styles.borderRadius,
            border: "none",
            cursor: "pointer"
          }}
        >
          {element.label}
        </button>

        {!isPreviewMode && (
          <div className="element-controls">
            <button onClick={openEditor}>Edit</button>
            <button onClick={toggleColor}>Color</button>
            <button onClick={() => setRadius(-2)}>R-</button>
            <button onClick={() => setRadius(2)}>R+</button>
            <button onClick={deleteMe}>✕</button>
          </div>
        )}
      </div>

      {editing && (
        <div className="editor-modal">
          <div className="editor-panel">
            <h4>Edit Button Label</h4>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} />
            <div className="editor-actions">
              <button className="save_bttn" onClick={saveLabel}>Save</button>
              <button className="save_bttn save_bttn-secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
