import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { grainTexture, woodMaterial } from './SceneMaterials';

export const TABLE_TOP = -1.8;
export const FLOOR_HEIGHT = -6.5;

export function createRoom(scene: THREE.Scene, world: CANNON.World, renderer: THREE.WebGLRenderer) {
  const room = new THREE.Group();
  room.name = 'Daylit maker room';
  scene.add(room);

  function box(name: string, size: [number, number, number], position: [number, number, number], material: THREE.Material, rounded = false) {
    const geometry = rounded
      ? new RoundedBoxGeometry(...size, 2, Math.min(0.06, Math.min(...size) / 4))
      : new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    room.add(mesh);
    return mesh;
  }

  const plasterGrain = grainTexture();
  plasterGrain.repeat.set(12, 12);
  const plaster = new THREE.MeshStandardMaterial({ color: 0xd3dcd5, roughness: 0.95, bumpMap: plasterGrain, bumpScale: 0.045 });
  const sidePlaster = plaster.clone();
  sidePlaster.color.setHex(0xb9c8bf);
  const trim = new THREE.MeshStandardMaterial({ color: 0xecece1, roughness: 0.7 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x333936, roughness: 0.55, metalness: 0.2 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb89a54, roughness: 0.33, metalness: 0.72 });
  const walnut = woodMaterial(renderer, 0x9c795b);
  const edgeWood = woodMaterial(renderer, 0x826046);
  const floorWood = woodMaterial(renderer, 0xc5ab85, 3, 4);

  box('Oak floor', [24, 0.18, 28], [0, FLOOR_HEIGHT - 0.09, 1], floorWood);
  // An opening in the rear wall lets the sunlight actually enter the room.
  box('Rear wall, right', [14, 40, 0.25], [4, 13.5, -8.6], plaster);
  box('Rear wall, left', [2.7, 40, 0.25], [-9.65, 13.5, -8.6], plaster);
  box('Wall below window', [5.3, 3.8, 0.25], [-5.65, -4.6, -8.6], plaster);
  box('Wall above window', [5.3, 30.1, 0.25], [-5.65, 18.45, -8.6], plaster);
  // Interior-facing walls keep the room visible when portrait framing backs out.
  for (const [x, material] of [[-11.1, sidePlaster], [11.1, plaster]] as const) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(28, 40), material);
    wall.name = x < 0 ? 'Left wall' : 'Right wall';
    wall.position.set(x, 13.5, 1);
    wall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    wall.castShadow = wall.receiveShadow = true;
    room.add(wall);
  }
  box('Rear skirting', [22, 0.32, 0.12], [0, -6.25, -8.4], trim);
  box('Left skirting', [0.12, 0.32, 28], [-10.9, -6.25, 1], trim);
  box('Right skirting', [0.12, 0.32, 28], [10.9, -6.25, 1], trim);

  const sky = new THREE.MeshBasicMaterial({ color: 0xcde4ed, toneMapped: false });
  const outdoors = box('Daylight outside', [5.3, 6.1, 0.03], [-5.65, 0.35, -8.83], sky);
  outdoors.castShadow = false;
  for (const x of [-8.3, -5.65, -3]) box('Window vertical frame', [0.13, 6.25, 0.35], [x, 0.35, -8.5], trim);
  for (const y of [-2.7, 0.35, 3.4]) box('Window horizontal frame', [5.45, 0.13, 0.35], [-5.65, y, -8.5], trim);
  box('Window sill', [5.65, 0.16, 0.68], [-5.65, -2.75, -8.25], trim, true);

  // A woven rug catches the table's shadow and grounds all four legs.
  const weaveCanvas = document.createElement('canvas');
  weaveCanvas.width = weaveCanvas.height = 64;
  const weave = weaveCanvas.getContext('2d')!;
  weave.fillStyle = '#718075';
  weave.fillRect(0, 0, 64, 64);
  for (let i = 0; i < 64; i += 4) {
    weave.fillStyle = '#8a9685';
    weave.fillRect(i, 0, 1, 64);
    weave.fillStyle = '#55685d';
    weave.fillRect(0, i, 64, 1);
  }
  const woven = new THREE.CanvasTexture(weaveCanvas);
  woven.colorSpace = THREE.SRGBColorSpace;
  woven.wrapS = woven.wrapT = THREE.RepeatWrapping;
  woven.repeat.set(40, 28);
  woven.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const rugMaterial = new THREE.MeshStandardMaterial({ map: woven, roughness: 1 });
  box('Woven rug', [14.2, 0.035, 10.3], [0, FLOOR_HEIGHT + 0.025, 0.25], rugMaterial);

  box('Solid walnut tabletop', [12, 0.4, 8], [0, -2, 0], walnut, true);
  for (const z of [-3.35, 3.35]) box('Long table apron', [10.9, 0.6, 0.16], [0, -2.5, z], edgeWood, true);
  for (const x of [-5.35, 5.35]) box('End table apron', [0.16, 0.6, 6.7], [x, -2.5, 0], edgeWood, true);
  for (const x of [-5.3, 5.3]) {
    for (const z of [-3.3, 3.3]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.17, 4.3, 4), edgeWood);
      leg.name = 'Tapered walnut table leg';
      leg.position.set(x, -4.35, z);
      leg.rotation.y = Math.PI / 4;
      leg.castShadow = leg.receiveShadow = true;
      room.add(leg);
      box('Brass foot', [0.24, 0.16, 0.24], [x, -6.4, z], brass, true);
    }
  }
  const tableBody = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(6, 0.2, 4)) });
  tableBody.position.set(0, -2, 0);
  world.addBody(tableBody);

  // A small shelf of manuals and parts gives the room a lived-in scale.
  box('Wall shelf', [5.2, 0.16, 0.85], [3.9, 0, -8.05], edgeWood, true);
  for (const x of [2, 5.8]) {
    box('Shelf bracket', [0.07, 0.7, 0.07], [x, -0.35, -8.28], graphite);
    box('Shelf support', [0.07, 0.07, 0.65], [x, -0.65, -8], graphite);
  }
  const bookColors = [0x335b64, 0xc9b681, 0x8c5550, 0x496256, 0xddd9c6];
  bookColors.forEach((color, i) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    const x = 2 + i * 0.32;
    const height = 1.05 + (i % 3) * 0.13;
    box('Workshop manual', [0.26, height, 0.53], [x, height / 2 + 0.08, -8.05], material, true);
    for (const y of [0.28, 0.88]) box('Book spine band', [0.27, 0.035, 0.012], [x, y, -7.777], trim);
  });
  box('Parts tin', [1.2, 0.45, 0.55], [5.2, 0.3, -8.03], graphite, true);
  box('Parts tin lid', [1.24, 0.045, 0.59], [5.2, 0.54, -8.03], brass, true);

  // A desk lamp adds a warm pool beside the cooler window light.
  const lamp = new THREE.Group();
  lamp.name = 'Brass desk lamp';
  lamp.position.set(4.65, TABLE_TOP, -2.85);
  room.add(lamp);
  function lampMesh(geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number]) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = mesh.receiveShadow = true;
    lamp.add(mesh);
    return mesh;
  }
  lampMesh(new THREE.CylinderGeometry(0.48, 0.52, 0.12, 40), graphite, [0, 0.06, 0]);
  const stem = lampMesh(new THREE.CylinderGeometry(0.055, 0.055, 2.1, 16), brass, [0, 1.08, 0]);
  stem.rotation.z = -0.12;
  const shade = lampMesh(new THREE.CylinderGeometry(0.24, 0.65, 0.48, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0x3f5b50, roughness: 0.4, side: THREE.DoubleSide }), [0.12, 2.17, 0]);
  shade.rotation.z = -0.16;
  const bulb = lampMesh(new THREE.SphereGeometry(0.12, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe2a6, toneMapped: false }), [0.12, 2, 0]);
  bulb.castShadow = false;
  const lampLight = new THREE.SpotLight(0xffdfaa, 24, 9, Math.PI / 3, 1, 2);
  lampLight.position.set(4.77, TABLE_TOP + 1.95, -2.85);
  lampLight.target.position.set(3.8, TABLE_TOP, -1.9);
  scene.add(lampLight, lampLight.target);

  // Reflection lighting is essential for readable metal and rounded plastic.
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(environment, 0.04).texture;
  scene.environmentIntensity = 0.65;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xdcecf4, 0x9b8062, 1.05));
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.2);
  sun.position.set(-6.5, 7, -7.5);
  sun.target.position.set(0, -2, 1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -13;
  sun.shadow.camera.right = 13;
  sun.shadow.camera.top = 13;
  sun.shadow.camera.bottom = -13;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 40;
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.0001;
  scene.add(sun, sun.target);
  const bounce = new THREE.DirectionalLight(0xd6e6f2, 0.55);
  bounce.position.set(6, 2, 8);
  scene.add(bounce);
}
