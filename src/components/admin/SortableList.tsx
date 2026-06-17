import { ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type HasId = { id: string };

interface SortableListProps<T extends HasId> {
  items: T[];
  setItems: (items: T[]) => void;
  table: "projects" | "achievements" | "photos" | "skills" | "mentors";
  layout?: "list" | "grid";
  children: (item: T) => ReactNode;
  gridClassName?: string;
}

export function SortableList<T extends HasId>({
  items,
  setItems,
  table,
  layout = "list",
  children,
  gridClassName,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    // Persist new sort_order
    const updates = reordered.map((item, idx) =>
      supabase.from(table).update({ sort_order: idx }).eq("id", item.id)
    );
    const results = await Promise.all(updates);
    if (results.some(r => r.error)) {
      toast.error("Failed to save order");
    } else {
      toast.success("Order saved");
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map(i => i.id)}
        strategy={layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div className={layout === "grid" ? gridClassName : "space-y-3"}>
          {items.map(item => (
            <SortableItem key={item.id} id={item.id} layout={layout}>
              {children(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children, layout }: { id: string; children: ReactNode; layout: "list" | "grid" }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
    position: "relative",
  };

  if (layout === "grid") {
    return (
      <div ref={setNodeRef} style={style} className="relative">
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-20 bg-background/90 backdrop-blur p-1.5 rounded-lg text-foreground cursor-grab active:cursor-grabbing touch-none border border-border shadow-md"
          aria-label="Drag to reorder"
          type="button"
        >
          <GripVertical size={14} />
        </button>
        {children}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-stretch gap-2">
      <button
        {...attributes}
        {...listeners}
        className="flex items-center px-2 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
        type="button"
      >
        <GripVertical size={16} />
      </button>
      <div className="flex-1">{children}</div>
    </div>
  );
}
