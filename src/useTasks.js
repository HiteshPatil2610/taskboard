import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "taskboard_v1";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {}
}

let _nextId = Date.now();

export function useTasks() {
  const [tasks, setTasksRaw] = useState(loadTasks);

  const setTasks = useCallback((updater) => {
    setTasksRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveTasks(next);
      return next;
    });
  }, []);

  const addTask = useCallback(({ text, priority, dateKey }) => {
    setTasks((prev) => [
      ...prev,
      { id: _nextId++, text: text.trim(), priority, done: false, dateKey, createdAt: Date.now() },
    ]);
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }, [setTasks]);

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  const editTask = useCallback((id, text) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
  }, [setTasks]);

  const clearDone = useCallback((dateKey) => {
    setTasks((prev) => prev.filter((t) => !(t.dateKey === dateKey && t.done)));
  }, [setTasks]);

  return { tasks, addTask, toggleTask, removeTask, editTask, clearDone };
}
