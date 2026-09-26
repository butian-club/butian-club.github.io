import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export type StationModel = {
  group: THREE.Group;
  ring: THREE.Group;
  pressureHull: THREE.Mesh;
  shellFaces: [THREE.BufferGeometry, THREE.BufferGeometry];
  outerWall: THREE.BufferGeometry;
  pods: Array<{group: THREE.Group; angle: number; slides: THREE.Mesh[]; collars: THREE.Group}>;
  solar: Array<{
    wing: THREE.Group;
    leaves: Array<{hinge: THREE.Group; row: number; socket: THREE.Mesh}>;
    braces: Array<{mesh: THREE.Mesh; row: number}>;
    side: number;
  }>;
  dockingLocks: Array<{group: THREE.Group; angle: number}>;
  textures: THREE.Texture[];
};

// Every strut uses the same unit geometry; only its transform changes.
const beamGeometry = new THREE.CylinderGeometry(1, 1, 1, 8);

function beam(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(beamGeometry, material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.scale.set(radius, direction.length(), radius);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function consolidatePod(pod: THREE.Group): void {
  const byMaterial = new Map<THREE.Material, THREE.Mesh[]>();
  for (const child of pod.children) {
    if (!(child instanceof THREE.Mesh) || Array.isArray(child.material)) continue;
    const meshes = byMaterial.get(child.material) ?? [];
    meshes.push(child);
    byMaterial.set(child.material, meshes);
  }
  for (const [material, meshes] of byMaterial) {
    if (meshes.length < 2) continue;
    const geometries = meshes.map((mesh) => {
      mesh.updateMatrix();
      const geometry = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      return geometry.applyMatrix4(mesh.matrix);
    });
    const merged = mergeGeometries(geometries, false);
    geometries.forEach((geometry) => geometry.dispose());
    if (!merged) continue;
    meshes.forEach((mesh) => pod.remove(mesh));
    pod.add(new THREE.Mesh(merged, material));
  }
}

function solarCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#081726';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const columns = 12;
    const rows = 8;
    const gap = 5;
    const cellWidth = (canvas.width - gap * (columns + 1)) / columns;
    const cellHeight = (canvas.height - gap * (rows + 1)) / rows;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = gap + column * (cellWidth + gap);
        const y = gap + row * (cellHeight + gap);
        const gradient = context.createLinearGradient(x, y, x + cellWidth, y + cellHeight);
        gradient.addColorStop(0, '#2a6078');
        gradient.addColorStop(0.42, '#173d57');
        gradient.addColorStop(1, '#0c243d');
        context.fillStyle = gradient;
        context.fillRect(x, y, cellWidth, cellHeight);
        context.fillStyle = 'rgba(190,226,231,.13)';
        context.fillRect(x + 2, y + 2, cellWidth - 4, 2);
        context.fillStyle = 'rgba(225,184,121,.28)';
        context.fillRect(x + cellWidth - 3, y + 3, 1, cellHeight - 6);
      }
    }
    context.fillStyle = 'rgba(230,241,235,.18)';
    context.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function habitatFaceGeometry(count: number, z: number): THREE.ExtrudeGeometry {
  const half = Math.PI / count;
  const gap = 0.023;
  const outer = 3.58;
  const inner = 2.98;
  const shape = new THREE.Shape();
  shape.absarc(0, 0, outer, -half + gap, half - gap, false);
  shape.lineTo(inner * Math.cos(half - gap), inner * Math.sin(half - gap));
  shape.absarc(0, 0, inner, half - gap, -half + gap, true);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.055,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.007,
    bevelSize: 0.01,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geometry.translate(0, 0, z - 0.0275);
  return geometry;
}

export function createStation(): StationModel {
  const group = new THREE.Group();
  group.position.set(6, 0, -4);

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0xc0cecc, metalness: 0.4, roughness: 0.35, envMapIntensity: 1.05,
    clearcoat: 0.25, clearcoatRoughness: 0.3,
  });
  const armor = new THREE.MeshPhysicalMaterial({
    color: 0xe2e8e2, metalness: 0.24, roughness: 0.43, envMapIntensity: 0.92,
    clearcoat: 0.18, clearcoatRoughness: 0.36,
  });
  const titanium = new THREE.MeshPhysicalMaterial({
    color: 0x849fa4, metalness: 0.76, roughness: 0.29, envMapIntensity: 1.25,
    clearcoat: 0.18, clearcoatRoughness: 0.27,
  });
  const carbon = new THREE.MeshStandardMaterial({
    color: 0x14242c, metalness: 0.48, roughness: 0.43, envMapIntensity: 0.75,
  });
  const pressureMetal = new THREE.MeshStandardMaterial({
    color: 0x2a3a42, metalness: 0.63, roughness: 0.37, envMapIntensity: 1.05,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb28567, metalness: 0.82, roughness: 0.32, envMapIntensity: 1.2,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0x80bfc5,
    emissive: 0x2a7782,
    emissiveIntensity: 0.68,
    metalness: 0.16,
    roughness: 0.31,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x31535d, metalness: 0.45, roughness: 0.13,
    clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.65,
    emissive: 0x336773, emissiveIntensity: 0.36,
  });
  const solarTexture = solarCellTexture();
  const solarCells = new THREE.MeshStandardMaterial({
    map: solarTexture, color: 0xffffff, metalness: 0.4, roughness: 0.31,
  });

  const ring = new THREE.Group();
  group.add(ring);
  // The pressurized tube is continuous; removable cladding is a thin shell
  // outside it, so the two solids never sweep through one another.
  const pressureHull = new THREE.Mesh(new THREE.TorusGeometry(3.29, 0.27, 14, 160), pressureMetal);
  pressureHull.position.z = -0.1;
  ring.add(pressureHull);
  for (const [radius, tube, z, material] of [
    [2.95, 0.06, 0.35, titanium],
    [2.95, 0.06, -0.45, copper],
    [2.92, 0.009, 0.385, light],
  ] as Array<[number, number, number, THREE.Material]>) {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 144), material);
    rail.position.z = z;
    ring.add(rail);
  }
  const clampGeometry = new THREE.TorusGeometry(0.27, 0.013, 6, 32);
  const clampNormal = new THREE.Vector3(0, 0, 1);
  for (let index = 0; index < 16; index += 1) {
    const angle = (index + 0.5) * Math.PI / 8;
    const clamp = new THREE.Mesh(clampGeometry, index % 4 === 0 ? copper : titanium);
    clamp.position.set(Math.cos(angle) * 3.29, Math.sin(angle) * 3.29, -0.1);
    clamp.quaternion.setFromUnitVectors(clampNormal, new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0));
    ring.add(clamp);
  }

  const podFrontGeometry = habitatFaceGeometry(16, 0.345);
  const podRearGeometry = habitatFaceGeometry(16, -0.445);
  // CylinderGeometry's local azimuth of +90° points along the pod's +X axis
  // after its axis is turned toward Z.
  const podOuterWallGeometry = new THREE.CylinderGeometry(
    3.59, 3.59, 0.79, 16, 1, true,
    Math.PI / 2 - Math.PI / 16 + 0.023,
    Math.PI / 8 - 0.046,
  );
  podOuterWallGeometry.rotateX(Math.PI / 2);
  podOuterWallGeometry.translate(0, 0, -0.05);
  const podRailGeometry = new THREE.TorusGeometry(3.61, 0.044, 8, 12, Math.PI / 8 - 0.046);
  const frontPanel = new RoundedBoxGeometry(0.28, 0.77, 0.055, 2, 0.025);
  const panelBezel = new RoundedBoxGeometry(0.36, 0.84, 0.025, 2, 0.024);
  const windowFrame = new RoundedBoxGeometry(0.22, 0.16, 0.032, 2, 0.023);
  const windowGlass = new RoundedBoxGeometry(0.17, 0.115, 0.014, 2, 0.018);
  const armorStrip = new RoundedBoxGeometry(0.09, 0.62, 0.035, 2, 0.014);
  const hatch = new RoundedBoxGeometry(0.1, 0.1, 0.026, 2, 0.018);
  const hatchMarkGeometry = new THREE.BoxGeometry(0.055, 0.009, 0.009);
  const seamGeometry = new THREE.BoxGeometry(0.26, 0.012, 0.012);
  const serviceRibGeometry = new RoundedBoxGeometry(0.12, 0.59, 0.04, 2, 0.018);
  const ventGeometry = new RoundedBoxGeometry(0.15, 0.36, 0.038, 2, 0.015);
  const ventSlat = new THREE.BoxGeometry(0.12, 0.012, 0.012);
  const aftFrameGeometry = new RoundedBoxGeometry(0.3, 0.66, 0.025, 2, 0.025);
  const aftInsetGeometry = new RoundedBoxGeometry(0.255, 0.61, 0.025, 2, 0.02);
  const aftLouverGeometry = new THREE.BoxGeometry(0.2, 0.018, 0.012);
  const rivetGeometry = new THREE.SphereGeometry(0.016, 6, 6);
  const boundaryGeometry = new THREE.CylinderGeometry(0.067, 0.067, 0.075, 12);
  const boundaryCapGeometry = new THREE.CylinderGeometry(0.039, 0.039, 0.081, 12);
  const pods: StationModel['pods'] = [];
  for (let index = 0; index < 16; index += 1) {
    const angle = (index / 16) * Math.PI * 2;
    const pod = new THREE.Group();
    pod.rotation.z = angle;
    const shellMaterial = index % 8 === 0 ? titanium : ceramic;
    pod.add(
      new THREE.Mesh(podFrontGeometry, shellMaterial),
      new THREE.Mesh(podRearGeometry, shellMaterial),
      new THREE.Mesh(podOuterWallGeometry, shellMaterial),
    );
    for (const z of [0.365, -0.445]) {
      const rail = new THREE.Mesh(podRailGeometry, titanium);
      rail.rotation.z = -Math.PI / 16 + 0.023;
      rail.position.z = z;
      pod.add(rail);
    }

    const bezel = new THREE.Mesh(panelBezel, titanium);
    bezel.position.set(3.29, 0, 0.39);
    pod.add(bezel);
    const inset = new THREE.Mesh(frontPanel, carbon);
    inset.position.set(3.29, 0, 0.429);
    pod.add(inset);
    for (const radius of [3.05, 3.53]) {
      const plate = new THREE.Mesh(armorStrip, armor);
      plate.position.set(radius, 0, 0.393);
      pod.add(plate);
    }
    for (const offset of [-0.235, 0, 0.235]) {
      const frame = new THREE.Mesh(windowFrame, titanium);
      frame.position.set(3.31, offset, 0.468);
      const glazing = new THREE.Mesh(windowGlass, glass);
      glazing.position.set(3.31, offset, 0.49);
      pod.add(frame, glazing);
    }
    for (const offset of [-0.34, 0.34]) {
      const seam = new THREE.Mesh(seamGeometry, copper);
      seam.position.set(3.29, offset, 0.456);
      pod.add(seam);
      for (const radial of [3.07, 3.51]) {
        const rivet = new THREE.Mesh(rivetGeometry, titanium);
        rivet.position.set(radial, offset, 0.396);
        pod.add(rivet);
      }
    }
    const serviceHatch = new THREE.Mesh(hatch, carbon);
    serviceHatch.position.set(3.52, 0, 0.414);
    pod.add(serviceHatch);
    const hatchMark = new THREE.Mesh(hatchMarkGeometry, index % 4 === 0 ? light : copper);
    hatchMark.position.set(3.52, 0, 0.427);
    pod.add(hatchMark);

    for (const offset of [-0.44, 0.44]) {
      pod.add(beam(
        new THREE.Vector3(3.0, offset, 0.394),
        new THREE.Vector3(3.56, offset, 0.394),
        0.018,
        index % 4 === 0 ? copper : titanium,
      ));
    }
    const aftFrame = new THREE.Mesh(aftFrameGeometry, titanium);
    aftFrame.position.set(3.2, 0, -0.49);
    const aftInset = new THREE.Mesh(aftInsetGeometry, carbon);
    aftInset.position.set(3.2, 0, -0.512);
    pod.add(aftFrame, aftInset);
    for (const offset of [-0.23, -0.11, 0.01, 0.13, 0.25]) {
      const louver = new THREE.Mesh(aftLouverGeometry, index % 4 === 0 && offset === 0.01 ? light : copper);
      louver.position.set(3.2, offset, -0.529);
      pod.add(louver);
    }
    for (const side of [-1, 1]) {
      const serviceRib = new THREE.Mesh(
        serviceRibGeometry,
        index % 4 === 0 ? copper : titanium,
      );
      serviceRib.position.set(3.52, side * 0.23, -0.49);
      pod.add(serviceRib);
    }
    const vent = new THREE.Mesh(ventGeometry, carbon);
    vent.position.set(3.48, 0, -0.49);
    pod.add(vent);
    for (const offset of [-0.12, -0.06, 0, 0.06, 0.12]) {
      const slat = new THREE.Mesh(ventSlat, titanium);
      slat.position.set(3.48, offset, -0.513);
      pod.add(slat);
    }
    consolidatePod(pod);
    ring.add(pod);

    // Both slides run outside the pressure envelope and end at visible
    // brackets on the front and rear cladding faces.
    const slideMount = new THREE.Group();
    slideMount.rotation.z = angle;
    const slides: THREE.Mesh[] = [];
    const collars = new THREE.Group();
    const collarGeometry = new THREE.CylinderGeometry(0.067, 0.067, 0.062, 12);
    for (const [z, faceZ] of [[-0.53, -0.445], [0.25, 0.345]]) {
      const sleeve = new THREE.Mesh(beamGeometry, carbon);
      sleeve.rotation.z = -Math.PI / 2;
      sleeve.position.set(2.97, 0, z);
      sleeve.scale.set(0.039, 0.28, 0.039);
      slideMount.add(sleeve);
      const slide = new THREE.Mesh(beamGeometry, titanium);
      slide.rotation.z = -Math.PI / 2;
      slide.position.z = z;
      slide.scale.set(0.027, 0.29, 0.027);
      slideMount.add(slide);
      slides.push(slide);
      slideMount.add(beam(
        new THREE.Vector3(2.96, 0, z),
        new THREE.Vector3(2.96, 0, faceZ),
        0.052,
        titanium,
      ));
      collars.add(beam(
        new THREE.Vector3(0, 0, z),
        new THREE.Vector3(0, 0, faceZ),
        0.045,
        titanium,
      ));
      const collar = new THREE.Mesh(collarGeometry, index % 4 === 0 ? copper : titanium);
      collar.rotation.z = -Math.PI / 2;
      collar.position.z = z;
      collars.add(collar);
    }
    slideMount.add(collars);
    ring.add(slideMount);
    pods.push({group: pod, angle, slides, collars});

    const jointAngle = Math.PI / 16;
    const joint = new THREE.Group();
    joint.position.set(Math.cos(jointAngle) * 3.6, Math.sin(jointAngle) * 3.6, 0.42);
    const jointBase = new THREE.Mesh(boundaryGeometry, carbon);
    jointBase.rotation.x = Math.PI / 2;
    const jointCap = new THREE.Mesh(boundaryCapGeometry, index % 4 === 0 ? light : copper);
    jointCap.rotation.x = Math.PI / 2;
    jointCap.position.z = 0.04;
    joint.add(jointBase, jointCap);
    pod.add(joint);
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const radial = (distance: number, z: number) =>
      new THREE.Vector3(Math.cos(angle) * distance, Math.sin(angle) * distance, z);
    const nextAngle = angle + Math.PI / 4;
    const adjacent = (distance: number, z: number) =>
      new THREE.Vector3(Math.cos(nextAngle) * distance, Math.sin(nextAngle) * distance, z);
    ring.add(
      beam(radial(0.82, 0), radial(3.29, -0.1), 0.054, index % 4 === 0 ? copper : titanium),
      beam(radial(0.83, 0.22), radial(2.88, 0.4), 0.041, index % 4 === 0 ? copper : titanium),
      beam(radial(0.83, -0.22), radial(2.88, -0.41), 0.034, titanium),
      beam(radial(1.65, 0.25), adjacent(2.79, 0.39), 0.014, titanium),
      beam(adjacent(1.65, -0.25), radial(2.79, -0.39), 0.014, titanium),
      beam(radial(2.42, 0.38), adjacent(2.42, 0.38), 0.018, carbon),
    );
  }

  // Keep the rear race forward of the fixed solar truss's swept plane.
  for (const [radius, tube, z, material] of [
    [2.43, 0.046, -0.66, titanium],
    [2.43, 0.014, -0.714, copper],
  ] as Array<[number, number, number, THREE.Material]>) {
    const race = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 120), material);
    race.position.z = z;
    ring.add(race);
  }
  const serviceNodeGeometry = new RoundedBoxGeometry(0.26, 0.22, 0.14, 2, 0.025);
  for (let index = 0; index < 8; index += 1) {
    const angle = index * Math.PI / 4;
    const x = Math.cos(angle) * 2.43;
    const y = Math.sin(angle) * 2.43;
    ring.add(beam(
      new THREE.Vector3(x, y, -0.36),
      new THREE.Vector3(x, y, -0.66),
      0.031,
      titanium,
    ));
    const node = new THREE.Mesh(serviceNodeGeometry, index % 2 === 0 ? copper : carbon);
    node.position.set(x, y, -0.68);
    node.rotation.z = angle;
    ring.add(node);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), light);
    marker.position.set(x, y, -0.77);
    ring.add(marker);
  }

  const hub = new THREE.Group();
  group.add(hub);
  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.79, 0.79, 2.4, 48, 1, true),
    titanium,
  );
  hull.rotation.x = Math.PI / 2;
  hub.add(hull);
  const hubArmorGeometry = new THREE.CylinderGeometry(0.835, 0.835, 0.63, 48, 1, true, 0.075, Math.PI / 3 - 0.15);
  for (let index = 0; index < 6; index += 1) {
    const panel = new THREE.Mesh(hubArmorGeometry, index % 3 === 0 ? ceramic : armor);
    panel.rotation.set(Math.PI / 2, 0, index * Math.PI / 3);
    panel.position.z = -0.23;
    hub.add(panel);
  }
  for (let index = 0; index < 8; index += 1) {
    const angle = index * Math.PI / 4;
    const position = (radius: number, z: number) =>
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
    hub.add(beam(position(0.82, -1.07), position(0.82, 0.99), 0.018, index % 2 ? carbon : copper));
    for (const z of [-0.94, 0.84]) {
      const fitting = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), titanium);
      fitting.position.copy(position(0.84, z));
      hub.add(fitting);
    }
  }
  for (const z of [-1.12, -0.57, 0.13, 0.76, 1.2]) {
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(z === 1.2 ? 0.77 : 0.8, z === 1.2 ? 0.09 : 0.037, 10, 64),
      z === 1.2 ? copper : carbon,
    );
    collar.position.z = z;
    hub.add(collar);
  }
  const dockingOuter = new THREE.Mesh(new THREE.TorusGeometry(0.91, 0.045, 8, 64), ceramic);
  dockingOuter.position.z = 1.16;
  hub.add(dockingOuter);
  const dockingSeat = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.09, 12, 64), pressureMetal);
  dockingSeat.position.z = 1.24;
  hub.add(dockingSeat);
  const dockingFace = new THREE.Mesh(new THREE.RingGeometry(0.44, 0.79, 64), carbon);
  dockingFace.position.z = 1.195;
  hub.add(dockingFace);
  const dockingInner = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.024, 8, 64), carbon);
  dockingInner.position.z = 1.31;
  hub.add(dockingInner);
  const dockingBezel = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.075, 12, 64), light);
  dockingBezel.position.z = 1.26;
  hub.add(dockingBezel);
  const lockTrackRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.025, 8, 64), pressureMetal);
  lockTrackRing.position.z = 1.33;
  hub.add(lockTrackRing);
  const dockingLocks: StationModel['dockingLocks'] = [];
  const lockGeometry = new RoundedBoxGeometry(0.15, 0.075, 0.075, 2, 0.018);
  for (let index = 0; index < 8; index += 1) {
    const angle = index * Math.PI / 4;
    const guide = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.19, 0.025, 2, 0.012), carbon);
    guide.position.set(Math.cos(angle) * 0.66, Math.sin(angle) * 0.66, 1.338);
    guide.rotation.z = angle;
    hub.add(guide);
    const lock = new THREE.Group();
    lock.rotation.z = angle;
    lock.position.set(Math.cos(angle) * 0.66, Math.sin(angle) * 0.66, 1.372);
    lock.add(new THREE.Mesh(lockGeometry, index % 2 ? titanium : copper));
    const lockMark = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.012, 0.009), light);
    lockMark.position.z = 0.043;
    lock.add(lockMark);
    hub.add(lock);
    dockingLocks.push({group: lock, angle});
  }
  for (const z of [0.96, 0.55, 0.12, -0.35]) {
    const baffle = new THREE.Mesh(new THREE.TorusGeometry(0.49, 0.018, 8, 48), copper);
    baffle.position.z = z;
    hub.add(baffle);
  }
  const innerTunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2.45, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x07131c, metalness: 0.48, roughness: 0.29, side: THREE.BackSide,
    }),
  );
  innerTunnel.rotation.x = Math.PI / 2;
  hub.add(innerTunnel);
  for (let index = 0; index < 8; index += 1) {
    const angle = index * Math.PI / 4;
    const radius = 0.486;
    hub.add(beam(
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -1.08),
      new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 1.05),
      0.005,
      index % 2 === 0 ? light : copper,
    ));
  }
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const portLight = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.03), light);
    portLight.position.set(Math.cos(angle) * 0.64, Math.sin(angle) * 0.64, 1.31);
    portLight.rotation.z = angle;
    hub.add(portLight);
    const latch = new THREE.Mesh(new RoundedBoxGeometry(0.13, 0.055, 0.14, 2, 0.018), titanium);
    latch.position.set(Math.cos(angle) * 0.55, Math.sin(angle) * 0.55, 1.34);
    latch.rotation.z = angle;
    hub.add(latch);
    const latchPin = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), copper);
    latchPin.position.set(Math.cos(angle) * 0.56, Math.sin(angle) * 0.56, 1.43);
    hub.add(latchPin);
  }

  const solar: StationModel['solar'] = [];
  for (const side of [-1, 1]) {
    // The array pivots at its bearing. A stationary rear truss carries it from
    // the central hub, clear of the rotating habitat ring.
    for (const y of [-0.16, 0.16]) {
      group.add(beam(
        new THREE.Vector3(side * 0.78, y, -0.98),
        new THREE.Vector3(side * 4.62, y, -0.98),
        0.032,
        titanium,
      ));
    }
    for (let index = 0; index < 5; index += 1) {
      const near = side * (0.9 + index * 0.72);
      const far = side * (1.62 + index * 0.72);
      group.add(beam(
        new THREE.Vector3(near, -0.16, -0.98),
        new THREE.Vector3(far, 0.16, -0.98),
        0.014,
        carbon,
      ));
    }
    group.add(beam(
      new THREE.Vector3(side * 4.62, 0, -0.98),
      new THREE.Vector3(side * 4.62, 0, -0.57),
      0.075,
      titanium,
    ));
    const bearing = new THREE.Group();
    bearing.position.set(side * 4.62, 0, -0.57);
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.6, 16), carbon);
    bearing.add(axle);
    for (const y of [-0.28, 0.28]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.08, 20), titanium);
      cap.position.y = y;
      bearing.add(cap);
    }
    group.add(bearing);

    const wing = new THREE.Group();
    wing.position.set(side * 4.62, 0, -0.57);
    group.add(wing);
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.42, 20), carbon);
    wing.add(hinge);
    const hingeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.44, 20), copper);
    wing.add(hingeCap);

    const leaves: StationModel['solar'][number]['leaves'] = [];
    const braces: StationModel['solar'][number]['braces'] = [];
    for (const row of [-1, 1]) {
      const hinge = new THREE.Group();
      hinge.position.set(side * 0.81, row * 0.09, 0);
      const hingePin = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.66, 12), copper);
      hingePin.rotation.z = Math.PI / 2;
      hinge.add(hingePin);
      const panel = new THREE.Group();
      panel.position.y = row * 0.6;
      const panelBack = new THREE.Mesh(new RoundedBoxGeometry(1.8, 1.25, 0.06, 2, 0.018), carbon);
      const cells = new THREE.Mesh(new THREE.PlaneGeometry(1.73, 1.18), solarCells);
      cells.position.z = 0.032;
      panel.add(panelBack, cells);
      const left = -0.89;
      const right = 0.89;
      const top = 0.61;
      const bottom = -0.61;
      panel.add(
        beam(new THREE.Vector3(left, bottom, 0.035), new THREE.Vector3(left, top, 0.035), 0.025, titanium),
        beam(new THREE.Vector3(right, bottom, 0.035), new THREE.Vector3(right, top, 0.035), 0.025, titanium),
        beam(new THREE.Vector3(left, top, 0.035), new THREE.Vector3(right, top, 0.035), 0.025, titanium),
        beam(new THREE.Vector3(left, bottom, 0.035), new THREE.Vector3(right, bottom, 0.035), 0.025, titanium),
      );
      const spine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.16, 0.07), copper);
      panel.add(spine);
      for (const x of [-0.59, 0.59]) {
        const reinforcingRib = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1.18, 0.014), titanium);
        reinforcingRib.position.set(x, 0, 0.032);
        panel.add(reinforcingRib);
      }
      for (const y of [-0.36, 0.36]) {
        const rearRib = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.022, 0.018), titanium);
        rearRib.position.set(0, y, -0.036);
        panel.add(rearRib);
      }
      const socket = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 8), titanium);
      socket.position.set(-side * 0.12, row * 1.225, -0.04);
      hinge.add(socket);
      const brace = new THREE.Mesh(beamGeometry, titanium);
      brace.scale.set(0.024, 1, 0.024);
      wing.add(brace);
      braces.push({mesh: brace, row});
      hinge.add(panel);
      wing.add(hinge);
      leaves.push({hinge, row, socket});
    }
    solar.push({wing, leaves, braces, side});
  }

  const antenna = new THREE.Group();
  antenna.position.set(3.59, -0.22, -0.24);
  antenna.rotation.z = -Math.PI / 2;
  const antennaSaddle = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.15, 0.3, 2, 0.035), carbon);
  antenna.add(antennaSaddle);
  for (const x of [-0.16, 0.16]) {
    antenna.add(beam(new THREE.Vector3(x, -0.07, 0), new THREE.Vector3(0, 0.37, 0), 0.018, titanium));
  }
  antenna.add(beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.25, 0), 0.023, titanium));
  antenna.add(
    beam(new THREE.Vector3(0, 0.42, 0), new THREE.Vector3(-0.29, 0.68, 0.15), 0.014, titanium),
    beam(new THREE.Vector3(0, 0.42, 0), new THREE.Vector3(0.29, 0.68, 0.15), 0.014, titanium),
  );
  const dishProfile = [
    new THREE.Vector2(0.035, 0),
    new THREE.Vector2(0.1, 0.012),
    new THREE.Vector2(0.18, 0.052),
    new THREE.Vector2(0.24, 0.1),
  ];
  const dish = new THREE.Mesh(new THREE.LatheGeometry(dishProfile, 32), titanium);
  dish.rotation.x = Math.PI / 2;
  dish.position.set(0, 0.96, 0);
  antenna.add(dish);
  const dishRim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.014, 6, 24), carbon);
  dishRim.position.set(0, 0.96, 0.1);
  antenna.add(dishRim);
  for (let index = 0; index < 3; index += 1) {
    const angle = index * Math.PI * 2 / 3;
    antenna.add(beam(
      new THREE.Vector3(Math.cos(angle) * 0.21, 0.96 + Math.sin(angle) * 0.21, 0.09),
      new THREE.Vector3(0, 0.96, 0.18),
      0.008,
      titanium,
    ));
  }
  const feed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), light);
  feed.position.set(0, 0.96, 0.18);
  antenna.add(feed);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.044, 12, 12), light);
  beacon.position.set(0, 1.27, 0);
  antenna.add(beacon);
  pods[4].group.add(antenna);

  return {
    group, ring, pressureHull,
    shellFaces: [podFrontGeometry, podRearGeometry],
    outerWall: podOuterWallGeometry,
    pods, solar, dockingLocks, textures: [solarTexture],
  };
}

function motionEase(start: number, end: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

const braceAxis = new THREE.Vector3(0, 1, 0);
const braceDirection = new THREE.Vector3();

export function poseStation(station: StationModel, progress: number): void {
  const sequence = Math.min(progress, 0.5);
  station.group.rotation.y = -0.68 + motionEase(0.11, 0.29, sequence) * 0.38
    + motionEase(0.29, 0.37, sequence) * 0.45;
  station.group.rotation.x = 0.2 + motionEase(0.19, 0.34, sequence) * 0.14;
  station.ring.rotation.z = -0.08 + motionEase(0.12, 0.36, sequence) * 1.15;

  station.pods.forEach(({group, angle, slides, collars}, index) => {
    const stagger = index * 0.0018;
    const extension = 0.46 * motionEase(0.19 + stagger, 0.255 + stagger, sequence)
      * (1 - motionEase(0.295 + stagger, 0.365 + stagger, sequence));
    group.position.set(Math.cos(angle) * extension, Math.sin(angle) * extension, 0);
    for (const slide of slides) {
      slide.position.set(3.015 + extension / 2, 0, slide.position.z);
      slide.scale.y = 0.29 + extension;
    }
    collars.position.x = 3.16 + extension;
  });

  station.solar.forEach(({wing, leaves, braces, side}, index) => {
    const deployed = motionEase(0.225 + index * 0.012, 0.345 + index * 0.012, sequence);
    wing.rotation.y = side * (1.12 - deployed * 1.02);
    leaves.forEach(({hinge, row}) => {
      hinge.rotation.x = row * (1 - deployed) * 1.42;
    });
    braces.forEach(({mesh, row}) => {
      const fold = (1 - deployed) * 1.42;
      const tipX = side * 0.69;
      const tipY = row * (0.09 + 1.225 * Math.cos(fold) + 0.04 * Math.sin(fold));
      const tipZ = 1.225 * Math.sin(fold) - 0.04 * Math.cos(fold);
      braceDirection.set(tipX, tipY, tipZ + 0.08);
      mesh.position.set(tipX / 2, tipY / 2, (tipZ - 0.08) / 2);
      mesh.scale.set(0.024, braceDirection.length(), 0.024);
      mesh.quaternion.setFromUnitVectors(braceAxis, braceDirection.normalize());
    });
  });
  const locksReleased = motionEase(0.315, 0.36, sequence);
  station.dockingLocks.forEach(({group, angle}) => {
    const position = angle + locksReleased * 0.075;
    group.position.set(Math.cos(position) * 0.66, Math.sin(position) * 0.66, 1.372);
    group.rotation.z = position;
  });
}
