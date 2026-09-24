// A modern luxury residence at golden hour, driven entirely by scroll.
// Loaded on demand (dynamic import) so three.js never touches pages that
// don't show it. Everything is built from code: no model files to load.
//
// Look: architectural visualization. Warm plaster, charcoal cladding, oak,
// travertine and glass, a reflective pool, soft sun, gentle bloom.
//
// Scroll progress 0..1 has five chapters (0.2 each):
//   1 establishing shot -> 2 prep (fine light motes, yard sign) -> 3 show it
//   off (the camera sweeps the front; the glass catches the "flash") ->
//   4 get it seen (ripples spread across the neighborhood) -> 5 buyers at
//   the door (the front door opens, warm light spills out).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface SceneHandle {
  dispose: () => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const window4 = (p: number, a: number, b: number, c: number, d: number) => ramp(p, a, b) * (1 - ramp(p, c, d));
const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function makeTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 256, h = 256): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (ctx) draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Small deterministic random so the landscape is the same every visit.
let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

export function createHouseScene(container: HTMLElement, getProgress: () => number): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  const isSmall = Math.min(container.clientWidth, container.clientHeight) < 700;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);
  renderer.setPixelRatio(pixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);

  // ---- Sky: a soft golden-hour gradient, used as the backdrop and for reflections ----
  const skyTex = makeTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0.0, '#8DB2CE');
    g.addColorStop(0.35, '#C9D6DD');
    g.addColorStop(0.55, '#F1DCC6');
    g.addColorStop(0.7, '#F7DFC4');
    g.addColorStop(1.0, '#EFE4D3');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, 4, 512);
  scene.background = skyTex;
  scene.fog = new THREE.Fog(0xf1dcc6, 70, 190);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envDome = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide }));
  envScene.add(envDome);
  const envRT = pmrem.fromScene(envScene, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.75;

  // ---- Lights ----
  scene.add(new THREE.HemisphereLight(0xcfe0ec, 0xd8cdb8, 0.55));
  const sun = new THREE.DirectionalLight(0xffd9a8, 3.4);
  sun.position.set(34, 20, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(isSmall ? 1024 : 2048, isSmall ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -24;
  sc.right = 24;
  sc.top = 22;
  sc.bottom = -22;
  sc.near = 1;
  sc.far = 120;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);

  const doorLight = new THREE.PointLight(0xffb86a, 0, 14, 1.5);
  doorLight.position.set(3.4, 1.6, 1.4);
  scene.add(doorLight);

  // ---- Helpers ----
  const std = (color: number, rough = 0.8, metal = 0.0, emissive = 0x000000, ei = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, emissive, emissiveIntensity: ei });

  const rbox = (w: number, h: number, d: number, mat: THREE.Material, r = 0.03, shadow = true) => {
    const rad = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.max(0.004, rad)), mat);
    m.castShadow = shadow;
    m.receiveShadow = true;
    return m;
  };

  const PLASTER = std(0xefe9df, 0.9);
  const CHARCOAL = std(0x2e3236, 0.7);
  const STONE = std(0xcdbb9f, 0.95);
  const OAK = std(0xb98b5a, 0.7);
  const WHITE = std(0xf7f4ee, 0.6);
  const PAVING = std(0xd9d2c4, 0.95);
  const BLACK = std(0x1d2124, 0.5, 0.3);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xbfd6de,
    roughness: 0.04,
    metalness: 0.0,
    transparent: true,
    opacity: 0.3,
    envMapIntensity: 1.6,
  });
  // Lit interiors, painted on a texture so they read as real rooms behind the glass.
  const interiorTex = makeTexture((ctx, w, h) => {
    const wall = ctx.createLinearGradient(0, 0, 0, h * 0.78);
    wall.addColorStop(0, '#FFE3B8');
    wall.addColorStop(1, '#F0B878');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h * 0.78);
    const floor = ctx.createLinearGradient(0, h * 0.78, 0, h);
    floor.addColorStop(0, '#8A6644');
    floor.addColorStop(1, '#5B422B');
    ctx.fillStyle = floor;
    ctx.fillRect(0, h * 0.78, w, h * 0.22);
    ctx.fillStyle = '#FFF6E0';
    ctx.fillRect(w * 0.06, h * 0.05, w * 0.88, h * 0.03);
    ctx.fillStyle = '#B6522F';
    ctx.fillRect(w * 0.56, h * 0.2, w * 0.2, h * 0.28);
    ctx.fillStyle = '#3A3A3C';
    ctx.fillRect(w * 0.08, h * 0.52, w * 0.4, h * 0.2);
    ctx.fillRect(w * 0.08, h * 0.42, w * 0.4, h * 0.12);
    ctx.fillStyle = '#2B2B2D';
    ctx.fillRect(w * 0.6, h * 0.62, w * 0.3, h * 0.1);
    const lamp = ctx.createRadialGradient(w * 0.86, h * 0.42, 0, w * 0.86, h * 0.42, w * 0.12);
    lamp.addColorStop(0, 'rgba(255,250,225,1)');
    lamp.addColorStop(1, 'rgba(255,250,225,0)');
    ctx.fillStyle = lamp;
    ctx.fillRect(w * 0.6, 0, w * 0.4, h);
  }, 512, 256);
  const bandTex = makeTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#FFE6BF');
    g.addColorStop(1, '#F2BC82');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,240,0.9)';
    for (let i = 0; i < 4; i++) ctx.fillRect(w * (0.07 + i * 0.235), h * 0.12, w * 0.12, h * 0.05);
    ctx.fillStyle = 'rgba(90,60,40,0.55)';
    ctx.fillRect(w * 0.1, h * 0.58, w * 0.3, h * 0.42);
    ctx.fillRect(w * 0.62, h * 0.5, w * 0.24, h * 0.5);
  }, 512, 96);
  const interiorFront = new THREE.MeshStandardMaterial({ map: interiorTex, emissiveMap: interiorTex, emissive: 0xffffff, emissiveIntensity: 1.35, roughness: 1, color: 0x2a2a2a });
  const interiorBand = new THREE.MeshStandardMaterial({ map: bandTex, emissiveMap: bandTex, emissive: 0xffffff, emissiveIntensity: 1.2, roughness: 1, color: 0x2a2a2a });

  const world = new THREE.Group();
  scene.add(world);

  // ---- Ground ----
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), std(0xe6dfd0, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.add(ground);
  const lawn = rbox(30, 0.06, 22, std(0xa2b18f, 1), 0.02, false);
  lawn.position.set(0, 0.03, 5);
  world.add(lawn);
  const gravel = rbox(30, 0.05, 6, std(0xd9d3c6, 1), 0.02, false);
  gravel.position.set(0, 0.035, 15.5);
  world.add(gravel);

  // ---- House ----
  const house = new THREE.Group();
  world.add(house);

  // Ground-floor volume
  const ground1 = rbox(10, 3, 4.4, PLASTER, 0.05);
  ground1.position.set(0, 1.58, 0);
  house.add(ground1);
  // Plinth and terrace
  const terrace = rbox(11.4, 0.14, 3.4, PAVING, 0.03);
  terrace.position.set(-0.2, 0.07, 3.6);
  house.add(terrace);

  // Living-room glazing with a warm glowing interior behind it
  const room = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.5), interiorFront);
  room.position.set(-1.6, 1.5, 2.24);
  house.add(room);
  const glass1 = rbox(5.2, 2.5, 0.05, glassMat, 0.01, false);
  glass1.position.set(-1.6, 1.5, 2.29);
  house.add(glass1);
  for (let i = 0; i <= 4; i++) {
    const mull = rbox(0.06, 2.55, 0.09, BLACK, 0.005, false);
    mull.position.set(-4.2 + i * 1.3, 1.5, 2.31);
    house.add(mull);
  }
  const headFrame = rbox(5.3, 0.1, 0.1, BLACK, 0.005, false);
  headFrame.position.set(-1.6, 2.77, 2.31);
  house.add(headFrame);

  // Stone feature wall + timber panel
  const stoneWall = rbox(0.7, 5.8, 2.6, STONE, 0.02);
  stoneWall.position.set(-5.45, 2.95, 0.7);
  house.add(stoneWall);
  for (let i = 0; i < 6; i++) {
    const groove = rbox(0.02, 5.7, 0.03, std(0xb9a688, 1), 0.005, false);
    groove.position.set(-5.09, 2.95, -0.4 + i * 0.42);
    house.add(groove);
  }
  const oakPanel = rbox(1.5, 2.8, 0.12, OAK, 0.02);
  oakPanel.position.set(4.55, 1.55, 2.24);
  house.add(oakPanel);
  for (let i = 0; i < 7; i++) {
    const slat = rbox(0.03, 2.8, 0.14, std(0x9d7145, 0.7), 0.005, false);
    slat.position.set(3.95 + i * 0.2, 1.55, 2.26);
    house.add(slat);
  }

  // Upper volume: charcoal box, cantilevered forward, with a lit window band
  const upper = rbox(7.4, 2.7, 4.6, CHARCOAL, 0.05);
  upper.position.set(1.4, 4.5, 0.3);
  house.add(upper);
  const bandGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 1.2), interiorBand);
  bandGlow.position.set(1.0, 4.5, 2.63);
  house.add(bandGlow);
  const bandGlass = rbox(5.9, 1.3, 0.05, glassMat, 0.01, false);
  bandGlass.position.set(1.0, 4.5, 2.68);
  house.add(bandGlass);
  for (let i = 0; i <= 4; i++) {
    const mull = rbox(0.05, 1.32, 0.08, BLACK, 0.004, false);
    mull.position.set(-1.95 + i * 1.45, 4.5, 2.7);
    house.add(mull);
  }
  const roof1 = rbox(10.6, 0.22, 4.9, WHITE, 0.03);
  roof1.position.set(0, 3.2, 0.1);
  house.add(roof1);
  const roof2 = rbox(8.0, 0.24, 5.1, WHITE, 0.03);
  roof2.position.set(1.4, 5.98, 0.3);
  house.add(roof2);

  // Entry: recessed under the cantilever, oak door on a hinge
  const doorFrame = rbox(1.5, 2.75, 0.14, BLACK, 0.01);
  doorFrame.position.set(3.4, 1.4, 2.2);
  house.add(doorFrame);
  const doorwayMat = std(0x3a2a20, 0.9, 0, 0xffc27d, 0);
  const doorway = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.5), doorwayMat);
  doorway.position.set(3.4, 1.33, 2.28);
  house.add(doorway);
  const doorPivot = new THREE.Group();
  doorPivot.position.set(2.8, 0, 2.34);
  const doorMesh = rbox(1.2, 2.5, 0.09, OAK, 0.02);
  doorMesh.position.set(0.6, 1.28, 0);
  doorPivot.add(doorMesh);
  const handle = rbox(0.04, 0.9, 0.05, std(0xc9a96a, 0.3, 0.9), 0.01, false);
  handle.position.set(1.05, 1.28, 0.08);
  doorPivot.add(handle);
  house.add(doorPivot);

  // Path: stepping stones from the door toward the gravel court
  for (let i = 0; i < 8; i++) {
    const stone = rbox(1.5, 0.07, 0.75, PAVING, 0.02);
    stone.position.set(3.4, 0.05, 2.9 + i * 1.15);
    house.add(stone);
  }

  // Pool with soft, warm lighting
  const coping = rbox(9.0, 0.16, 3.5, WHITE, 0.03);
  coping.position.set(-2.4, 0.08, 7.6);
  house.add(coping);
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(8.4, 0.1, 2.9),
    new THREE.MeshPhysicalMaterial({ color: 0x6fc4d0, roughness: 0.05, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.8 })
  );
  water.position.set(-2.4, 0.1, 7.6);
  water.receiveShadow = true;
  house.add(water);
  for (let i = 0; i < 4; i++) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 12), std(0xffe2b0, 0.5, 0, 0xffd08a, 2.4));
    lamp.position.set(-5.4 + i * 2.0, 0.17, 6.2);
    house.add(lamp);
  }
  // Loungers
  for (let i = 0; i < 2; i++) {
    const l = rbox(0.7, 0.12, 1.9, std(0xf1ece2, 0.9), 0.05);
    l.position.set(1.4 + i * 0.9, 0.28, 6.4);
    l.rotation.y = 0.04;
    house.add(l);
  }

  // ---- Landscape ----
  const olive = (x: number, z: number, s: number) => {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.16 * s, 1.5 * s, 8), std(0x6f5a48, 0.95));
    trunk.position.y = 0.75 * s;
    trunk.rotation.z = 0.08;
    trunk.castShadow = true;
    g.add(trunk);
    for (let i = 0; i < 6; i++) {
      const blob = new THREE.Mesh(new THREE.IcosahedronGeometry((0.55 + rand() * 0.3) * s, 1), std(i % 2 ? 0x8a9a7c : 0x7a8c6e, 0.95));
      blob.position.set((rand() - 0.5) * 1.3 * s, (1.7 + rand() * 0.7) * s, (rand() - 0.5) * 1.3 * s);
      blob.castShadow = true;
      g.add(blob);
    }
    g.position.set(x, 0, z);
    world.add(g);
  };
  olive(-8.5, 4.5, 1.2);
  olive(9.4, 5.6, 1.1);
  olive(-9.5, -1.5, 1.3);
  olive(8.4, -3, 1.0);
  olive(-12.5, 10, 1.1);
  olive(13, 11, 1.2);

  const cypress = (x: number, z: number, h: number) => {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.55, h, 10), std(0x455f4b, 0.95));
    c.position.set(x, h / 2, z);
    c.castShadow = true;
    world.add(c);
  };
  [[-6.6, 3.2, 4.6], [-6.9, 5.6, 4.0], [6.6, 3.6, 4.3], [7.0, 1.4, 3.8], [-11, 3, 5], [11.4, 3, 4.6]].forEach(([x, z, h]) => cypress(x, z, h));

  const hedge = (x: number, z: number, w: number) => {
    const h = rbox(w, 0.9, 0.7, std(0x5c7358, 1), 0.25);
    h.position.set(x, 0.45, z);
    world.add(h);
  };
  hedge(-7.5, 10.6, 6);
  hedge(4.4, 10.6, 5);
  hedge(-12, 6, 4);

  // Landscape uplights (they catch the bloom)
  const upMat = std(0xffd9a0, 0.5, 0, 0xffc477, 2.6);
  [[-8.5, 5.2], [9.4, 6.3], [-9.5, -0.8], [-6.2, 4.4], [6.6, 4.2]].forEach(([x, z]) => {
    const u = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 10), upMat);
    u.position.set(x, 0.09, z);
    world.add(u);
  });

  // Yard sign that fades in during chapter 2 (a sleek modern one)
  const sign = new THREE.Group();
  const sPost = rbox(0.07, 1.7, 0.07, BLACK, 0.01);
  sPost.position.y = 0.85;
  const sArm = rbox(1.05, 0.06, 0.06, BLACK, 0.01);
  sArm.position.set(0.5, 1.62, 0);
  const sBoard = rbox(0.85, 0.55, 0.04, WHITE, 0.01);
  sBoard.position.set(0.52, 1.28, 0);
  const sBar = rbox(0.6, 0.06, 0.05, std(0x0f5c63, 0.6), 0.005, false);
  sBar.position.set(0.52, 1.4, 0.01);
  const sBar2 = rbox(0.38, 0.045, 0.05, std(0xc9a96a, 0.4, 0.6), 0.005, false);
  sBar2.position.set(0.52, 1.28, 0.01);
  const sBar3 = rbox(0.5, 0.035, 0.05, std(0xd9d2c4, 0.8), 0.005, false);
  sBar3.position.set(0.52, 1.17, 0.01);
  sign.add(sPost, sArm, sBoard, sBar, sBar2, sBar3);
  sign.position.set(8.2, 0, 13.4);
  sign.rotation.y = -0.5;
  sign.scale.setScalar(0.001);
  world.add(sign);

  // Fine light motes (chapter 2)
  const moteTex = makeTexture((ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,240,200,1)');
    g.addColorStop(0.4, 'rgba(255,220,160,0.6)');
    g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, 64, 64);
  const MOTES = 110;
  const motePos = new Float32Array(MOTES * 3);
  const moteBase = new Float32Array(MOTES * 3);
  for (let i = 0; i < MOTES; i++) {
    moteBase[i * 3] = (rand() - 0.5) * 22;
    moteBase[i * 3 + 1] = rand() * 6;
    moteBase[i * 3 + 2] = rand() * 16 - 2;
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const moteMat = new THREE.PointsMaterial({ size: 0.16, map: moteTex, color: 0xfff0c8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const motes = new THREE.Points(moteGeo, moteMat);
  world.add(motes);

  // ---- The neighborhood (chapter 4): quiet white-model homes + reach ripples ----
  const neighbors: { g: THREE.Group; beam: THREE.Mesh; tip: THREE.Mesh; phase: number }[] = [];
  const nWalls = [0xe9e2d6, 0xd5cdbe, 0xede7dc, 0xdcd3c3];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.4;
    const r = 34 + (i % 3) * 14;
    const g = new THREE.Group();
    const w = 6 + rand() * 3;
    const d = 5 + rand() * 2;
    const b = rbox(w, 3.4, d, std(nWalls[i % 4], 0.95), 0.05);
    b.position.y = 1.7;
    g.add(b);
    const roofN = rbox(w + 0.6, 0.3, d + 0.6, std(0x8a8f93, 0.9), 0.04);
    roofN.position.y = 3.55;
    g.add(roofN);
    const win = rbox(w * 0.5, 1.2, 0.06, std(0xf2c99b, 0.9, 0, 0xffb870, 1.2), 0.01, false);
    win.position.set(0, 1.8, d / 2 + 0.02);
    g.add(win);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 26, 8), new THREE.MeshBasicMaterial({ color: 0xe0b45c, transparent: true, opacity: 0 }));
    beam.position.y = 13;
    g.add(beam);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 14), new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0 }));
    tip.position.y = 26;
    g.add(tip);
    g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    g.rotation.y = -a + Math.PI / 2 + (rand() - 0.5) * 0.6;
    g.scale.set(1, 0.001, 1);
    world.add(g);
    neighbors.push({ g, beam, tip, phase: i * 0.7 });
  }
  const ripples: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const rp = new THREE.Mesh(new THREE.RingGeometry(0.97, 1.0, 128), new THREE.MeshBasicMaterial({ color: 0xe0b45c, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    rp.rotation.x = -Math.PI / 2;
    rp.position.y = 0.12;
    world.add(rp);
    ripples.push(rp);
  }

  // ---- Camera path: keys at chapter boundaries, plus one mid-chapter-3 ----
  const posKeys = [
    new THREE.Vector3(17, 5.5, 24),
    new THREE.Vector3(6, 2.4, 18),
    new THREE.Vector3(-15, 4.2, 13),
    new THREE.Vector3(0, 6.5, 24),
    new THREE.Vector3(16, 5.2, 13),
    new THREE.Vector3(2, 24, 30),
    new THREE.Vector3(3.4, 1.7, 9.5),
  ];
  const lookKeys = [
    new THREE.Vector3(0, 2.6, 0),
    new THREE.Vector3(0, 2.6, 0),
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0, 0, -6),
    new THREE.Vector3(3.4, 1.5, 2.2),
  ];
  const posCurve = new THREE.CatmullRomCurve3(posKeys, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookKeys, false, 'centripetal');
  // Progress -> curve parameter, so each chapter lands on a key.
  const toParam = (p: number) => {
    const stops: [number, number][] = [
      [0, 0],
      [0.2, 1],
      [0.4, 2],
      [0.5, 3],
      [0.6, 4],
      [0.8, 5],
      [1, 6],
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const [p0, u0] = stops[i];
      const [p1, u1] = stops[i + 1];
      if (p <= p1) {
        const t = (p - p0) / (p1 - p0);
        // ease within each leg so the camera drifts rather than jerks
        const e = t * t * (3 - 2 * t);
        return (u0 + (u1 - u0) * (0.35 * t + 0.65 * e)) / 6;
      }
    }
    return 1;
  };
  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  // ---- Post-processing: gentle bloom on the glowing glass ----
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  try {
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: isSmall ? 0 : 4 });
    composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.42, 0.7, 0.86);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  } catch {
    composer = null;
  }

  let aspect = 1;
  const resize = () => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    if (composer) {
      composer.setPixelRatio(pixelRatio);
      composer.setSize(w, h);
    }
    aspect = w / h;
    camera.aspect = aspect;
    camera.fov = 34;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let visible = true;
  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
  });
  io.observe(container);

  // ---- Loop ----
  let cur = getProgress();
  let raf = 0;
  const clock = new THREE.Clock();
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    cur += (getProgress() - cur) * Math.min(1, dt * 4.5);
    const p = clamp01(cur);

    const u = toParam(p);
    posCurve.getPoint(u, tmpPos);
    lookCurve.getPoint(u, tmpLook);
    // Fit the house to the screen shape: pull back on tall or narrow screens.
    const fit = aspect >= 1.2 ? 1 : Math.min(2.0, Math.pow(1.2 / aspect, 0.8));
    tmpPos.multiplyScalar(fit);
    if (aspect < 0.85) tmpLook.y -= 1.4;
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);

    // Chapter 2: light motes + yard sign
    moteMat.opacity = window4(p, 0.14, 0.26, 0.36, 0.46) * 0.9;
    const pa = moteGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < MOTES; i++) {
      pa.setXYZ(i, moteBase[i * 3] + Math.sin(t * 0.4 + i) * 0.3, (moteBase[i * 3 + 1] + t * 0.25 + i * 0.11) % 6.2, moteBase[i * 3 + 2]);
    }
    pa.needsUpdate = true;
    sign.scale.setScalar(Math.max(0.001, easeOutBack(ramp(p, 0.26, 0.36))));

    // Chapter 3: the glass "catches the flash" a few times
    const shoot = window4(p, 0.4, 0.46, 0.6, 0.66);
    const flash = shoot * Math.max(0, Math.sin(t * 2.2)) ** 6;
    interiorFront.emissiveIntensity = 1.35 + flash * 1.1;
    interiorBand.emissiveIntensity = 1.2 + flash * 0.9;
    if (bloom) bloom.strength = 0.42 + flash * 0.35;

    // Chapter 4: neighborhood grows, beams rise, ripples spread
    const net = ramp(p, 0.6, 0.74);
    neighbors.forEach((n, i) => {
      n.g.scale.y = Math.max(0.001, easeOutBack(clamp01(net * 1.2 - i * 0.03)));
      (n.beam.material as THREE.MeshBasicMaterial).opacity = ramp(p, 0.64, 0.76) * 0.5 * (0.7 + 0.3 * Math.sin(t * 2 + n.phase));
      (n.tip.material as THREE.MeshBasicMaterial).opacity = ramp(p, 0.64, 0.76) * 0.9;
    });
    ripples.forEach((r, i) => {
      const cycle = ((t * 0.16 + i / 3) % 1);
      const scale = 3 + cycle * 90;
      r.scale.set(scale, scale, 1);
      (r.material as THREE.MeshBasicMaterial).opacity = window4(p, 0.62, 0.7, 0.9, 0.98) * (1 - cycle) * 0.65;
    });

    // Chapter 5: the door opens, warm light spills out
    const open = ramp(p, 0.86, 0.97);
    doorPivot.rotation.y = -open * 1.55;
    doorwayMat.emissiveIntensity = open * 1.8;
    doorLight.intensity = open * 14;

    if (composer) composer.render();
    else renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  const dispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else if (mat) {
        const anyMat = mat as THREE.MeshBasicMaterial;
        if (anyMat.map && anyMat.map !== skyTex) anyMat.map.dispose();
        mat.dispose();
      }
    });
    envScene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    });
    (envDome.material as THREE.Material).dispose();
    envRT.dispose();
    pmrem.dispose();
    skyTex.dispose();
    moteTex.dispose();
    interiorTex.dispose();
    bandTex.dispose();
    if (composer) composer.dispose();
    renderer.dispose();
    if (canvas.parentElement === container) container.removeChild(canvas);
  };

  return { dispose };
}
