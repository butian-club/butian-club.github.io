import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';

type Props = {
  progressRef: React.RefObject<number>;
  className?: string;
};

type Pose = {
  at: number;
  position: [number, number, number];
  target: [number, number, number];
};

const cameraPath: Pose[] = [
  {at: 0, position: [0, 0.5, 19], target: [1.5, 0, -4]},
  {at: 0.14, position: [1.1, 0.8, 14.4], target: [2.2, 0, -4]},
  {at: 0.3, position: [9.2, 2.3, 10.2], target: [6, 0, -4]},
  {at: 0.43, position: [6.5, 0.7, 7.8], target: [6, 0, -4]},
  {at: 0.56, position: [6, 0, 0.2], target: [6, 0, -13]},
  {at: 0.64, position: [6, 0, -8], target: [6, 0, -20]},
  {at: 0.9, position: [6, 0, -8], target: [6, 0, -20]},
  {at: 0.94, position: [6.8, 1, 11], target: [5.8, 0, -4]},
  {at: 1, position: [0, 0.5, 19], target: [1.5, 0, -4]},
];

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smooth(a: number, b: number, value: number): number {
  const x = clamp((value - a) / (b - a));
  return x * x * (3 - 2 * x);
}

function poseAt(progress: number): {position: THREE.Vector3; target: THREE.Vector3} {
  let right = cameraPath.findIndex((pose) => pose.at >= progress);
  if (right < 1) right = 1;
  const first = cameraPath[right - 1];
  const second = cameraPath[right];
  const local = smooth(first.at, second.at, progress);
  return {
    position: new THREE.Vector3(...first.position).lerp(new THREE.Vector3(...second.position), local),
    target: new THREE.Vector3(...first.target).lerp(new THREE.Vector3(...second.target), local),
  };
}

function beam(from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material): THREE.Mesh {
  const delta = to.clone().sub(from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, delta.length(), 8), material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return mesh;
}

function createStation(): {
  group: THREE.Group;
  ring: THREE.Group;
  pods: Array<{group: THREE.Group; angle: number}>;
  solar: THREE.Group[];
} {
  const group = new THREE.Group();
  group.position.set(6, 0, -4);

  const hull = new THREE.MeshStandardMaterial({color: 0xb7c4c9, metalness: 0.88, roughness: 0.28});
  const dark = new THREE.MeshStandardMaterial({color: 0x15242c, metalness: 0.78, roughness: 0.34});
  const copper = new THREE.MeshStandardMaterial({color: 0xe2aa72, metalness: 0.72, roughness: 0.32});
  const glass = new THREE.MeshStandardMaterial({color: 0x78d9e0, emissive: 0x3fa5b2, emissiveIntensity: 1.8, metalness: 0.32, roughness: 0.18});
  const panel = new THREE.MeshStandardMaterial({color: 0x102b43, emissive: 0x12314a, emissiveIntensity: 0.38, metalness: 0.42, roughness: 0.3, side: THREE.DoubleSide});

  const ring = new THREE.Group();
  group.add(ring);
  const outer = new THREE.Mesh(new THREE.TorusGeometry(3.28, 0.12, 12, 128), hull);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(2.92, 0.035, 8, 128), copper);
  ring.add(outer, inner);

  const pods: Array<{group: THREE.Group; angle: number}> = [];
  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    const pod = new THREE.Group();
    pod.position.set(Math.cos(angle) * 3.28, Math.sin(angle) * 3.28, 0);
    pod.rotation.z = angle + Math.PI / 2;
    const shell = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.44, 0.7), index % 3 === 0 ? copper : hull);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.05, 0.76), dark);
    roof.position.y = 0.245;
    pod.add(shell, roof);
    for (let window = -1; window <= 1; window += 1) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.08, 0.016), glass);
      light.position.set(window * 0.25, 0.03, 0.365);
      pod.add(light);
    }
    ring.add(pod);
    pods.push({group: pod, angle});
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    ring.add(beam(
      new THREE.Vector3(Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0),
      new THREE.Vector3(Math.cos(angle) * 2.93, Math.sin(angle) * 2.93, 0),
      0.055,
      index % 2 ? copper : hull,
    ));
  }

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 1.65, 32), hull);
  hub.rotation.x = Math.PI / 2;
  const hubCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.72, 32), dark);
  hubCore.rotation.x = Math.PI / 2;
  const dock = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.075, 10, 48), glass);
  dock.position.z = 0.91;
  ring.add(hub, hubCore, dock);

  for (let index = 0; index < 10; index += 1) {
    const angle = (index / 10) * Math.PI * 2;
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), glass);
    light.position.set(Math.cos(angle) * 3.28, Math.sin(angle) * 3.28, 0.42);
    ring.add(light);
  }

  const solar: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Group();
    wing.position.set(side * 5.05, 0, -0.5);
    group.add(beam(new THREE.Vector3(side * 3.2, 0, -0.4), new THREE.Vector3(side * 4.12, 0, -0.5), 0.045, hull));
    for (const row of [-1, 1]) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.1, 0.045), panel);
      slab.position.set(side * 0.46, row * 0.62, 0);
      wing.add(slab);
      for (let line = -3; line <= 3; line += 1) {
        const grid = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.08, 0.051), hull);
        grid.position.set(side * 0.46 + line * 0.21, row * 0.62, 0.02);
        wing.add(grid);
      }
    }
    group.add(wing);
    solar.push(wing);
  }

  const mast = beam(new THREE.Vector3(0, 3.2, 0), new THREE.Vector3(0, 4.65, 0), 0.035, hull);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), glass);
  beacon.position.set(0, 4.66, 0);
  group.add(mast, beacon);

  return {group, ring, pods, solar};
}

function createStars(): THREE.Points {
  const count = 1300;
  const positions = new Float32Array(count * 3);
  let seed = 17;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - 0.5) * 110;
    positions[index * 3 + 1] = (random() - 0.5) * 70;
    positions[index * 3 + 2] = -15 - random() * 90;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({color: 0xb7dce0, size: 0.085, sizeAttenuation: true, transparent: true, opacity: 0.88}),
  );
}

export default function OrbitalScene({progressRef, className}: Props): React.ReactNode {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'});
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1.3 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);
    mount.dataset.ready = 'true';
    const stage = mount.parentElement?.parentElement;
    if (stage) stage.dataset.webgl = 'ready';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 160);
    const ambient = new THREE.AmbientLight(0xb7d5dd, 0.65);
    const sun = new THREE.DirectionalLight(0xffdec4, 3.4);
    sun.position.set(12, 8, 14);
    const blue = new THREE.DirectionalLight(0x5ccbdc, 2.6);
    blue.position.set(-10, -6, 5);
    scene.add(ambient, sun, blue);

    const stars = createStars();
    scene.add(stars);
    const station = createStation();
    scene.add(station.group);

    const marsMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 1});
    const mars = new THREE.Mesh(new THREE.SphereGeometry(14.2, 72, 48), marsMaterial);
    mars.position.set(11, -9.5, -38);
    mars.rotation.y = 1.8;
    scene.add(mars);

    const auraCanvas = document.createElement('canvas');
    auraCanvas.width = auraCanvas.height = 256;
    const context = auraCanvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(128, 128, 85, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(213,109,66,0)');
      gradient.addColorStop(0.55, 'rgba(201,99,66,.15)');
      gradient.addColorStop(1, 'rgba(213,109,66,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }
    const auraTexture = new THREE.CanvasTexture(auraCanvas);
    const aura = new THREE.Sprite(new THREE.SpriteMaterial({map: auraTexture, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false}));
    aura.position.copy(mars.position);
    aura.scale.set(35, 35, 1);
    scene.add(aura);

    let disposed = false;
    let texture: THREE.Texture | undefined;
    const loader = new THREE.TextureLoader();
    // NASA/JPL-Caltech Mars map: https://science.nasa.gov/3d-resources/mars/
    loader.load('/img/mars-nasa-texture.jpg', (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      texture = loaded;
      loaded.colorSpace = THREE.SRGBColorSpace;
      marsMaterial.map = loaded;
      marsMaterial.bumpMap = loaded;
      marsMaterial.bumpScale = 0.025;
      marsMaterial.needsUpdate = true;
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(mount);

    renderer.setAnimationLoop(() => {
      if (document.hidden || !visible) return;
      const progress = progressRef.current;
      const pose = poseAt(progress);
      camera.position.copy(pose.position);
      camera.lookAt(pose.target);

      const sequence = Math.min(progress, 0.6);
      station.group.rotation.y = -0.63 + smooth(0.1, 0.45, sequence) * 1.02;
      station.group.rotation.x = 0.2 + smooth(0.18, 0.43, sequence) * 0.14;
      station.ring.rotation.z = -0.08 + sequence * 1.65;
      station.solar.forEach((wing, index) => {
        wing.rotation.y = (index ? 1 : -1) * smooth(0.19, 0.42, sequence) * 0.42;
      });
      const explode = smooth(0.245, 0.34, sequence) * (1 - smooth(0.42, 0.51, sequence));
      station.pods.forEach(({group, angle}, index) => {
        const distance = 3.28 + explode * (0.8 + (index % 3) * 0.15);
        group.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, explode * ((index % 2) ? 0.4 : -0.35));
      });
      mars.rotation.y = 1.8 + progress * 0.22;
      stars.rotation.y = progress * 0.08;
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibilityObserver.disconnect();
      mount.removeChild(renderer.domElement);
      if (stage) delete stage.dataset.webgl;
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite)) return;
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      texture?.dispose();
      auraTexture.dispose();
      renderer.dispose();
    };
  }, [progressRef]);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
