const TABLETOP_Y = -1.85;
const LISTENER_Z = 2;

export function getRadioAcoustics(position: { y: number; z: number }) {
  const fallDepth = Math.max(0, TABLETOP_Y - position.y);
  const distance = Math.hypot(position.z - LISTENER_Z, fallDepth);
  return {
    gain: 1 / (1 + 0.035 * distance * distance),
    reverb: 0.05 + 0.8 * (1 - Math.exp(-distance / 15)),
  };
}

export function createRadioAudio(audio: HTMLAudioElement) {
  let context: AudioContext | undefined;
  let dry: GainNode;
  let wet: GainNode;
  let output: GainNode;
  let position = { y: -1.2, z: -2.1 };
  let volume = 1;

  function update(nextPosition: { y: number; z: number }) {
    position = { y: nextPosition.y, z: nextPosition.z };
    if (!context) return;
    const acoustics = getRadioAcoustics(position);
    const now = context.currentTime;
    // Smooth changes so dragging or resetting the receiver never clicks.
    output.gain.setTargetAtTime(acoustics.gain * volume, now, 0.08);
    dry.gain.setTargetAtTime(1 - acoustics.reverb, now, 0.08);
    wet.gain.setTargetAtTime(acoustics.reverb, now, 0.08);
  }

  function activate() {
    if (!context) {
      context = new AudioContext();
      const source = context.createMediaElementSource(audio);
      dry = context.createGain();
      wet = context.createGain();
      output = context.createGain();
      const reverb = context.createConvolver();
      const damping = context.createBiquadFilter();
      damping.type = 'lowpass';
      damping.frequency.value = 4500;
      // A stereo room impulse with a short pre-delay and a decaying tail.
      const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 2.5), context.sampleRate);
      const preDelay = Math.floor(context.sampleRate * 0.025);
      for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
        const samples = impulse.getChannelData(channel);
        for (let i = preDelay; i < samples.length; i++) {
          samples[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / samples.length, 3);
        }
      }
      reverb.buffer = impulse;
      source.connect(dry).connect(output);
      source.connect(reverb).connect(damping).connect(wet).connect(output);
      output.connect(context.destination);
      const acoustics = getRadioAcoustics(position);
      output.gain.value = acoustics.gain * volume;
      dry.gain.value = 1 - acoustics.reverb;
      wet.gain.value = acoustics.reverb;
    }
    return context.resume();
  }

  function setVolume(nextVolume: number) {
    volume = Math.max(0, Math.min(1, nextVolume));
    update(position);
  }

  return { activate, update, setVolume };
}
