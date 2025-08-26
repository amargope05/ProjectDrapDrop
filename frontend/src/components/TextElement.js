import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextElement({ element, moveElement, updateElement, removeElement, isPreviewMode }) {
  const ref = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draftHtml, setDraftHtml] = useState(element.content);

  const [, drag] = useDrag({ type: "ELEMENT", item: { id: element.id } });
  const [, drop] = useDrop({
    accept: "ELEMENT",
    hover(item, monitor) {
      const node = ref.current;
      const pos = monitor.getClientOffset();
      // console.log("HOVER --- ",pos);
      if (!node || !pos) return;
      const parentRect = node.parentElement.getBoundingClientRect();
      const left = pos.x - parentRect.left - node.offsetWidth / 2;
      const top = pos.y - parentRect.top - node.offsetHeight / 2;
      moveElement(item.id, Math.max(0, left), Math.max(0, top));
    }
  });

  drag(drop(ref));

  const openEditor = () => {
    if (!isPreviewMode) {
      setDraftHtml(element.content);
      setIsEditing(true);
    }
  };

  const saveChanges = () => {
    updateElement(element.id, { content: draftHtml });
    setIsEditing(false);
  };

  const setTextColor = (color) => {
    updateElement(element.id, { styles: { ...element.styles, color } });
  };

  const setTextAlign = (textAlign) => {
    updateElement(element.id, { styles: { ...element.styles, textAlign } });
  };

  const setFontSize = (delta) => {
    const next = Math.max(10, (element.styles.fontSize || 16) + delta);
    updateElement(element.id, { styles: { ...element.styles, fontSize: next } });
  };

  const toggleBold = () => {
    updateElement(element.id, { styles: { ...element.styles, fontWeight: element.styles.fontWeight === "bold" ? "normal" : "bold" } });
  };

  const toggleItalic = () => {
    updateElement(element.id, { styles: { ...element.styles, fontStyle: element.styles.fontStyle === "italic" ? "normal" : "italic" } });
  };

  const deleteMe = () => removeElement(element.id);

  return (
    <>
      <div
        ref={ref}
        className="element text-element"
        onDoubleClick={openEditor}
        style={{
          left: element.left,
          top: element.top,
          position: "absolute",
          cursor: isPreviewMode ? "default" : "move",
          minWidth: 80,
          minHeight: 30
        }}
      >
        <div
          style={{
            fontSize: (element.styles.fontSize || 18) + "px",
            fontWeight: element.styles.fontWeight || "normal",
            fontStyle: element.styles.fontStyle || "normal",
            textAlign: element.styles.textAlign || "left",
            color: element.styles.color || "#000000",
            outline: isPreviewMode ? "none" : "1px dashed rgba(0,0,0,0.1)",
            padding: 4,
            background: "transparent"
          }}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />

        {!isPreviewMode && (
          <div className="element-controls">
            <button onClick={() => setFontSize(-2)}>A-</button>
            <button onClick={() => setFontSize(2)}>A+</button>
            <button onClick={toggleBold}>B</button>
            <button onClick={toggleItalic}>I</button>
            <button onClick={() => setTextAlign("left")}>L</button>
            <button onClick={() => setTextAlign("center")}>C</button>
            <button onClick={() => setTextAlign("right")}>R</button>
            <label className="color-label small">
              Color
              <input type="color" value={element.styles.color || "#000000"} onChange={(e) => setTextColor(e.target.value)} />
            </label>
            <button onClick={openEditor}>Edit</button>
            <button onClick={deleteMe}>✕</button>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="editor-modal">
          <div className="editor-panel">
            <h4>Edit Text</h4>
            <ReactQuill theme="snow" value={draftHtml} onChange={setDraftHtml} />
            <div className="editor-actions">
              <button className="save_bttn" onClick={saveChanges}>Save</button>
              <button className="save_bttn save_bttn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
