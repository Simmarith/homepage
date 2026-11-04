import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { grainTexture } from './SceneMaterials';

export interface CartridgeProject {
  image: string;
  title: string;
  body: string;
  href: string;
  special?: boolean;
}

export const CARTRIDGE_HALF_EXTENTS = new CANNON.Vec3(0.67, 0.77, 0.15);

/** Two molded shell halves share their geometry across the whole collection. */
function shellGeometry(depth: number) {
  const shape = new THREE.Shape();
  const outline = [
    [-0.64, -0.74], [-0.46, -0.74], [-0.46, -0.64],
    [0.46, -0.64], [0.46, -0.74], [0.64, -0.74],
    [0.64, 0.74], [-0.64, 0.74],
  ];
  outline.forEach(([x, y], i) => i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y));
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelSegments: 3,
    steps: 1, bevelSize: 0.02, bevelThickness: 0.015, curveSegments: 1,
  });
}

export function createCartridgeFactory(renderer: THREE.WebGLRenderer) {
  const frontGeometry = shellGeometry(0.1);
  const rearGeometry = shellGeometry(0.1);
  const seamGeometry = shellGeometry(0.012);
  const grain = grainTexture(128, 42);
  grain.repeat.set(7, 7);
  const plastic = new THREE.MeshPhysicalMaterial({
    color: 0xb7b8b1, roughness: 0.57, metalness: 0,
    bumpMap: grain, bumpScale: 0.007, clearcoat: 0.12, clearcoatRoughness: 0.55,
  });
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xc6a04d, roughness: 0.4, metalness: 0.7,
    bumpMap: grain, bumpScale: 0.004, clearcoat: 0.18, clearcoatRoughness: 0.4,
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x373a35, roughness: 0.85 });
  const silver = new THREE.MeshStandardMaterial({ color: 0x999e98, roughness: 0.34, metalness: 0.8 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xd1af5c, roughness: 0.28, metalness: 0.8 });
  const board = new THREE.MeshStandardMaterial({ color: 0x315443, roughness: 0.8 });
  const paperGrain = grainTexture(128, 83);
  paperGrain.repeat.set(4, 4);
  const loader = new THREE.TextureLoader();
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const ridgeGeometry = new RoundedBoxGeometry(0.095, 0.02, 0.017, 1, 0.006);
  const screwGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.012, 12);
  const contactGeometry = new THREE.BoxGeometry(0.026, 0.067, 0.004);

  return function createCartridge(project: CartridgeProject, index: number) {
    const cartridge = new THREE.Group();
    cartridge.name = `${project.title} cartridge`;
    cartridge.userData.project = project;
    const shell = project.special ? gold : plastic;

    function add(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = mesh.receiveShadow = true;
      cartridge.add(mesh);
      return mesh;
    }
    function box(width: number, height: number, depth: number, material: THREE.Material, x = 0, y = 0, z = 0) {
      return add(new THREE.BoxGeometry(width, height, depth), material, x, y, z);
    }
    function instances(geometry: THREE.BufferGeometry, material: THREE.Material, positions: [number, number, number][]) {
      const mesh = new THREE.InstancedMesh(geometry, material, positions.length);
      const matrix = new THREE.Matrix4();
      positions.forEach(([x, y, z], i) => mesh.setMatrixAt(i, matrix.makeTranslation(x, y, z)));
      mesh.castShadow = mesh.receiveShadow = true;
      cartridge.add(mesh);
      return mesh;
    }

    add(frontGeometry, shell, 0, 0, 0.018).name = 'Beveled front shell';
    add(rearGeometry, shell, 0, 0, -0.118).name = 'Beveled rear shell';
    add(seamGeometry, dark, 0, 0, -0.006).name = 'Shell joining seam';

    // Raised grip ribs along both edges and the top of the molded shell.
    const ribs: [number, number, number][] = [];
    for (const x of [-0.578, 0.578]) {
      for (let y = -0.46; y <= 0.5; y += 0.085) {
        ribs.push([x, y, 0.14], [x, y, -0.14]);
      }
    }
    instances(ridgeGeometry, shell, ribs).name = 'Molded grip ribs';
    for (const y of [0.63, 0.66, 0.69]) box(0.87, 0.012, 0.011, shell, 0, y, 0.139);

    const frame = add(new RoundedBoxGeometry(1.02, 1.1, 0.016, 2, 0.035), dark, 0, 0.025, 0.14);
    frame.name = 'Recessed label surround';

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 660;
    const context = canvas.getContext('2d')!;
    const accent = project.special ? '#75622f' : '#365b62';
    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = anisotropy;

    function drawLabel(image?: HTMLImageElement | HTMLCanvasElement | ImageBitmap) {
      context.fillStyle = '#f2f0de';
      context.fillRect(0, 0, 600, 660);
      context.fillStyle = accent;
      context.fillRect(0, 0, 600, 65);
      context.fillStyle = '#f2f0de';
      context.font = '600 27px "Trebuchet MS", sans-serif';
      context.fillText("Adrian’s stuff", 25, 43);
      context.textAlign = 'right';
      context.font = '24px "Trebuchet MS", sans-serif';
      context.fillText(String(index + 1).padStart(2, '0'), 576, 43);
      context.textAlign = 'left';
      context.fillStyle = '#e0e4d8';
      context.fillRect(22, 84, 556, 380);
      if (image) {
        // Fit the entire project image, preserving logos and photo proportions.
        const scale = Math.min(536 / image.width, 360 / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, 300 - width / 2, 274 - height / 2, width, height);
      }
      context.fillStyle = '#263b37';
      context.font = 'bold 38px "Trebuchet MS", sans-serif';
      let line = '';
      let y = 518;
      for (const word of project.title.split(' ')) {
        const next = line ? `${line} ${word}` : word;
        if (context.measureText(next).width > 550 && line) {
          context.fillText(line, 25, y);
          line = word;
          y += 44;
        } else line = next;
      }
      context.fillText(line, 25, y);
      context.fillStyle = accent;
      context.fillRect(25, 610, 550, 2);
      context.font = '22px "Trebuchet MS", sans-serif';
      context.fillText(project.special ? 'Special edition' : 'Project collection', 25, 642);
      labelTexture.needsUpdate = true;
    }
    drawLabel();
    loader.load(project.image, texture => {
      drawLabel(texture.image);
      texture.dispose();
    });
    const label = add(new THREE.PlaneGeometry(0.964, 1.044), new THREE.MeshPhysicalMaterial({
      map: labelTexture, roughness: 0.72, bumpMap: paperGrain, bumpScale: 0.002,
      clearcoat: 0.08, clearcoatRoughness: 0.75,
    }), 0, 0.025, 0.150);
    label.name = 'Printed project label';
    label.castShadow = false;

    // The connector recess exposes a little green board and individual gold pins.
    box(0.92, 0.14, 0.13, dark, 0, -0.69);
    box(0.82, 0.11, 0.048, board, 0, -0.698);
    const contacts: [number, number, number][] = [];
    for (let pin = 0; pin < 18; pin++) {
      const x = -0.374 + pin * 0.044;
      contacts.push([x, -0.712, 0.026], [x, -0.712, -0.026]);
    }
    instances(contactGeometry, copper, contacts).name = 'Gold connector contacts';

    for (const [x, y] of [[-0.5, 0.6], [0.5, 0.6], [0, -0.52]]) {
      const screw = add(screwGeometry, silver, x, y, -0.14);
      screw.rotation.x = Math.PI / 2;
      screw.name = 'Recessed rear screw';
      box(0.04, 0.007, 0.003, dark, x, y, -0.148);
      box(0.007, 0.04, 0.003, dark, x, y, -0.148);
    }
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 384;
    backCanvas.height = 320;
    const backContext = backCanvas.getContext('2d')!;
    backContext.fillStyle = '#a2a69b';
    backContext.fillRect(0, 0, 384, 320);
    backContext.fillStyle = '#494f47';
    backContext.font = 'bold 24px sans-serif';
    backContext.fillText('Project cartridge', 28, 48);
    backContext.font = '18px sans-serif';
    ['Handle with curiosity.', 'Made by Adrian.', 'Explore. Build. Repeat.'].forEach((text, i) => backContext.fillText(text, 28, 104 + i * 33));
    for (let x = 30; x < 355; x += 6) backContext.fillRect(x, 235, x % 4 ? 2 : 4, 42);
    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    const backLabel = add(new THREE.PlaneGeometry(0.85, 0.71), new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.9 }), 0, 0.02, -0.135);
    backLabel.rotation.y = Math.PI;
    backLabel.castShadow = false;
    return cartridge;
  };
}
