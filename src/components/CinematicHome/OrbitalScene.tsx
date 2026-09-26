import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {createStation, poseStation} from './StationModel';
import {createAscentWorld, flightPath, orbitEntryPose, orbitOrigin, type FlightPose} from './AscentWorld';

type Props = {
  progressRef: React.RefObject<number>;
  ascentRef: React.RefObject<number>;
  className?: string;
};

type Pose = FlightPose;

const cameraPath: Pose[] = [
  orbitEntryPose,
  {at: 0.09, position: [1.1, 0.8, 14.4], target: [2.2, 0, -4]},
  {at: 0.2, position: [8.4, 2.7, 14], target: [3.9, 0, -4]},
  {at: 0.285, position: [8.6, 1.8, 12.8], target: [4, 0, -4]},
  {at: 0.34, position: [8.2, 1.1, 11.2], target: [4.3, 0, -4]},
  // The camera approaches only after the large headline leaves the frame.
  {at: 0.39, position: [6.8, 0.8, 7.8], target: [5.7, 0, -4]},
  {at: 0.75, position: [6.8, 0.8, 7.8], target: [5.7, 0, -4]},
  {at: 0.91, position: [6.8, 1, 11], target: [5.8, 0, -4]},
  {at: 0.98, position: [0, 0.5, 19], target: [1.5, 0, -4]},
  {at: 1, position: [0, 0.5, 19], target: [1.5, 0, -4]},
];

function clamp(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smooth(a: number, b: number, value: number): number {
  const x = clamp((value - a) / (b - a));
  return x * x * (3 - 2 * x);
}

function samePose(first: Pose['position'], second: Pose['position']): boolean {
  return first[0] === second[0] && first[1] === second[1] && first[2] === second[2];
}

function interpolatePose(progress: number, field: 'position' | 'target', output: THREE.Vector3, path: Pose[] = cameraPath): void {
  const right = Math.max(1, path.findIndex((pose) => pose.at >= progress));
  const a = path[right - 1];
  const b = path[right];
  if (samePose(a[field], b[field])) {
    output.set(...a[field]);
    return;
  }
  const previous = path[Math.max(0, right - 2)];
  const next = path[Math.min(path.length - 1, right + 1)];
  const enteringHold = samePose(previous[field], a[field]);
  const leavingHold = samePose(b[field], next[field]);
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
    const entrySlope = enteringHold ? 0 : (b[field][axis] - previous[field][axis]) / (b.at - previous.at);
    const exitSlope = leavingHold ? 0 : (next[field][axis] - a[field][axis]) / (next.at - a.at);
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

export default function OrbitalScene({progressRef, ascentRef, className}: Props): React.ReactNode {
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
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.visibility = 'hidden';
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
    scene.environmentIntensity = 0.62;
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 1000);
    const dockCamera = new THREE.PerspectiveCamera(39, 1, 0.1, 1000);
    const ambient = new THREE.AmbientLight(0x9fb7c1, 0.58);
    const sun = new THREE.DirectionalLight(0xffd0aa, 2.7);
    sun.position.set(12, 8, 14);
    const blue = new THREE.DirectionalLight(0x67b9cc, 1.55);
    blue.position.set(-10, -6, 5);
    scene.add(ambient, sun, blue);

    const orbitGroup = new THREE.Group();
    orbitGroup.position.copy(orbitOrigin);
    scene.add(orbitGroup);
    const stars = createStars();
    orbitGroup.add(stars);
    const station = createStation();
    orbitGroup.add(station.group);

    const marsMaterial = new THREE.MeshStandardMaterial({color: 0xb1765b, roughness: 1, transparent: true, opacity: 0, depthWrite: false});
    const mars = new THREE.Mesh(new THREE.SphereGeometry(14.2, 72, 48), marsMaterial);
    mars.position.set(11, -9.5, -38);
    mars.rotation.y = 1.8;
    orbitGroup.add(mars);

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
    orbitGroup.add(aura);

    let disposed = false;
    let needsRender = true;
    let texture: THREE.Texture | undefined;
    const loader = new THREE.TextureLoader();
    const ascentWorld = createAscentWorld(scene, loader, (url) => {
      needsRender = true;
      if (url.endsWith('hangzhou-no2-campus.webp')) renderer.domElement.style.visibility = 'visible';
    });
    // NASA/JPL-Caltech Mars map: https://science.nasa.gov/3d-resources/mars/
    loader.load('/img/mars-nasa-texture.jpg', (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      texture = loaded;
      loaded.colorSpace = THREE.SRGBColorSpace;
      marsMaterial.color.setHex(0xcfab9a);
      marsMaterial.map = loaded;
      marsMaterial.bumpMap = loaded;
      marsMaterial.bumpScale = 0.025;
      marsMaterial.needsUpdate = true;
      needsRender = true;
    });

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.fov = width < 600 ? 60 : 39;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dockCamera.fov = camera.fov;
      dockCamera.aspect = camera.aspect;
      dockCamera.updateProjectionMatrix();
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
    let lastAscent = -1;
    const lookTarget = new THREE.Vector3();
    const dockLookTarget = new THREE.Vector3();
    const dockPoint = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      if (document.hidden || !visible) return;
      const progress = progressRef.current;
      const ascent = ascentRef.current;
      const escape = 80 * smooth(0, 0.16, progress);
      orbitGroup.position.set(orbitOrigin.x, orbitOrigin.y + escape, orbitOrigin.z);
      if (!needsRender && Math.abs(progress - lastProgress) < 0.00001 && Math.abs(ascent - lastAscent) < 0.00001) return;
      if (ascent < 1) {
        interpolatePose(ascent, 'position', camera.position, flightPath);
        interpolatePose(ascent, 'target', lookTarget, flightPath);
      } else {
        interpolatePose(progress, 'position', camera.position);
        interpolatePose(progress, 'target', lookTarget);
        camera.position.add(orbitOrigin);
        camera.position.y += escape;
        lookTarget.add(orbitOrigin);
        lookTarget.y += escape;
      }
      const isMobile = mount.clientWidth < 600;
      const mobileLift = isMobile && ascent >= 1 ? 2.8 * smooth(0.08, 0.2, progress) : 0;
      const mobileReveal = isMobile && ascent >= 1
        ? smooth(0.24, 0.31, progress) * (1 - smooth(0.345, 0.41, progress))
        : 0;
      const mobilePan = 4 * mobileReveal;
      const fieldOfView = ascent < 1
        ? (isMobile ? 72 - 12 * ascent : 48 - 9 * ascent)
        : (isMobile ? 60 + 12 * mobileReveal : 39);
      if (Math.abs(camera.fov - fieldOfView) > 0.01) {
        camera.fov = fieldOfView;
        camera.updateProjectionMatrix();
        dockCamera.fov = fieldOfView;
        dockCamera.updateProjectionMatrix();
      }
      lookTarget.y += mobileLift;
      lookTarget.x += mobilePan;
      camera.lookAt(lookTarget);
      ascentWorld.update(ascent, progress, camera, isMobile);

      poseStation(station, progress);
      orbitGroup.visible = ascent > 0.78;
      marsMaterial.opacity = smooth(0.085, 0.16, progress);
      mars.visible = marsMaterial.opacity > 0.005;
      aura.visible = mars.visible;
      (stars.material as THREE.PointsMaterial).opacity = 0.88 * smooth(0.74, 1, ascent);
      if (stage) {
        const dockProgress = Math.min(progress, 0.56);
        interpolatePose(dockProgress, 'position', dockCamera.position);
        interpolatePose(dockProgress, 'target', dockLookTarget);
        dockCamera.position.add(orbitOrigin);
        dockCamera.position.y += escape;
        dockLookTarget.add(orbitOrigin);
        dockLookTarget.y += escape;
        dockLookTarget.y += mobileLift;
        dockLookTarget.x += mobilePan;
        dockCamera.lookAt(dockLookTarget);
        dockCamera.updateMatrixWorld();
        station.group.updateWorldMatrix(true, false);
        dockPoint.set(0, 0, 1.26).applyMatrix4(station.group.matrixWorld).project(dockCamera);
        stage.style.setProperty('--dock-x', `${((dockPoint.x + 1) * 50).toFixed(2)}%`);
        stage.style.setProperty('--dock-y', `${((1 - dockPoint.y) * 50).toFixed(2)}%`);
      }
      mars.rotation.y = 1.8 + progress * 0.22;
      stars.rotation.y = progress * 0.08;
      renderer.render(scene, camera);
      lastProgress = progress;
      lastAscent = ascent;
      needsRender = false;
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      visibilityObserver.disconnect();
      mount.removeChild(renderer.domElement);
      if (stage) {
        delete stage.dataset.webgl;
        stage.style.removeProperty('--dock-x');
        stage.style.removeProperty('--dock-y');
      }
      ascentWorld.dispose();
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
  }, [progressRef, ascentRef]);

  return <div className={className} ref={mountRef} aria-hidden="true" />;
}
