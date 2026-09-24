// A stylized 3D house on a floating island, driven entirely by scroll.
// Loaded on demand (dynamic import) so three.js never touches pages that
// don't show it. Everything is built from code: no model files to load.
//
// Scroll progress 0..1 has five chapters (0.2 each):
//   1 establishing shot -> 2 prep (sparkles, yard sign) -> 3 show it off
//   (drone orbit, floating photos) -> 4 get it seen (network of homes) ->
//   5 buyers at the door (door opens, warm light, keys).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export interface SceneHandle {
  dispose: () => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// 0 before a, 1 after b, smooth in between.
const ramp = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// Rises across a..b, holds, then falls across c..d.
const window4 = (p: number, a: number, b: number, c: number, d: number) => ramp(p, a, b) * (1 - ramp(p, c, d));
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
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

export function createHouseScene(container: HTMLElement, getProgress: () => number): SceneHandle | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;

  const isSmall = Math.min(container.clientWidth, container.clientHeight) < 700;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
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
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  // ---- Lights ----
  scene.add(new THREE.HemisphereLight(0xeaf6ff, 0xb9d99f, 1.0));
  const sun = new THREE.DirectionalLight(0xfff0d2, 2.6);
  sun.position.set(9, 15, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(isSmall ? 1024 : 2048, isSmall ? 1024 : 2048);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 40;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const doorLight = new THREE.PointLight(0xffb45c, 0, 7, 1.6);
  doorLight.position.set(0, 1.3, 1.2);
  scene.add(doorLight);

  // ---- Helpers ----
  const std = (color: number, rough = 0.85, emissive = 0x000000, ei = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.02, emissive, emissiveIntensity: ei });

  const rbox = (w: number, h: number, d: number, color: number, r = 0.05) => {
    const rad = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.max(0.005, rad)), std(color));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const prism = (span: number, height: number, length: number, color: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(-span / 2, 0);
    shape.lineTo(span / 2, 0);
    shape.lineTo(0, height);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    g.translate(0, 0, -length / 2);
    g.rotateY(Math.PI / 2); // ridge runs along x
    const m = new THREE.Mesh(g, std(color, 0.7));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const cylinder = (rt: number, rb: number, h: number, color: number, seg = 32) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), std(color, 0.9));
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const BRICK = 0xb9624a;
  const BRICK_DARK = 0x9a4f3b;
  const TRIM = 0xfaf8f5;
  const ROOF = 0x3e4c55;
  const TEAL = 0x0f5c63;
  const GOLD = 0xe0b45c;
  const GRASS = 0x86c46f;

  // ---- Island + house ----
  const world = new THREE.Group();
  scene.add(world);

  const island = new THREE.Group();
  world.add(island);
  const top = cylinder(6.2, 6.3, 0.6, GRASS, 48);
  top.position.y = -0.3;
  island.add(top);
  const under = new THREE.Mesh(new THREE.ConeGeometry(6.3, 3.4, 32), std(0xa47c5c, 0.95));
  under.rotation.x = Math.PI;
  under.position.y = -2.3;
  under.castShadow = true;
  island.add(under);

  const house = new THREE.Group();
  island.add(house);

  const body = rbox(4, 2.2, 3, BRICK, 0.08);
  body.position.y = 1.1;
  house.add(body);
  const roof = prism(3.9, 1.35, 4.6, ROOF);
  roof.position.y = 2.2;
  house.add(roof);
  const chimney = rbox(0.42, 1.2, 0.42, BRICK_DARK, 0.04);
  chimney.position.set(1.2, 3.2, -0.4);
  house.add(chimney);

  // Garage wing
  const garage = rbox(2.2, 1.6, 2.6, BRICK, 0.08);
  garage.position.set(3.1, 0.8, -0.2);
  house.add(garage);
  const garageRoof = prism(3.0, 0.9, 2.6, ROOF);
  garageRoof.position.set(3.1, 1.6, -0.2);
  house.add(garageRoof);
  const garageDoor = rbox(1.6, 1.15, 0.06, 0xe8e4dc, 0.02);
  garageDoor.position.set(3.1, 0.6, 1.13);
  house.add(garageDoor);
  for (let i = 0; i < 3; i++) {
    const line = rbox(1.6, 0.03, 0.02, 0xbdb6a8, 0.005);
    line.position.set(3.1, 0.3 + i * 0.3, 1.17);
    house.add(line);
  }

  // Windows (glass gets a warm glow that pulses while we "photograph" it)
  const glassMats: THREE.MeshStandardMaterial[] = [];
  const addWindow = (x: number, y: number, z: number, rotY = 0) => {
    const g = new THREE.Group();
    const frame = rbox(0.9, 1.0, 0.08, TRIM, 0.02);
    g.add(frame);
    const gm = std(0xbfe3f5, 0.25, 0xffe3a0, 0.12);
    glassMats.push(gm);
    const glass = new THREE.Mesh(new RoundedBoxGeometry(0.72, 0.82, 0.06, 2, 0.02), gm);
    glass.position.z = 0.03;
    g.add(glass);
    const bar = rbox(0.72, 0.04, 0.05, TRIM, 0.005);
    bar.position.z = 0.06;
    g.add(bar);
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    house.add(g);
  };
  addWindow(-1.3, 1.25, 1.52);
  addWindow(1.3, 1.25, 1.52);
  addWindow(-2.02, 1.25, 0, -Math.PI / 2);
  addWindow(2.02 - 0.0, 1.25, 0.75, Math.PI / 2);
  addWindow(0, 1.25, -1.52, Math.PI);
  addWindow(3.1, 1.0, -1.52, Math.PI);

  // Door with a hinge so it can swing open
  const doorFrame = rbox(1.05, 1.65, 0.1, TRIM, 0.02);
  doorFrame.position.set(0, 0.83, 1.5);
  house.add(doorFrame);
  const doorwayMat = std(0x3b2a20, 0.9, 0xffc97a, 0);
  const doorway = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.45), doorwayMat);
  doorway.position.set(0, 0.75, 1.55);
  house.add(doorway);
  const doorPivot = new THREE.Group();
  doorPivot.position.set(-0.4, 0, 1.6);
  const doorMesh = rbox(0.8, 1.45, 0.08, TEAL, 0.03);
  doorMesh.position.set(0.4, 0.73, 0);
  doorPivot.add(doorMesh);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), std(GOLD, 0.3));
  knob.position.set(0.7, 0.72, 0.07);
  doorPivot.add(knob);
  house.add(doorPivot);

  // Porch
  const porch = rbox(2.0, 0.14, 1.1, 0xd9d3c7, 0.03);
  porch.position.set(0, 0.07, 2.05);
  house.add(porch);
  const porchRoof = rbox(2.0, 0.1, 1.1, TRIM, 0.03);
  porchRoof.position.set(0, 1.85, 2.05);
  house.add(porchRoof);
  for (const x of [-0.85, 0.85]) {
    const col = cylinder(0.06, 0.06, 1.75, TRIM, 12);
    col.position.set(x, 0.98, 2.5);
    house.add(col);
  }

  // Path + driveway
  const path = rbox(0.8, 0.04, 3.2, 0xe5d8c3, 0.01);
  path.position.set(0, 0.02, 4.0);
  house.add(path);
  const drive = rbox(1.8, 0.04, 3.8, 0xcfc8bc, 0.01);
  drive.position.set(3.1, 0.02, 3.1);
  house.add(drive);

  // Trees, bushes, flowers, fence
  const tree = (x: number, z: number, s: number, round = false) => {
    const g = new THREE.Group();
    const trunk = cylinder(0.12 * s, 0.16 * s, 0.9 * s, 0x8a5a3c, 8);
    trunk.position.y = 0.45 * s;
    g.add(trunk);
    if (round) {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95 * s, 1), std(0x6dbb63, 0.9));
      crown.position.y = 1.5 * s;
      crown.castShadow = true;
      g.add(crown);
    } else {
      const greens = [0x4e9a52, 0x5fae5a, 0x72c065];
      for (let i = 0; i < 3; i++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry((1.0 - i * 0.22) * s, 1.15 * s, 8), std(greens[i], 0.9));
        cone.position.y = (1.05 + i * 0.7) * s;
        cone.castShadow = true;
        g.add(cone);
      }
    }
    g.position.set(x, 0, z);
    island.add(g);
  };
  tree(-3.9, -1.6, 1.1);
  tree(-4.6, 1.7, 0.9, true);
  tree(5.0, -2.6, 1.2);
  tree(4.4, 3.8, 0.8, true);
  tree(-2.4, -3.3, 1.0, true);
  tree(1.6, -3.8, 0.9);

  const bush = (x: number, z: number, r: number, color = 0x5fae5a) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), std(color, 0.95));
    b.scale.y = 0.75;
    b.position.set(x, r * 0.6, z);
    b.castShadow = true;
    house.add(b);
  };
  bush(-1.55, 1.85, 0.34);
  bush(1.55, 1.85, 0.34);
  bush(-2.0, 1.75, 0.26, 0x72c065);
  const flowerColors = [0xf2a1b8, 0xffd166, 0xffffff, 0xb79ce8];
  for (let i = 0; i < 14; i++) {
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), std(flowerColors[i % 4], 0.6));
    f.position.set(i % 2 === 0 ? -0.75 - Math.random() * 0.3 : 0.75 + Math.random() * 0.3, 0.1, 2.9 + (i / 14) * 2.2);
    house.add(f);
  }
  for (let i = -3; i <= 3; i++) {
    const post = rbox(0.1, 0.55, 0.1, TRIM, 0.02);
    post.position.set(i * 0.9, 0.28, 5.05);
    island.add(post);
  }
  for (const y of [0.22, 0.42]) {
    const rail = rbox(6.4, 0.06, 0.05, TRIM, 0.01);
    rail.position.set(0, y, 5.05);
    island.add(rail);
  }

  // Yard sign (pops in during chapter 2)
  const sign = new THREE.Group();
  const post = rbox(0.08, 1.3, 0.08, 0x8a5a3c, 0.01);
  post.position.y = 0.65;
  const arm = rbox(0.8, 0.06, 0.06, 0x8a5a3c, 0.01);
  arm.position.set(0.4, 1.25, 0);
  const board = rbox(0.62, 0.42, 0.04, TRIM, 0.01);
  board.position.set(0.42, 1.0, 0);
  const stripe1 = rbox(0.5, 0.06, 0.05, TEAL, 0.005);
  stripe1.position.set(0.42, 1.08, 0.01);
  const stripe2 = rbox(0.34, 0.05, 0.05, GOLD, 0.005);
  stripe2.position.set(0.42, 0.96, 0.01);
  const stripe3 = rbox(0.42, 0.04, 0.05, 0xd9d3c7, 0.005);
  stripe3.position.set(0.42, 0.87, 0.01);
  sign.add(post, arm, board, stripe1, stripe2, stripe3);
  sign.position.set(-2.4, 0, 4.4);
  sign.rotation.y = 0.35;
  sign.scale.setScalar(0.001);
  island.add(sign);

  // ---- Sparkles (chapter 2: cleaning and prep) ----
  const dot = makeTexture((ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,233,168,0.9)');
    g.addColorStop(1, 'rgba(255,233,168,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, 64, 64);
  const SPARKS = 140;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkBase = new Float32Array(SPARKS * 3);
  for (let i = 0; i < SPARKS; i++) {
    sparkBase[i * 3] = (Math.random() - 0.5) * 9;
    sparkBase[i * 3 + 1] = Math.random() * 3.6;
    sparkBase[i * 3 + 2] = (Math.random() - 0.5) * 7 + 0.5;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({ size: 0.28, map: dot, color: 0xfff1c2, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  island.add(sparks);

  // ---- Floating photos + drone (chapter 3) ----
  const photoFrames: THREE.Group[] = [];
  const photoDraw = (hue: number) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `hsl(${200 + hue}, 70%, 78%)`);
    sky.addColorStop(1, `hsl(${40 + hue}, 80%, 92%)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = `hsl(${105 + hue * 0.3}, 45%, 55%)`;
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 1.0, w * 0.7, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsl(${100 + hue * 0.3}, 40%, 46%)`;
    ctx.beginPath();
    ctx.ellipse(w * 0.85, h * 1.05, w * 0.6, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b9624a';
    ctx.fillRect(w * 0.3, h * 0.5, w * 0.4, h * 0.28);
    ctx.fillStyle = '#3e4c55';
    ctx.beginPath();
    ctx.moveTo(w * 0.26, h * 0.5);
    ctx.lineTo(w * 0.5, h * 0.3);
    ctx.lineTo(w * 0.74, h * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(w * 0.82, h * 0.2, w * 0.07, 0, Math.PI * 2);
    ctx.fill();
  };
  for (let i = 0; i < 4; i++) {
    const g = new THREE.Group();
    const back = rbox(1.75, 1.25, 0.06, TRIM, 0.03);
    const tex = makeTexture(photoDraw(i * 22), 320, 220);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.05), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    pic.position.z = 0.04;
    g.add(back, pic);
    const ang = (i / 4) * Math.PI * 2 + 0.6;
    g.userData = { ang, y: 2.4 + (i % 2) * 1.1 };
    g.scale.setScalar(0.001);
    island.add(g);
    photoFrames.push(g);
  }

  const drone = new THREE.Group();
  const droneBody = rbox(0.5, 0.14, 0.5, 0x2b3a40, 0.05);
  drone.add(droneBody);
  const rotors: THREE.Mesh[] = [];
  for (const [dx, dz] of [[0.32, 0.32], [-0.32, 0.32], [0.32, -0.32], [-0.32, -0.32]]) {
    const arm = rbox(0.34, 0.03, 0.03, 0x2b3a40, 0.005);
    arm.position.set(dx / 2, 0, dz / 2);
    arm.rotation.y = Math.atan2(-dz, dx);
    drone.add(arm);
    const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.015, 20), std(0xdfe8ea, 0.4));
    rotor.position.set(dx, 0.08, dz);
    drone.add(rotor);
    rotors.push(rotor);
  }
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), std(GOLD, 0.3));
  lens.position.set(0, -0.12, 0.15);
  drone.add(lens);
  drone.scale.setScalar(0.001);
  island.add(drone);

  // ---- Network of homes (chapter 4) ----
  const minis: { g: THREE.Group; base: THREE.Vector3; pin: THREE.Mesh; phase: number }[] = [];
  const arcs: THREE.Mesh[] = [];
  const miniColors = [0xd98b6f, 0xe6c07a, 0x9cc3d5, 0xc78bb5, 0x8fc79a, 0xe89c7f];
  const miniSpots: [number, number, number][] = [
    [-15, 1, -6],
    [-12, 3, 9],
    [14, 0, -9],
    [17, 2, 6],
    [2, 1.5, -18],
    [-2, -1, 18],
  ];
  miniSpots.forEach(([x, y, z], i) => {
    const g = new THREE.Group();
    const isle = cylinder(1.8, 1.9, 0.35, GRASS, 24);
    isle.position.y = -0.18;
    g.add(isle);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.6, 20), std(0xa47c5c, 0.95));
    cone.rotation.x = Math.PI;
    cone.position.y = -1.15;
    g.add(cone);
    const b = rbox(1.2, 0.85, 1.0, miniColors[i], 0.05);
    b.position.y = 0.42;
    g.add(b);
    const r = prism(1.5, 0.7, 1.4, ROOF);
    r.position.y = 0.85;
    g.add(r);
    const mt = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.8, 7), std(0x5fae5a, 0.9));
    mt.position.set(0.95, 0.4, -0.6);
    g.add(mt);
    const pin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 8), new THREE.MeshBasicMaterial({ color: GOLD }));
    pin.rotation.x = Math.PI;
    pin.position.y = 2.3;
    g.add(pin);
    g.position.set(x, y, z);
    g.scale.setScalar(0.001);
    world.add(g);
    minis.push({ g, base: new THREE.Vector3(x, y, z), pin, phase: i * 1.3 });

    const start = new THREE.Vector3(0, 4.4, 0);
    const end = new THREE.Vector3(x, y + 2.6, z);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += 5;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.035, 6, false), new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
    world.add(tube);
    arcs.push(tube);
  });

  // ---- Keys (chapter 5) ----
  const keys = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.04, 10, 24), std(GOLD, 0.25));
  const shaft = rbox(0.36, 0.06, 0.06, GOLD, 0.01);
  shaft.position.set(0.3, -0.05, 0);
  const tooth = rbox(0.06, 0.14, 0.06, GOLD, 0.01);
  tooth.position.set(0.42, -0.12, 0);
  keys.add(ring, shaft, tooth);
  keys.position.set(0.1, 1.7, 3.0);
  keys.scale.setScalar(0.001);
  house.add(keys);

  // ---- Soft shadow under the floating island ----
  const blobTex = makeTexture((ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(13,34,38,0.38)');
    g.addColorStop(1, 'rgba(13,34,38,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, 128, 128);
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = -7.5;
  world.add(blob);

  // ---- Camera path: one key per chapter boundary ----
  const posKeys = [
    new THREE.Vector3(9, 6.5, 11),
    new THREE.Vector3(-6.5, 3.4, 8),
    new THREE.Vector3(-9, 4.2, -2),
    new THREE.Vector3(6, 5, -9),
    new THREE.Vector3(0, 13, 17.5),
    new THREE.Vector3(0.5, 1.6, 5.0),
  ];
  const lookKeys = [
    new THREE.Vector3(0, 1.4, 0),
    new THREE.Vector3(0, 1.6, 0.5),
    new THREE.Vector3(0, 1.8, 0),
    new THREE.Vector3(0, 1.6, 0),
    new THREE.Vector3(0, 0.5, -1),
    new THREE.Vector3(0, 1.3, 1.8),
  ];
  const posCurve = new THREE.CatmullRomCurve3(posKeys, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookKeys, false, 'centripetal');
  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  // ---- Sizing / visibility ----
  let aspect = 1;
  const resize = () => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    aspect = w / h;
    camera.aspect = aspect;
    camera.fov = aspect < 0.85 ? 52 : 38;
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
    cur += (getProgress() - cur) * Math.min(1, dt * 5);
    const p = clamp01(cur);

    // Camera
    posCurve.getPoint(p, tmpPos);
    lookCurve.getPoint(p, tmpLook);
    if (aspect < 0.85) tmpPos.multiplyScalar(1.3);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);

    // Floating life
    world.position.y = Math.sin(t * 0.8) * 0.12;
    blob.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);

    // Chapter 2: sparkles + yard sign
    const sp = window4(p, 0.16, 0.26, 0.36, 0.46);
    sparkMat.opacity = sp;
    const pa = sparkGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < SPARKS; i++) {
      pa.setXYZ(i, sparkBase[i * 3], (sparkBase[i * 3 + 1] + t * 0.35 + i * 0.13) % 3.8, sparkBase[i * 3 + 2]);
    }
    pa.needsUpdate = true;
    const signT = ramp(p, 0.28, 0.38);
    sign.scale.setScalar(Math.max(0.001, easeOutBack(signT)));

    // Chapter 3: photos + drone + window glow
    const ph = ramp(p, 0.4, 0.5) * (1 - ramp(p, 0.68, 0.76));
    photoFrames.forEach((g, i) => {
      const a = g.userData.ang + t * 0.25;
      g.position.set(Math.cos(a) * 5.2, g.userData.y + Math.sin(t * 1.2 + i) * 0.15, Math.sin(a) * 5.2);
      g.rotation.y = -a + Math.PI / 2;
      g.scale.setScalar(Math.max(0.001, easeOutBack(ph)));
    });
    const dr = window4(p, 0.4, 0.46, 0.58, 0.64);
    const da = p * Math.PI * 9;
    drone.position.set(Math.cos(da) * 7.4, 4.2 + Math.sin(t * 2) * 0.12, Math.sin(da) * 7.4);
    drone.rotation.y = -da;
    drone.scale.setScalar(Math.max(0.001, dr));
    rotors.forEach((r) => (r.rotation.y = t * 40));
    const flash = window4(p, 0.42, 0.5, 0.56, 0.62) * (0.5 + 0.5 * Math.sin(t * 6));
    glassMats.forEach((m) => (m.emissiveIntensity = 0.12 + flash * 0.9));

    // Chapter 4: network of homes
    const net = ramp(p, 0.6, 0.72);
    minis.forEach((m, i) => {
      m.g.scale.setScalar(Math.max(0.001, easeOutBack(clamp01(net * 1.15 - i * 0.03))));
      m.g.position.y = m.base.y + Math.sin(t * 0.9 + m.phase) * 0.25;
      m.pin.position.y = 2.3 + Math.sin(t * 2.2 + m.phase) * 0.12;
      m.pin.rotation.y = t * 1.5;
    });
    const arcOn = ramp(p, 0.64, 0.76) * (1 - ramp(p, 0.84, 0.9) * 0.6);
    arcs.forEach((a, i) => ((a.material as THREE.MeshBasicMaterial).opacity = arcOn * (0.55 + 0.35 * Math.sin(t * 2 + i))));

    // Chapter 5: door opens, warm light, keys
    const open = ramp(p, 0.86, 0.97);
    doorPivot.rotation.y = -open * 1.65;
    doorwayMat.emissiveIntensity = open * 1.4;
    doorLight.intensity = open * 5;
    const k = ramp(p, 0.9, 0.98);
    keys.scale.setScalar(Math.max(0.001, easeOutBack(k)));
    keys.position.y = 1.7 + Math.sin(t * 2) * 0.06;
    keys.rotation.y = t * 1.4;

    renderer.render(scene, camera);
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
        if (anyMat.map) anyMat.map.dispose();
        mat.dispose();
      }
    });
    dot.dispose();
    blobTex.dispose();
    renderer.dispose();
    if (canvas.parentElement === container) container.removeChild(canvas);
  };

  return { dispose };
}
