import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const STREAM_URL = 'https://radio.simmarith.de/listen/kellerfm/radio.mp3';
type RadioState = 'off' | 'connecting' | 'playing' | 'error';

export function createRadio(scene: THREE.Scene, world: CANNON.World) {
  const audio = document.getElementById('radio-audio') as HTMLAudioElement;
  const power = document.getElementById('radio-power') as HTMLButtonElement;
  const volume = document.getElementById('radio-volume') as HTMLInputElement;
  const status = document.getElementById('radio-status')!;
  const radio = new THREE.Group();
  radio.name = 'KellerFM radio';
  radio.position.set(-3.7, -1.2, -2.1);
  radio.rotation.x = -Math.PI / 2 + 0.22;

  const wood = new THREE.TextureLoader().load('/wood.png');
  wood.colorSpace = THREE.SRGBColorSpace;
  const casing = new THREE.MeshStandardMaterial({ map: wood, color: 0x80583c, roughness: 0.8 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xd8c9a9, roughness: 0.65 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x24231e, roughness: 0.8 });
  const silver = new THREE.MeshStandardMaterial({ color: 0xb9b8ae, metalness: 0.75, roughness: 0.3 });

  function box(width: number, height: number, depth: number, material: THREE.Material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(x, y, z);
    radio.add(mesh);
    return mesh;
  }

  box(2.65, 1.45, 0.75, casing);
  box(2.48, 1.28, 0.06, cream, 0, 0, 0.4);
  // Carry handle and feet give the receiver a silhouette among the cartridges.
  box(0.1, 0.3, 0.12, dark, -0.75, 0.84);
  box(0.1, 0.3, 0.12, dark, 0.75, 0.84);
  box(1.6, 0.1, 0.12, dark, 0, 1);
  box(0.32, 0.12, 0.55, dark, -0.85, -0.77);
  box(0.32, 0.12, 0.55, dark, 0.85, -0.77);

  const grilleCanvas = document.createElement('canvas');
  grilleCanvas.width = grilleCanvas.height = 256;
  const grilleContext = grilleCanvas.getContext('2d')!;
  grilleContext.fillStyle = '#6b6454';
  grilleContext.fillRect(0, 0, 256, 256);
  grilleContext.fillStyle = '#24231e';
  for (let y = 4; y < 256; y += 8) {
    for (let x = 4; x < 256; x += 8) {
      grilleContext.beginPath();
      grilleContext.arc(x, y, 2.6, 0, Math.PI * 2);
      grilleContext.fill();
    }
  }
  const grilleTexture = new THREE.CanvasTexture(grilleCanvas);
  grilleTexture.colorSpace = THREE.SRGBColorSpace;
  const speaker = new THREE.Mesh(new THREE.CircleGeometry(0.52, 48), new THREE.MeshStandardMaterial({ map: grilleTexture, roughness: 0.9 }));
  speaker.position.set(-0.6, 0, 0.445);
  radio.add(speaker);
  const speakerRim = new THREE.Mesh(new THREE.TorusGeometry(0.53, 0.025, 8, 48), silver);
  speakerRim.position.copy(speaker.position);
  radio.add(speakerRim);

  const displayCanvas = document.createElement('canvas');
  displayCanvas.width = 512;
  displayCanvas.height = 256;
  const displayContext = displayCanvas.getContext('2d')!;
  const displayTexture = new THREE.CanvasTexture(displayCanvas);
  displayTexture.colorSpace = THREE.SRGBColorSpace;
  box(1.04, 0.62, 0.04, dark, 0.65, 0.22, 0.445);
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.94, 0.52), new THREE.MeshBasicMaterial({ map: displayTexture }));
  display.position.set(0.65, 0.22, 0.47);
  radio.add(display);

  function knob(radius: number, x: number, material: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.12, 32), material);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, -0.35, 0.5);
    radio.add(mesh);
    return mesh;
  }
  knob(0.16, 0.39, silver);
  const powerKnob = knob(0.2, 0.94, dark);
  const powerMark = box(0.025, 0.13, 0.015, cream, 0.94, -0.27, 0.565);
  const ledMaterial = new THREE.MeshStandardMaterial({ color: 0x596049, emissive: 0x000000 });
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), ledMaterial);
  led.position.set(0.94, -0.35, 0.57);
  radio.add(led);
  scene.add(radio);

  // Give the receiver a solid body in the tabletop physics world.
  const body = new CANNON.Body({ mass: 0 });
  body.addShape(new CANNON.Box(new CANNON.Vec3(1.325, 0.725, 0.375)));
  body.position.set(radio.position.x, radio.position.y, radio.position.z);
  body.quaternion.set(radio.quaternion.x, radio.quaternion.y, radio.quaternion.z, radio.quaternion.w);
  world.addBody(body);

  let state: RadioState = 'off';
  let attempt = 0;
  const isOn = () => state === 'connecting' || state === 'playing';

  function render(nextState: RadioState) {
    state = nextState;
    const on = isOn();
    power.setAttribute('aria-pressed', String(on));
    power.setAttribute('aria-label', `${on ? 'Turn off' : 'Turn on'} KellerFM radio`);
    status.textContent = {
      off: 'Radio is off',
      connecting: 'Tuning in…',
      playing: 'Playing live',
      error: 'Connection failed. Turn on to retry.',
    }[state];
    displayContext.fillStyle = on ? '#243c31' : '#292e26';
    displayContext.fillRect(0, 0, 512, 256);
    displayContext.fillStyle = on ? '#c4ebac' : '#a6ac91';
    displayContext.font = 'bold 72px sans-serif';
    displayContext.fillText('KellerFM', 28, 100);
    displayContext.font = '38px sans-serif';
    displayContext.fillText({ off: 'Off', connecting: 'Tuning in…', playing: 'On air', error: 'Try again' }[state], 30, 174);
    displayContext.fillRect(30, 209, 450, 3);
    for (let x = 30; x <= 480; x += 30) displayContext.fillRect(x, 200, 2, 18);
    displayTexture.needsUpdate = true;
    ledMaterial.color.setHex(on ? 0xb7edb1 : 0x596049);
    ledMaterial.emissive.setHex(on ? 0x467a30 : 0x000000);
    powerKnob.position.z = on ? 0.48 : 0.5;
    powerMark.position.z = on ? 0.545 : 0.565;
  }

  function disconnect() {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }

  function fail() {
    if (!isOn()) return;
    attempt++;
    render('error');
    disconnect();
  }

  function toggle() {
    const currentAttempt = ++attempt;
    if (isOn()) {
      render('off');
      disconnect();
      return;
    }
    render('connecting');
    audio.src = STREAM_URL;
    // Keep play() within the click gesture so mobile browsers allow audio.
    void audio.play().catch(() => {
      if (currentAttempt === attempt) fail();
    });
  }

  audio.volume = Number(volume.value) / 100;
  volume.addEventListener('input', () => { audio.volume = Number(volume.value) / 100; });
  power.addEventListener('click', toggle);
  audio.addEventListener('playing', () => { if (isOn()) render('playing'); });
  audio.addEventListener('waiting', () => { if (isOn()) render('connecting'); });
  audio.addEventListener('error', fail);
  audio.addEventListener('ended', fail);
  window.addEventListener('pagehide', () => {
    attempt++;
    render('off');
    disconnect();
  });
  render('off');

  return { object: radio, toggle };
}
