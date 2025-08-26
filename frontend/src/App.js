import React, { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import SavedLayoutsModal from "./components/SavedLayoutsModal";

export default function App() {
  const [elements, setElements] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [background, setBackground] = useState("#ffffff");
  const [layoutName, setLayoutName] = useState("My Page");
  const [showSavedModal, setShowSavedModal] = useState(false);
  const canvasRef = useRef(null);

  const addTextBox = (left, top) => {
    //console.log("**** ",left,top)
    setElements(prev => [
      ...prev,
      {
        id: uuidv4(),
        type: "TEXT",
        left,
        top,
        content: "<p>Edit me</p>",
        styles: {
          fontSize: 18,
          color: "#000000",
          textAlign: "left",
          fontWeight: "normal",
          fontStyle: "normal"
        }
      }
    ]);
  };

  const addImageBox = (left, top) => {
    setElements(prev => [
      ...prev,
      {
        id: uuidv4(),
        type: "IMAGE",
        left,
        top,
        src: "https://via.placeholder.com/240x140?text=Image",
        width: 240,
        height: 140
      }
    ]);
  };

  const addButtonBox = (left, top) => {
    setElements(prev => [
      ...prev,
      {
        id: uuidv4(),
        type: "BUTTON",
        left,
        top,
        label: "Click Me",
        styles: { padding: "10px 18px", backgroundColor: "#1976d2", color: "#ffffff", borderRadius: 6 }
      }
    ]);
  };

  const moveElement = (id, left, top) => {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, left, top } : el)));
  };
  const updateElement = (id, patch) => {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, ...patch } : el)));
  };
  const removeElement = (id) => setElements(prev => prev.filter(el => el.id !== id));

  const onDropToCanvas = (toolType, pageX, pageY) => {
    //console.log("Dropped", toolType, pageX, pageY);
    const rect = canvasRef.current.getBoundingClientRect();
    const left = Math.max(0, pageX - rect.left);
    const top = Math.max(0, pageY - rect.top);
    if (toolType === "TEXT") addTextBox(left, top);
    if (toolType === "IMAGE") addImageBox(left, top);
    if (toolType === "BUTTON") addButtonBox(left, top);
  };

  const saveLayoutToDB = async () => {
    try {
      await axios.post("http://localhost:5000/api/layouts", {
        name: layoutName,
        background,
        elements
      });
      alert("Saved to DB");
    } catch (e) {
      alert("Failed to save");
    }
  };

  const loadLayoutFromDB = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/layouts/${id}`);
      setLayoutName(data.name || "Loaded Page");
      setBackground(data.background || "#ffffff");
      setElements(Array.isArray(data.elements) ? data.elements : []);
      setShowSavedModal(false);
    } catch (e) {
      alert("Failed to load");
    }
  };

  const togglePreviewMode = () => setIsPreviewMode(p => !p);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="main-page-container">
        <header className="main-page-header">
          <h2>WebSite Page Builder</h2>
          <div className="header-actions">
            <input
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              title="Layout name"
              className="text-input"
            />
            <label className="color-label">
              Canvas:
              <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
            </label>
            <button onClick={() => setShowSavedModal(true)} className="save_bttn">Load</button>
            <button onClick={saveLayoutToDB} className="save_bttn">Save</button>
            <button onClick={togglePreviewMode} className="save_bttn save_bttn-secondary">
              {isPreviewMode ? "Back to Design" : "Preview"}
            </button>
          </div>
        </header>

        <div className="main-area">
          <Toolbar />
          <Canvas
            ref={canvasRef}
            background={background}
            elements={elements}
            onDropToCanvas={onDropToCanvas}
            moveElement={moveElement}
            updateElement={updateElement}
            removeElement={removeElement}
            isPreviewMode={isPreviewMode}
          />
        </div>

        {showSavedModal && (
          <SavedLayoutsModal
            onClose={() => setShowSavedModal(false)}
            onSelectLayout={loadLayoutFromDB}
          />
        )}

      </div>
    </DndProvider>
  );
}
