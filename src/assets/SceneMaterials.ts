import * as THREE from 'three';

/** Repeatable fine grain for plaster, molded plastic, and paper. */
export function grainTexture(size = 128, seed = 17) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const context = canvas.getContext('2d')!;
  const pixels = context.createImageData(size, size);
  for (let i = 0; i < pixels.data.length; i += 4) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const value = 125 + (seed >>> 27);
    pixels.data.set([value, value, value, 255], i);
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function woodMaterial(renderer: THREE.WebGLRenderer, color: number, repeatX = 1, repeatY = 1) {
  const map = new THREE.TextureLoader().load('/wood.png');
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const grain = grainTexture();
  grain.repeat.set(5, 5);
  return new THREE.MeshStandardMaterial({ map, color, roughness: 0.68, bumpMap: grain, bumpScale: 0.018 });
}
