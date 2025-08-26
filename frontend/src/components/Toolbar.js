import React from "react";
import { useDrag } from "react-dnd";

function DraggableTool({ type, label }) {
  console.log(type,label);
  const [, dragRef] = useDrag({ type: "TOOL", item: { toolType: type } });
  return <div ref={dragRef} className="tool-item">{label}</div>;
}

export default function Toolbar() {
  return (
    <aside className="toolbar">
      <h3>Toolbar</h3>
      <hr />
      <DraggableTool type="TEXT" label="Text" />
      <DraggableTool type="IMAGE" label="Image" />
      <DraggableTool type="BUTTON" label="Button" />
      <hr />
    </aside>
  );
}
