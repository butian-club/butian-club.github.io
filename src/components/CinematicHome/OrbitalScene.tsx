import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createStation} from './StationModel';

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

function interpolatePose(progress: number, field: 'position' | 'target', output: THREE.Vector3): void {
  const right = Math.max(1, cameraPath.findIndex((pose) => pose.at >= progress));
  const a = cameraPath[right - 1];
  const b = cameraPath[right];
  const previous = cameraPath[Math.max(0, right - 2)];
  const next = cameraPath[Math.min(cameraPath.length - 1, right + 1)];
  const span = b.at - a.at;
  const t = clamp((progress - a.at) / span);
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  const result: number[] = [];
  for (let axis = 0; axis < 3; axis += 1) {
    const entrySlope = (b[field][axis] - previous[field][axis]) / (b.at - previous.at);
    const exitSlope = (next[field][axis] - a[field][axis]) / (next.at - a.at);
    result[axis] = h00 * a[field][axis] + h10 * span * entrySlope
      + h01 * b[field][axis] + h11 * span * exitSlope;
  }
  output.set(result[0], result[1], result[2]);
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
    renderer.toneMappingExposure = 1.17;
    mount.appendChild(renderer.domElement);
    mount.dataset.ready = 'true';
    const stage = mount.parentElement?.parentElement;
    if (stage) stage.dataset.webgl = 'ready';

    const scene = new THREE.Scene();
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.04);
    room.dispose();
    pmrem.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.52;
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 160);
    const ambient = new THREE.AmbientLight(0xb7d5dd, 0.52);
    const sun = new THREE.DirectionalLight(0xffdec4, 2.9);
    sun.position.set(12, 8, 14);
    const blue = new THREE.DirectionalLight(0x5ccbdc, 1.75);
    blue.position.set(-10, -6, 5);
    scene.add(ambient, sun, blue);

    const stars = createStars();
    scene.add(stars);
    const station = createStation();
    scene.add(station.group);

    const marsMaterial = new THREE.MeshStandardMaterial({color: 0xb47b57, roughness: 1});
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
    let needsRender = true;
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
      marsMaterial.color.setHex(0xffffff);
      marsMaterial.map = loaded;
      marsMaterial.bumpMap = loaded;
      marsMaterial.bumpScale = 0.014;
      marsMaterial.needsUpdate = true;
      needsRender = true;
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      needsRender = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();
    let visible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      needsRender = true;
    });
    visibilityObserver.observe(mount);

    let lastProgress = -1;
    const lookTarget = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      if (document.hidden || !visible) return;
      const progress = progressRef.current;
      if (!needsRender && Math.abs(progress - lastProgress) < 0.00001) return;
      interpolatePose(progress, 'position', camera.position);
      interpolatePose(progress, 'target', lookTarget);
      camera.lookAt(lookTarget);

      const sequence = Math.min(progress, 0.6);
      station.group.rotation.y = -0.63 + smooth(0.1, 0.45, sequence) * 1.02;
      station.group.rotation.x = 0.2 + smooth(0.18, 0.43, sequence) * 0.14;
      station.ring.rotation.z = -0.08 + sequence * 1.65;
      station.solar.forEach((wing, index) => {
        wing.rotation.y = (index ? 1 : -1) * smooth(0.19, 0.42, sequence) * 0.42;
      });
      const explode = smooth(0.245, 0.34, sequence) * (1 - smooth(0.42, 0.51, sequence));
      station.pods.forEach(({group, angle}, index) => {
        const distance = explode * (1.1 + (index % 3) * 0.2);
        group.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, explode * (index % 2 ? 0.36 : -0.36));
        group.rotation.y = explode * (index % 2 ? 0.19 : -0.19);
      });
      mars.rotation.y = 1.8 + progress * 0.22;
      stars.rotation.y = progress * 0.08;
      renderer.render(scene, camera);
      lastProgress = progress;
      needsRender = false;
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibilityObserver.disconnect();
      mount.removeChild(renderer.domElement);
      if (stage) delete stage.dataset.webgl;
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.Sprite)) return;
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) geometries.add(object.geometry);
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      station.textures.forEach((stationTexture) => stationTexture.dispose());
      texture?.dispose();
      auraTexture.dispose();
      environment.dispose();
      renderer.dispose();
    };
  }, [progressRef]);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
