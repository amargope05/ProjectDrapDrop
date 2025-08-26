import React, { forwardRef } from "react";
import { useDrop } from "react-dnd";
import TextElement from "./TextElement";
import ImageElement from "./ImageElement";
import ButtonElement from "./ButtonElement";

const Canvas = forwardRef(function Canvas(
  { background, elements, onDropToCanvas, moveElement, updateElement, removeElement, isPreviewMode }, ref
) {
  const [, dropRef] = useDrop({
    accept: "TOOL",
    drop: (item, monitor) => {
      const pos = monitor.getClientOffset();
      if (!pos) return;
      onDropToCanvas(item.toolType, pos.x, pos.y);
    }
  });

  const combinedRef = (node) => {
    if (ref) ref.current = node;
    dropRef(node);
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas" ref={combinedRef} style={{ background }}>
        {elements.map((el) => {
          if (el.type === "TEXT")
            return (
              <TextElement
                key={el.id}
                element={el}
                moveElement={moveElement}
                updateElement={updateElement}
                removeElement={removeElement}
                isPreviewMode={isPreviewMode}
              />
            );
          if (el.type === "IMAGE")
            return (
              <ImageElement
                key={el.id}
                element={el}
                moveElement={moveElement}
                updateElement={updateElement}
                removeElement={removeElement}
                isPreviewMode={isPreviewMode}
              />
            );
          if (el.type === "BUTTON")
            return (
              <ButtonElement
                key={el.id}
                element={el}
                moveElement={moveElement}
                updateElement={updateElement}
                removeElement={removeElement}
                isPreviewMode={isPreviewMode}
              />
            );
          return null;
        })}
      </div>
    </div>
  );
});

export default Canvas;
