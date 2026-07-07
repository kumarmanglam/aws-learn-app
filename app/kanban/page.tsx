"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  GripVertical,
  Calendar,
  ArrowLeft,
  KanbanSquare,
  AlertTriangle,
} from "lucide-react";
import { todayISO } from "@/lib/progress-metrics";
import { CenterLoader } from "@/components/center-loader";

// ============================================================
// Per-user Kanban board (dnd-kit). One board:
//   Backlog -> To Do -> In Progress -> Done
// Persisted per user in the "kanban" section of /api/progress.
// ============================================================

type Priority = "low" | "medium" | "high" | "urgent";
type ColumnId = "backlog" | "todo" | "inprogress" | "done";
type Card = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  due?: string; // ISO date
  createdAt: string;
};
type Board = Record<ColumnId, Card[]>;

const COLUMNS: { id: ColumnId; title: string; hint: string }[] = [
  { id: "backlog", title: "Backlog", hint: "Ideas & later" },
  { id: "todo", title: "To Do", hint: "Ready to start" },
  { id: "inprogress", title: "In Progress", hint: "Working on it" },
  { id: "done", title: "Done", hint: "Completed" },
];

const PRIORITIES: { id: Priority; label: string; badge: string; dot: string }[] = [
  { id: "low", label: "Low", badge: "bg-slate-500/15 text-slate-300 border-slate-500/30", dot: "bg-slate-400" },
  { id: "medium", label: "Medium", badge: "bg-blue-500/15 text-blue-300 border-blue-500/30", dot: "bg-blue-400" },
  { id: "high", label: "High", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
  { id: "urgent", label: "Urgent", badge: "bg-red-500/15 text-red-300 border-red-500/30", dot: "bg-red-400" },
];
const prioMeta = (p: Priority) => PRIORITIES.find((x) => x.id === p) ?? PRIORITIES[1];

const emptyBoard = (): Board => ({ backlog: [], todo: [], inprogress: [], done: [] });

function newId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeBoard(raw: unknown): Board {
  const b = emptyBoard();
  if (!raw || typeof raw !== "object") return b;
  const r = raw as Record<string, unknown>;
  for (const col of COLUMNS) {
    const arr = r[col.id];
    if (Array.isArray(arr)) {
      b[col.id] = arr.filter(
        (c): c is Card => !!c && typeof c === "object" && typeof (c as Card).id === "string"
      );
    }
  }
  return b;
}

function findContainer(board: Board, id: string): ColumnId | undefined {
  if (id in board) return id as ColumnId;
  return (Object.keys(board) as ColumnId[]).find((col) =>
    board[col].some((c) => c.id === id)
  );
}

function isOverdue(card: Card, col: ColumnId): boolean {
  return !!card.due && col !== "done" && card.due < todayISO();
}

export default function KanbanPage() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [loading, setLoading] = useState(true);
  const [canSave, setCanSave] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ col: ColumnId; card: Card | null } | null>(
    null
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ---- load ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { credentials: "same-origin" });
        if (res.status === 401) {
          window.location.href = "/login?from=/kanban";
          return;
        }
        const json = (await res.json()) as { sections?: Record<string, unknown> };
        if (cancelled) return;
        const kanban = (json.sections?.kanban ?? {}) as { board?: unknown };
        setBoard(normalizeBoard(kanban.board));
        setCanSave(true); // only save once we've successfully read the server copy
      } catch {
        // Leave the board empty and DON'T enable saving, so a transient network
        // failure can't clobber existing server data with an empty board.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- debounced persist ----
  useEffect(() => {
    if (!canSave) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ section: "kanban", patch: { board } }),
      }).catch(() => {
        /* optimistic — next change retries */
      });
    }, 600);
  }, [board, canSave]);

  const activeCard = useMemo(() => {
    if (!activeId) return null;
    const col = findContainer(board, activeId);
    return col ? board[col].find((c) => c.id === activeId) ?? null : null;
  }, [activeId, board]);

  // ---- drag handlers (multi-container sortable) ----
  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const from = findContainer(board, activeId);
    const to = findContainer(board, overId);
    if (!from || !to || from === to) return;

    setBoard((prev) => {
      const fromItems = prev[from];
      const toItems = prev[to];
      const idx = fromItems.findIndex((c) => c.id === activeId);
      const card = fromItems[idx];
      if (!card) return prev;
      let insertAt: number;
      if (overId in prev) {
        insertAt = toItems.length;
      } else {
        const overIdx = toItems.findIndex((c) => c.id === overId);
        insertAt = overIdx >= 0 ? overIdx : toItems.length;
      }
      return {
        ...prev,
        [from]: fromItems.filter((c) => c.id !== activeId),
        [to]: [...toItems.slice(0, insertAt), card, ...toItems.slice(insertAt)],
      };
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    const from = findContainer(board, activeId);
    const to = findContainer(board, overId);
    if (!from || !to) return;
    if (from === to) {
      setBoard((prev) => {
        const items = prev[from];
        const oldIndex = items.findIndex((c) => c.id === activeId);
        const newIndex =
          overId in prev
            ? items.length - 1
            : items.findIndex((c) => c.id === overId);
        if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return prev;
        return { ...prev, [from]: arrayMove(items, oldIndex, newIndex) };
      });
    }
  };

  // ---- CRUD ----
  const addCard = (col: ColumnId, partial: Omit<Card, "id" | "createdAt">) => {
    const card: Card = { ...partial, id: newId(), createdAt: new Date().toISOString() };
    setBoard((prev) => ({ ...prev, [col]: [...prev[col], card] }));
  };
  const updateCard = (col: ColumnId, card: Card) => {
    setBoard((prev) => ({
      ...prev,
      [col]: prev[col].map((c) => (c.id === card.id ? card : c)),
    }));
  };
  const deleteCard = (col: ColumnId, id: string) => {
    setBoard((prev) => ({ ...prev, [col]: prev[col].filter((c) => c.id !== id) }));
  };

  const totalCards = COLUMNS.reduce((n, c) => n + board[c.id].length, 0);

  if (loading) return <CenterLoader label="Loading your board…" />;

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-panel/90 backdrop-blur">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary px-2 py-1 rounded-md hover:bg-bg-hover"
        >
          <ArrowLeft size={15} /> Back
        </a>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <KanbanSquare size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Kanban Board</div>
            <div className="text-[11px] text-text-muted">
              {totalCards} card{totalCards === 1 ? "" : "s"} · your private board
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                col={col}
                cards={board[col.id]}
                onAdd={(partial) => addCard(col.id, partial)}
                onEdit={(card) => setEditing({ col: col.id, card })}
                onDelete={(id) => deleteCard(col.id, id)}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? <CardView card={activeCard} overlay /> : null}
        </DragOverlay>
      </DndContext>

      {editing && (
        <EditCardModal
          initial={editing.card}
          onCancel={() => setEditing(null)}
          onSave={(data) => {
            if (editing.card) {
              updateCard(editing.col, { ...editing.card, ...data });
            } else {
              addCard(editing.col, data);
            }
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Column
// ============================================================
function Column({
  col,
  cards,
  onAdd,
  onEdit,
  onDelete,
}: {
  col: { id: ColumnId; title: string; hint: string };
  cards: Card[];
  onAdd: (partial: Omit<Card, "id" | "createdAt">) => void;
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const [quickAdd, setQuickAdd] = useState("");
  const [adding, setAdding] = useState(false);

  const submitQuick = () => {
    const title = quickAdd.trim();
    if (!title) return;
    onAdd({ title, priority: "medium" });
    setQuickAdd("");
  };

  return (
    <div className="w-72 shrink-0 flex flex-col rounded-lg border border-border bg-bg-panel/50 max-h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-text-primary">{col.title}</span>
          <span className="text-[11px] font-mono text-text-muted bg-bg-base rounded px-1.5 py-0.5">
            {cards.length}
          </span>
        </div>
        <span className="text-[10px] text-text-muted">{col.hint}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-2 space-y-2 transition-colors ${
          isOver ? "bg-accent/5" : ""
        }`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              col={col.id}
              onEdit={() => onEdit(card)}
              onDelete={() => onDelete(card.id)}
            />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <div className="text-[11.5px] text-text-muted/70 italic text-center py-6 border border-dashed border-border/60 rounded-md">
            Drop cards here
          </div>
        )}
      </div>

      {/* Quick add */}
      <div className="p-2 border-t border-border">
        {adding ? (
          <div className="space-y-1.5">
            <textarea
              autoFocus
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitQuick();
                } else if (e.key === "Escape") {
                  setAdding(false);
                  setQuickAdd("");
                }
              }}
              rows={2}
              placeholder="Card title…  (Enter to add)"
              className="w-full resize-none rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-[13px] p-2"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={submitQuick}
                className="text-[12px] font-semibold px-3 py-1 rounded bg-accent text-bg-base hover:bg-accent-hover"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdding(false);
                  setQuickAdd("");
                }}
                className="text-[12px] px-2 py-1 rounded text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="w-full flex items-center gap-1.5 text-[12.5px] text-text-muted hover:text-text-primary px-2 py-1.5 rounded-md hover:bg-bg-hover"
          >
            <Plus size={14} /> Add a card
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Sortable card wrapper + presentational card
// ============================================================
function SortableCard({
  card,
  col,
  onEdit,
  onDelete,
}: {
  card: Card;
  col: ColumnId;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <CardView
        card={card}
        col={col}
        dragHandleProps={{ ...attributes, ...listeners }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

function CardView({
  card,
  col,
  dragHandleProps,
  onEdit,
  onDelete,
  overlay = false,
}: {
  card: Card;
  col?: ColumnId;
  dragHandleProps?: Record<string, unknown>;
  onEdit?: () => void;
  onDelete?: () => void;
  overlay?: boolean;
}) {
  const p = prioMeta(card.priority);
  const overdue = col ? isOverdue(card, col) : false;
  return (
    <div
      className={`rounded-md border bg-bg-card border-border p-2.5 group ${
        overlay ? "shadow-2xl rotate-2" : "hover:border-text-secondary/40"
      }`}
    >
      <div className="flex items-start gap-1.5">
        <button
          type="button"
          {...dragHandleProps}
          aria-label="Drag card"
          className="mt-0.5 text-text-muted/50 hover:text-text-muted cursor-grab active:cursor-grabbing shrink-0"
        >
          <GripVertical size={14} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] text-text-primary leading-snug break-words">
            {card.title}
          </div>
          {card.description && (
            <div className="text-[11.5px] text-text-muted mt-1 line-clamp-3 whitespace-pre-line">
              {card.description}
            </div>
          )}
          <div className="flex items-center flex-wrap gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${p.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} /> {p.label}
            </span>
            {card.due && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                  overdue
                    ? "border-danger/40 text-danger bg-danger/10"
                    : "border-border text-text-muted"
                }`}
              >
                {overdue ? <AlertTriangle size={10} /> : <Calendar size={10} />}
                {card.due}
              </span>
            )}
          </div>
        </div>
        {!overlay && (
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit card"
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover"
            >
              <Pencil size={12} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete card"
              className="p-1 rounded text-text-muted hover:text-danger hover:bg-bg-hover"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Add / edit modal
// ============================================================
function EditCardModal({
  initial,
  onSave,
  onCancel,
}: {
  initial: Card | null;
  onSave: (data: Omit<Card, "id" | "createdAt">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [due, setDue] = useState(initial?.due ?? "");

  const save = () => {
    const t = title.trim();
    if (!t) return;
    onSave({
      title: t,
      description: description.trim() || undefined,
      priority,
      due: due || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-bg-base/70 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold">{initial ? "Edit card" : "New card"}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded hover:bg-bg-hover text-text-muted hover:text-text-primary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-text-muted">Title</span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
              }}
              className="mt-1 w-full rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-sm px-3 py-2"
              placeholder="What needs doing?"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-text-muted">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-sm px-3 py-2"
              placeholder="Optional details…"
            />
          </label>

          <div>
            <span className="text-[11px] uppercase tracking-wide text-text-muted">Priority</span>
            <div className="mt-1 flex items-center gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`text-[12px] px-2.5 py-1 rounded-md border transition-colors ${
                    priority === p.id
                      ? p.badge
                      : "border-border text-text-muted hover:text-text-primary"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-[11px] uppercase tracking-wide text-text-muted">
              Due date
            </span>
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="mt-1 w-full rounded-md bg-bg-base border border-border focus:border-accent focus:outline-none text-sm px-3 py-2"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="text-[13px] px-3 py-1.5 rounded-md border border-border text-text-secondary hover:bg-bg-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!title.trim()}
            className="text-[13px] font-semibold px-4 py-1.5 rounded-md bg-accent text-bg-base hover:bg-accent-hover disabled:opacity-50"
          >
            {initial ? "Save" : "Add card"}
          </button>
        </div>
      </div>
    </div>
  );
}
