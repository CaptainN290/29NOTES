let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_ctx || _ctx.state === "closed") {
      _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return _ctx;
  } catch {
    return null;
  }
}

function blip(
  freqs: number | number[],
  duration: number,
  type: OscillatorType = "sine",
  vol = 0.12,
  startDelay = 0
) {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === "suspended") ac.resume().catch(() => {});
  const freqArr = Array.isArray(freqs) ? freqs : [freqs];
  freqArr.forEach((freq, i) => {
    try {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      const t = ac.currentTime + startDelay + i * 0.04;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
      osc.start(t);
      osc.stop(t + duration + 0.01);
    } catch { /* silent fail */ }
  });
}

let _enabled = true;

export const sounds = {
  setEnabled(v: boolean) { _enabled = v; },
  isEnabled() { return _enabled; },

  click() {
    if (!_enabled) return;
    blip(1100, 0.07, "sine", 0.09);
  },

  select() {
    if (!_enabled) return;
    blip([880, 1320], 0.12, "sine", 0.08);
  },

  create() {
    if (!_enabled) return;
    blip([440, 660, 880], 0.18, "sine", 0.1);
  },

  delete() {
    if (!_enabled) return;
    blip([300, 200], 0.2, "sine", 0.1);
  },

  save() {
    if (!_enabled) return;
    blip(1760, 0.08, "sine", 0.055);
  },

  error() {
    if (!_enabled) return;
    blip([180, 160], 0.25, "sawtooth", 0.07);
  },

  pin() {
    if (!_enabled) return;
    blip([990, 1320], 0.1, "sine", 0.08);
  },

  snap() {
    if (!_enabled) return;
    blip([880, 1100, 1320], 0.22, "sine", 0.07);
  },

  unlock() {
    if (!_enabled) return;
    blip([440, 550, 660, 880], 0.28, "sine", 0.08);
  },
};
