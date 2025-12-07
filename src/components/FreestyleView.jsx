import React, { useEffect, useRef, useState } from "react";

export default function FreestyleView({ onBackClick }) {
  const [log, setLog] = useState([]);
  const [wsState, setWsState] = useState("disconnected"); // disconnected | connecting | connected
  const [audioReady, setAudioReady] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // audio stuff
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const activeVoicesRef = useRef(new Map()); // note -> {osc, gain}

  function initAudio() {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.value = 0.15; // master volume
    master.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = master;
    setAudioReady(true);
  }

  // note → frequency
  const NOTE_SEMITONES = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };

  function noteToFreq(noteLabel = "C4") {
    const m = /^([A-G])(#|b)?(\d+)?$/i.exec(noteLabel.trim());
    if (!m) return 440;
    let [, letter, accidental, octaveStr] = m;
    letter = letter.toUpperCase();
    let semis = NOTE_SEMITONES[letter] ?? 0;
    if (accidental === "#") semis += 1;
    if (accidental === "b") semis -= 1;
    const octave = octaveStr ? parseInt(octaveStr, 10) : 4;
    const fromA4 = semis + (octave - 4) * 12;
    return 440 * Math.pow(2, fromA4 / 12);
  }

  function startNote(noteBase) {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const note = String(noteBase).toUpperCase();
    if (activeVoicesRef.current.has(note)) return;

    console.log("startNote called for", note);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const freq = noteToFreq(/[0-9]/.test(note) ? note : `${note}4`);
    osc.frequency.value = freq;
    gain.gain.value = 0.0001;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);

    osc.connect(gain);
    gain.connect(master);
    osc.start();

    activeVoicesRef.current.set(note, { osc, gain });
  }

  function stopNote(noteBase) {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const note = String(noteBase).toUpperCase();
    const voice = activeVoicesRef.current.get(note);
    if (!voice) return;
    const now = ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0.0001, now, 0.03);
    try {
      voice.osc.stop(now + 0.08);
    } catch {}
    setTimeout(() => {
      try {
        voice.osc.disconnect();
        voice.gain.disconnect();
      } catch {}
    }, 120);
    activeVoicesRef.current.delete(note);
  }

  // WebSocket URL (no useMemo for now, keep it simple)
  const [ts] = useState(() => Date.now());
  const streamSrc = `/api/stream?ts=${ts}`;

  // websocket
  useEffect(() => {
    let stopped = false;

    function makeWsUrl() {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      return `${proto}//${window.location.host}/api/ws/notes`;
    }

    function connect() {
      if (stopped) return;
      setWsState("connecting");
      const ws = new WebSocket(makeWsUrl());
      wsRef.current = ws;

      ws.onopen = () => setWsState("connected");

      ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.type === "hello" || msg.type === "heartbeat") {
          setLog((l) => {
            const entry = `${new Date(
              msg.t ?? Date.now()
            ).toLocaleTimeString()} ${msg.type.toUpperCase()}`;
            return [entry, ...l].slice(0, 200);
          });
          return;
        }

        const note = String(msg.note).toUpperCase();
        setLog((l) => {
          const entry = `${new Date(msg.t).toLocaleTimeString()} ${msg.type.toUpperCase()} ${note}`;
          return [entry, ...l].slice(0, 200);
        });

        if (audioReady) {
          if (msg.type === "down") startNote(note);
          else if (msg.type === "up") stopNote(note);
        }
      };

      ws.onclose = ws.onerror = () => {
        setWsState("disconnected");
        if (!stopped) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = setTimeout(connect, 800);
        }
      };
    }

    connect();

    return () => {
      stopped = true;
      clearTimeout(reconnectTimer.current);
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [audioReady]);


  // UI
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button onClick={onBackClick}>← Back</button>

        {!audioReady ? (
          <button
            onClick={async () => {
              initAudio();
              try {
                await audioCtxRef.current?.resume();
              } catch {}
            }}
          >
            Enable Sound
          </button>
        ) : (
          <span style={{ opacity: 0.7 }}>Audio on</span>
        )}

        <span style={{ opacity: 0.7 }}>WS: {wsState}</span>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* live video feed */}
        <img
          src={streamSrc}
          alt="Freestyle camera"
          style={{
            flex: 1,
            width: "100%",
            minHeight: 260,
            borderRadius: 8,
            border: "1px solid #222",
          }}
          onError={(e) => {
            e.currentTarget.alt =
              "Stream unavailable (check FastAPI /api/stream & webcam)";
          }}
        />

        {/* event log */}
        <div style={{ width: "30%" }}>
          <h4>Events</h4>
          <pre
            style={{
              maxHeight: 400,
              overflow: "auto",
              background: "#111",
              color: "#eee",
              padding: 8,
              borderRadius: 8,
              fontSize: "0.8rem",
            }}
          >
            {log.join("\n")}
          </pre>
        </div>
      </div>
    </div>
  );
}
