"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "mn_admin_key";

export default function AdminKeyField({
  name = "adminKey",
  label = "Admin Key",
}: {
  name?: string;
  label?: string;
}) {
  const [val, setVal] = useState("");
  const [remember, setRemember] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setVal(saved);
    } catch {}
  }, []);

  // Save whenever it changes and remember is on
  useEffect(() => {
    try {
      if (remember && val) localStorage.setItem(STORAGE_KEY, val);
      if (!remember) localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, [val, remember]);

  return (
    <div>
      <label className="label">{label}</label>
      <input
        name={name}
        type="password"
        className="input"
        placeholder="••••••••••"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        required
        autoComplete="off"
      />
      <label className="mt-2 flex items-center gap-2 text-xs text-white/70">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        Remember admin key on this device
      </label>
    </div>
  );
}