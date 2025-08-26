import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function ImageElement({ element, moveElement, updateElement, removeElement, isPreviewMode }) {
  const ref = useRef(null);
  const [showBusy, setShowBusy] = useState(false);

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

  const uploadNewImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateElement(element.id, { src: reader.result });
      setShowBusy(false);
    };
    reader.readAsDataURL(file);
  };

  const deleteMe = () => removeElement(element.id);

  return (
    <div
      ref={ref}
      className="element image-element"
      style={{
        left: element.left,
        top: element.top,
        position: "absolute",
        cursor: isPreviewMode ? "default" : "move"
      }}
    >
      <img
        src={element.src}
        alt="user-img"
        style={{ width: element.width, height: element.height, objectFit: "cover", display: "block", borderRadius: 4 }}
      />
      {!isPreviewMode && (
        <div className="element-controls">
          <label className="upload-label">
            Upload
            <input type="file" accept="image/*" onChange={uploadNewImage} style={{ display: "none" }} />
          </label>
          <button onClick={() => updateElement(element.id, { width: Math.max(60, element.width - 20) })}>W-</button>
          <button onClick={() => updateElement(element.id, { width: element.width + 20 })}>W+</button>
          <button onClick={deleteMe}>✕</button>
        </div>
      )}
      {showBusy && <div className="upload-overlay">Uploading...</div>}
    </div>
  );
}
