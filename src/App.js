import { useState, useRef, useEffect } from "react";
import { useTasks } from "./useTasks";
import { DAYS, FULL_DAYS, MONTHS, PRIORITIES, getWeekDates, dateKey } from "./constants";

const today = new Date();
const todayKey = dateKey(today);

/* ─── tiny helpers ─── */
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M1 3h12M5 3V2h4v1M3 3l1 9h6l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ─── TaskRow ─── */
function TaskRow({ task, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef(null);
  const p = PRIORITIES[task.priority];

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  function commitEdit() {
    if (draft.trim()) onEdit(task.id, draft.trim());
    else setDraft(task.text);
    setEditing(false);
  }

  return (
    <div className="task-row" style={{
      display:"flex", alignItems:"center", gap:"11px",
      padding:"11px 10px", borderRadius:"10px", marginBottom:"4px",
      background:"transparent", transition:"background 0.15s",
      opacity: task.done ? 0.42 : 1,
      animation: "slideIn 0.18s ease",
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Mark undone" : "Mark done"}
        style={{
          width:"22px", height:"22px", minWidth:"22px", borderRadius:"6px",
          border: task.done ? "none" : `1.5px solid ${p.color}`,
          background: task.done ? p.color : "transparent",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s", flexShrink:0,
        }}
      >
        {task.done && <CheckIcon />}
      </button>

      {/* Text / Edit */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => { if (e.key==="Enter") commitEdit(); if (e.key==="Escape") { setDraft(task.text); setEditing(false); } }}
          style={{
            flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:"6px", padding:"4px 8px", color:"#ddd", fontSize:"13px",
            fontFamily:"'DM Mono', monospace", outline:"none", caretColor:"#D4FF4D",
          }}
        />
      ) : (
        <span
          onDoubleClick={() => !task.done && setEditing(true)}
          title={task.done ? "" : "Double-tap to edit"}
          style={{
            flex:1, fontSize:"13px", lineHeight:"1.45", color: task.done ? "#444" : "#ccc",
            textDecoration: task.done ? "line-through" : "none", wordBreak:"break-word",
            cursor: task.done ? "default" : "text",
          }}
        >{task.text}</span>
      )}

      {/* Priority chip */}
      <span style={{
        fontSize:"9px", letterSpacing:"1px", padding:"2px 7px",
        borderRadius:"4px", background: p.bg, color: p.color,
        fontWeight:"500", flexShrink:0, whiteSpace:"nowrap",
      }}>{p.label.toUpperCase()}</span>

      {/* Delete */}
      <button
        className="del-btn"
        onClick={() => onRemove(task.id)}
        aria-label="Delete task"
        style={{
          background:"none", border:"none", color:"#444",
          cursor:"pointer", padding:"2px", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"color 0.15s",
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const { tasks, addTask, toggleTask, removeTask, editTask, clearDone } = useTasks();
  const [selectedDate, setDate]   = useState(today);
  const [input, setInput]         = useState("");
  const [priority, setPriority]   = useState("medium");
  const [showDone, setShowDone]   = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const inputRef = useRef(null);

  const anchorDate = new Date(today);
  anchorDate.setDate(today.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(anchorDate);
  const selKey    = dateKey(selectedDate);

  const dayTasks  = tasks.filter(t => t.dateKey === selKey);
  const sorted    = [...dayTasks].sort((a,b) => {
    const order = { high:0, medium:1, low:2 };
    if (a.done !== b.done) return a.done ? 1 : -1;
    return order[a.priority] - order[b.priority];
  });
  const visible   = showDone ? sorted : sorted.filter(t => !t.done);
  const doneCount = dayTasks.filter(t => t.done).length;
  const progress  = dayTasks.length ? Math.round((doneCount / dayTasks.length) * 100) : 0;
  const isToday   = selKey === todayKey;

  function handleAdd() {
    if (!input.trim()) return;
    addTask({ text: input, priority, dateKey: selKey });
    setInput("");
    inputRef.current?.focus();
  }

  /* ── date label ── */
  const selD = selectedDate;
  const isThisYear = selD.getFullYear() === today.getFullYear();
  const dateLabel = isToday
    ? "Today"
    : `${FULL_DAYS[selD.getDay()]}, ${selD.getDate()} ${MONTHS[selD.getMonth()]}${isThisYear ? "" : " " + selD.getFullYear()}`;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin:0; padding:0; }
        body { background:#0A0A0F; font-family:'DM Mono','Courier New',monospace; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#222; border-radius:4px; }
        .day-btn:hover  { background:rgba(255,255,255,0.05) !important; }
        .task-row:hover { background:rgba(255,255,255,0.025) !important; }
        .task-row:hover .del-btn { color:#666 !important; }
        .add-btn:hover  { background:#D4FF4D !important; color:#0A0A0F !important; }
        .tog-btn:hover  { border-color:#555 !important; color:#888 !important; }
        .clear-btn:hover { color:#FF4D4D !important; }
        .week-nav:hover { color:#aaa !important; }
        @keyframes slideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
      `}</style>

      <div style={{
        minHeight:"100dvh", background:"#0A0A0F",
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"flex-start", padding:"env(safe-area-inset-top,16px) 16px 40px",
      }}>
        <div style={{
          width:"100%", maxWidth:"460px",
          background:"#111118", borderRadius:"20px",
          border:"1px solid rgba(255,255,255,0.07)",
          boxShadow:"0 24px 60px rgba(0,0,0,0.55)",
          overflow:"hidden",
          animation:"popIn 0.25s ease",
        }}>

          {/* ── Header ── */}
          <div style={{ padding:"24px 24px 0", background:"linear-gradient(180deg,#15151e,#111118)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
              <div>
                <div style={{ fontSize:"10px", letterSpacing:"3px", color:"#3a3a4a", textTransform:"uppercase", marginBottom:"5px" }}>
                  {MONTHS[today.getMonth()]} {today.getFullYear()}
                </div>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"26px", fontWeight:"800",
                  color: isToday ? "#D4FF4D" : "#e8e8e8", letterSpacing:"-0.5px", lineHeight:1.1,
                }}>
                  {dateLabel}
                </div>
              </div>

              {/* Done counter */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:"10px", color:"#3a3a4a", letterSpacing:"2px", marginBottom:"4px" }}>DONE</div>
                <div style={{
                  fontFamily:"'Syne',sans-serif", fontSize:"26px", fontWeight:"800",
                  color: progress===100 ? "#4DFFB4" : "#e8e8e8",
                }}>
                  {doneCount}
                  <span style={{ fontSize:"13px", color:"#333", fontWeight:"400" }}>/{dayTasks.length}</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:"2px", background:"#1a1a24", borderRadius:"2px", margin:"14px 0 18px", overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${progress}%`, borderRadius:"2px",
                background: progress===100
                  ? "linear-gradient(90deg,#4DFFB4,#00ffcc)"
                  : "linear-gradient(90deg,#D4FF4D,#aaff00)",
                transition:"width 0.55s cubic-bezier(.4,0,.2,1)",
              }}/>
            </div>

            {/* Week nav */}
            <div style={{ display:"flex", alignItems:"center", gap:"4px", marginBottom:"-1px" }}>
              <button className="week-nav"
                onClick={() => setWeekOffset(w => w-1)}
                style={{ background:"none", border:"none", color:"#333", cursor:"pointer",
                  padding:"8px 6px", fontSize:"16px", lineHeight:1, transition:"color 0.15s" }}>‹</button>

              <div style={{ display:"flex", flex:1, gap:"2px" }}>
                {weekDates.map(d => {
                  const key    = dateKey(d);
                  const isSel  = key === selKey;
                  const isT    = key === todayKey;
                  const count  = tasks.filter(t => t.dateKey === key).length;
                  const doneC  = tasks.filter(t => t.dateKey === key && t.done).length;
                  const allDone= count > 0 && doneC === count;
                  return (
                    <button key={key} className="day-btn"
                      onClick={() => setDate(d)}
                      style={{
                        flex:1, border:"none", cursor:"pointer",
                        borderRadius:"8px 8px 0 0", padding:"8px 2px 12px",
                        background: isSel ? "#111118" : "transparent",
                        borderTop: isSel ? `2px solid ${allDone ? "#4DFFB4" : "#D4FF4D"}` : "2px solid transparent",
                        transition:"all 0.15s",
                      }}>
                      <div style={{ fontSize:"8px", letterSpacing:"1px",
                        color: isSel ? (allDone?"#4DFFB4":"#D4FF4D") : isT ? "#555" : "#333",
                        textTransform:"uppercase", marginBottom:"5px" }}>
                        {DAYS[d.getDay()]}
                      </div>
                      <div style={{ fontSize:"14px",
                        fontWeight: isT ? "500" : "300",
                        color: isSel ? "#fff" : isT ? "#777" : "#2e2e3a" }}>
                        {d.getDate()}
                      </div>
                      {count > 0 && (
                        <div style={{ width:"4px", height:"4px", borderRadius:"50%",
                          background: isSel ? (allDone?"#4DFFB4":"#D4FF4D") : "#252535",
                          margin:"5px auto 0" }}/>
                      )}
                    </button>
                  );
                })}
              </div>

              <button className="week-nav"
                onClick={() => setWeekOffset(w => w+1)}
                style={{ background:"none", border:"none", color:"#333", cursor:"pointer",
                  padding:"8px 6px", fontSize:"16px", lineHeight:1, transition:"color 0.15s" }}>›</button>
            </div>
          </div>

          {/* ── Task list ── */}
          <div style={{ padding:"16px 16px 0" }}>
            {/* Toolbar */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
              <span style={{ fontSize:"10px", color:"#33333f", letterSpacing:"2px", textTransform:"uppercase" }}>
                {visible.length} task{visible.length!==1?"s":""}
                {!showDone && doneCount>0 ? ` · ${doneCount} hidden` : ""}
              </span>
              <div style={{ display:"flex", gap:"6px" }}>
                {doneCount > 0 && (
                  <button className="clear-btn" onClick={() => clearDone(selKey)}
                    style={{ background:"none", border:"none", color:"#333", cursor:"pointer",
                      fontSize:"10px", letterSpacing:"1px", transition:"color 0.15s" }}>
                    CLEAR DONE
                  </button>
                )}
                <button className="tog-btn" onClick={() => setShowDone(s => !s)}
                  style={{ background:"none", border:"1px solid #1e1e28", borderRadius:"5px",
                    color:"#444", fontSize:"10px", padding:"3px 8px", cursor:"pointer",
                    letterSpacing:"1px", transition:"all 0.15s" }}>
                  {showDone ? "HIDE" : "SHOW"} DONE
                </button>
              </div>
            </div>

            {/* Scrollable list */}
            <div style={{ maxHeight:"38vh", overflowY:"auto", marginRight:"-8px", paddingRight:"8px" }}>
              {visible.length === 0 ? (
                <div style={{ textAlign:"center", padding:"36px 0 32px", color:"#252535", fontSize:"13px" }}>
                  {dayTasks.length === 0
                    ? "Nothing here yet.\nAdd a task below ↓"
                    : "All tasks done! 🎉"}
                </div>
              ) : (
                visible.map(t => (
                  <TaskRow key={t.id} task={t}
                    onToggle={toggleTask} onRemove={removeTask} onEdit={editTask} />
                ))
              )}
            </div>
          </div>

          {/* ── Add task ── */}
          <div style={{ padding:"14px 16px 22px" }}>
            <div style={{ height:"1px", background:"rgba(255,255,255,0.04)", margin:"0 0 14px" }}/>

            {/* Priority selector */}
            <div style={{ display:"flex", gap:"5px", marginBottom:"10px" }}>
              {Object.entries(PRIORITIES).map(([key, p]) => (
                <button key={key}
                  onClick={() => setPriority(key)}
                  style={{
                    flex:1, border:"none", borderRadius:"7px", padding:"7px 0",
                    background: priority===key ? p.bg : "rgba(255,255,255,0.025)",
                    color: priority===key ? p.color : "#333",
                    fontSize:"10px", letterSpacing:"1.5px", cursor:"pointer",
                    fontFamily:"'DM Mono',monospace", transition:"all 0.15s",
                    outline: priority===key ? `1px solid ${p.color}35` : "none",
                  }}>
                  {p.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div style={{ display:"flex", gap:"8px" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handleAdd()}
                placeholder="Note it down..."
                style={{
                  flex:1, background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(255,255,255,0.07)", borderRadius:"10px",
                  padding:"12px 14px", color:"#ddd", fontSize:"13px",
                  fontFamily:"'DM Mono',monospace", outline:"none",
                  caretColor:"#D4FF4D", letterSpacing:"0.3px",
                }}
              />
              <button className="add-btn"
                onClick={handleAdd}
                style={{
                  background:"rgba(212,255,77,0.1)", border:"1px solid rgba(212,255,77,0.25)",
                  borderRadius:"10px", color:"#D4FF4D", fontSize:"22px", width:"48px",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"inherit", transition:"all 0.2s", flexShrink:0,
                }}>+</button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop:"16px", fontSize:"10px", color:"#252535", letterSpacing:"2px" }}>
          TASKBOARD · DOUBLE-TAP TO EDIT
        </div>
      </div>
    </>
  );
}
