import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { grainTexture } from './SceneMaterials';
import { TABLE_TOP } from './Room';
import type { CartridgeProject } from './Cartridge';

export function createRetroConsole(scene: THREE.Scene, world: CANNON.World) {
  const object = new THREE.Group();
  object.name = 'Project console and CRT';
  scene.add(object);
  const grain = grainTexture();
  grain.repeat.set(6, 6);
  const shell = new THREE.MeshStandardMaterial({ color: 0xc9c8b9, roughness: 0.65, bumpMap: grain, bumpScale: 0.008 });
  const charcoal = new THREE.MeshStandardMaterial({ color: 0x393e40, roughness: 0.62, bumpMap: grain, bumpScale: 0.006 });
  const black = new THREE.MeshStandardMaterial({ color: 0x151d20, roughness: 0.8 });
  const red = new THREE.MeshStandardMaterial({ color: 0x924646, roughness: 0.5 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x8ef0cb, transparent: true, opacity: 0, toneMapped: false });
  const power = new THREE.MeshStandardMaterial({ color: 0x566356, emissive: 0x000000 });

  function box(name: string, size: [number, number, number], position: [number, number, number], material: THREE.Material, radius = 0.04) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 3, radius), material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = mesh.receiveShadow = material !== glow;
    object.add(mesh);
    return mesh;
  }
  function collider(size: [number, number, number], position: [number, number, number]) {
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(size[0] / 2, size[1] / 2, size[2] / 2)) });
    body.position.set(...position);
    world.addBody(body);
  }

  const consoleX = -1.7;
  const consoleZ = -0.35;
  const top = TABLE_TOP + 0.65;
  box('Console lower shell', [2.65, 0.28, 1.85], [consoleX, TABLE_TOP + 0.18, consoleZ], charcoal);
  box('Console top shell', [2.65, 0.38, 1.85], [consoleX, TABLE_TOP + 0.46, consoleZ], shell, 0.08);
  // A real gap between the raised rails makes the connector disappear into the slot.
  box('Cartridge slot recess', [1.56, 0.035, 0.38], [consoleX, top + 0.01, consoleZ - 0.25], black, 0.015);
  for (const z of [consoleZ - 0.49, consoleZ - 0.01]) {
    box('Cartridge slot rail', [1.75, 0.12, 0.1], [consoleX, top + 0.06, z], charcoal, 0.02);
    box('Slot light guide', [1.65, 0.016, 0.025], [consoleX, top + 0.13, z], glow, 0.006);
  }
  for (const x of [consoleX - 0.86, consoleX + 0.86]) {
    box('Slot end light', [0.025, 0.016, 0.5], [x, top + 0.13, consoleZ - 0.25], glow, 0.006);
  }
  for (let i = 0; i < 9; i++) box('Console cooling vent', [0.025, 0.008, 0.65], [consoleX + 0.97 + i * 0.028, top + 0.006, consoleZ - 0.25], black, 0.002);
  box('Console power switch', [0.38, 0.13, 0.22], [consoleX - 0.78, TABLE_TOP + 0.27, consoleZ + 0.92], red, 0.02);
  box('Console reset switch', [0.3, 0.13, 0.22], [consoleX - 0.3, TABLE_TOP + 0.27, consoleZ + 0.92], charcoal, 0.02);
  box('Console power indicator', [0.065, 0.035, 0.018], [consoleX - 1.1, TABLE_TOP + 0.27, consoleZ + 0.938], power, 0.006);
  collider([2.65, 0.65, 1.85], [consoleX, TABLE_TOP + 0.325, consoleZ]);

  const tvX = 1.65;
  const tvZ = -2.65;
  box('CRT foot', [2.8, 0.17, 1.25], [tvX, TABLE_TOP + 0.085, tvZ], black);
  box('CRT front cabinet', [3.85, 3.05, 0.55], [tvX, TABLE_TOP + 1.65, -2.05], charcoal, 0.16);
  // Picture tubes narrow toward the electron gun behind the wide glass face.
  const rearGeometry = new RoundedBoxGeometry(3.7, 2.9, 1.45, 4, 0.1);
  const rearPositions = rearGeometry.attributes.position;
  for (let i = 0; i < rearPositions.count; i++) {
    const depth = (0.725 - rearPositions.getZ(i)) / 1.45;
    const taper = 1 - depth * 0.4;
    rearPositions.setX(i, rearPositions.getX(i) * taper);
    rearPositions.setY(i, rearPositions.getY(i) * taper);
  }
  rearGeometry.computeVertexNormals();
  const rear = new THREE.Mesh(rearGeometry, charcoal);
  rear.name = 'CRT tapered picture tube housing';
  rear.position.set(tvX, TABLE_TOP + 1.65, -3.05);
  rear.castShadow = rear.receiveShadow = true;
  object.add(rear);
  for (let i = 0; i < 8; i++) {
    const z = -2.55 - i * 0.13;
    const depth = (-2.325 - z) / 1.45;
    const y = TABLE_TOP + 1.65 + 1.45 * (1 - depth * 0.4);
    const vent = box('CRT rear cooling vent', [1.7, 0.012, 0.028], [tvX, y + 0.006, z], black, 0.003);
    vent.rotation.x = Math.atan(0.4);
  }
  box('CRT rear service cover', [1.75, 1.35, 0.06], [tvX, TABLE_TOP + 1.65, -3.79], charcoal, 0.06);
  box('CRT recessed bezel', [3.36, 2.64, 0.12], [tvX - 0.1, TABLE_TOP + 1.72, -1.73], black, 0.15);
  collider([3.85, 3.2, 0.55], [tvX, TABLE_TOP + 1.6, -2.05]);
  collider([2.3, 1.85, 1.45], [tvX, TABLE_TOP + 1.65, -3.05]);
  for (let i = 0; i < 9; i++) box('CRT speaker vent', [0.09, 0.02, 0.016], [tvX + 1.7, TABLE_TOP + 0.7 + i * 0.08, -1.758], black, 0.003);
  for (const y of [TABLE_TOP + 2.05, TABLE_TOP + 1.55]) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 24), shell);
    knob.position.set(tvX + 1.7, y, -1.73);
    knob.rotation.x = Math.PI / 2;
    object.add(knob);
  }

  const screenCenter = new THREE.Vector3(tvX - 0.1, TABLE_TOP + 1.72, -1.645);
  const screenWidth = 3.03;
  const screenHeight = 2.27;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  // A gently bowed face catches the shape of a glass picture tube.
  const geometry = new THREE.PlaneGeometry(screenWidth, screenHeight, 32, 24);
  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i) / (screenWidth / 2);
    const y = positions.getY(i) / (screenHeight / 2);
    positions.setZ(i, 0.07 * (1 - x * x) * (1 - y * y));
  }
  geometry.computeVertexNormals();
  const screen = new THREE.Mesh(geometry, screenMaterial);
  screen.name = 'CRT project screen';
  screen.position.copy(screenCenter);
  object.add(screen);
  const screenLight = new THREE.PointLight(0x8ef0cb, 0, 4, 2);
  screenLight.position.copy(screenCenter).add(new THREE.Vector3(0, 0, 0.5));
  object.add(screenLight);

  const cablePoints = [new THREE.Vector3(consoleX + 1.2, TABLE_TOP + 0.2, consoleZ - 0.7), new THREE.Vector3(0.2, TABLE_TOP + 0.08, -1.4), new THREE.Vector3(3.7, TABLE_TOP + 0.08, -1.5), new THREE.Vector3(3.25, TABLE_TOP + 0.5, -2.65)];
  const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePoints), 32, 0.035, 8, false), black);
  cable.name = 'Console video cable';
  object.add(cable);

  let currentProject: CartridgeProject | null = null;
  let image: HTMLImageElement | null = null;
  let imageVersion = 0;
  function textLines(text: string, x: number, y: number, width: number, lineHeight: number) {
    let line = '';
    for (const word of text.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > width) {
        context.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else line = next;
    }
    context.fillText(line, x, y);
  }
  function drawScreen() {
    context.fillStyle = '#14282c';
    context.fillRect(0, 0, 1024, 768);
    context.fillStyle = '#a1f3d3';
    context.shadowColor = '#71e7bc';
    context.shadowBlur = 3;
    context.textAlign = 'left';
    if (currentProject) {
      context.font = 'bold 54px "Courier New", monospace';
      textLines(currentProject.title, 60, 96, 900, 60);
      context.shadowBlur = 0;
      context.fillStyle = '#d9eae3';
      context.font = '38px "Courier New", monospace';
      textLines(currentProject.body, 60, 300, 900, 48);
      if (image?.complete && image.naturalWidth) {
        const scale = Math.min(290 / image.naturalWidth, 170 / image.naturalHeight);
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        context.drawImage(image, 60, 483 + (170 - height) / 2, width, height);
      }
      context.strokeStyle = '#75c7ad';
      context.lineWidth = 2;
      context.strokeRect(415, 520, 548, 108);
      context.fillStyle = '#a1f3d3';
      context.font = 'bold 40px "Courier New", monospace';
      context.fillText('View project', 456, 585);
      context.font = '24px "Courier New", monospace';
      const destination = currentProject.href.startsWith('/') ? 'More about this build' : new URL(currentProject.href).hostname.replace(/^www\./, '');
      context.fillText(destination, 60, 712);
    } else {
      context.textAlign = 'center';
      context.font = 'bold 58px "Courier New", monospace';
      context.fillText("Adrian's stuff", 512, 305);
      context.font = '32px "Courier New", monospace';
      context.fillText('Insert a project cartridge', 512, 401);
      context.font = '26px "Courier New", monospace';
      context.fillText('Click to load · drag to play', 512, 471);
    }
    context.shadowBlur = 0;
    for (let y = 0; y < 768; y += 4) {
      context.fillStyle = '#00000020';
      context.fillRect(0, y, 1024, 1);
    }
    const vignette = context.createRadialGradient(512, 384, 220, 512, 384, 640);
    vignette.addColorStop(0, '#00000000');
    vignette.addColorStop(1, '#00000090');
    context.fillStyle = vignette;
    context.fillRect(0, 0, 1024, 768);
    texture.needsUpdate = true;
  }
  function setProject(project: CartridgeProject | null) {
    currentProject = project;
    image = null;
    const version = ++imageVersion;
    power.emissive.setHex(project ? 0x75c7ad : 0x000000);
    screenLight.intensity = project ? 2.5 : 0.4;
    drawScreen();
    if (!project) return;
    const artwork = new Image();
    artwork.onload = () => {
      if (version !== imageVersion) return;
      image = artwork;
      drawScreen();
    };
    artwork.src = project.image;
  }
  setProject(null);

  return {
    object, screenCenter, screenWidth, screenHeight, setProject,
    slotPosition: new THREE.Vector3(consoleX, top + 0.53, consoleZ - 0.25),
    slotPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -(top + 0.13)),
    isNearSlot(point: THREE.Vector3) {
      return Math.abs(point.x - consoleX) < 1 && Math.abs(point.z - (consoleZ - 0.25)) < 0.65;
    },
    setSlotGlow(dragging: boolean, ready = false) {
      glow.opacity = dragging ? ready ? 1 : 0.4 : 0;
      glow.color.setHex(ready ? 0xb7ffe2 : 0x8ef0cb);
    },
    screenPoint(x: number, y: number) {
      return screenCenter.clone().add(new THREE.Vector3((x / 1024 - 0.5) * screenWidth, (0.5 - y / 768) * screenHeight, 0.075));
    },
  };
}
