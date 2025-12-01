"use client";

import { useDroppable } from "@dnd-kit/core";

export function DroppableColumn({ id, children }: any) {
  const { setNodeRef } = useDroppable({
    id,
    data: { column: id },
  });

  return (
    <div ref={setNodeRef} className="min-h-[200px] space-y-2">
      {children}
    </div>
  );
}
