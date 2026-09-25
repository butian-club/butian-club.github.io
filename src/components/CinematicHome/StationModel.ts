import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

export type StationModel = {
  group: THREE.Group;
  ring: THREE.Group;
  pods: Array<{group: THREE.Group; angle: number}>;
  solar: THREE.Group[];
  textures: THREE.Texture[];
};

function beam(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  material: THREE.Material,
): THREE.Mesh {
  const direction = to.clone().sub(from);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 8),
    material,
  );
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
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

function habitatSegmentGeometry(count: number): THREE.ExtrudeGeometry {
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
    depth: 0.7,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.025,
    bevelSegments: 2,
    curveSegments: 6,
  });
  geometry.translate(0, 0, -0.35);
  return geometry;
}

export function createStation(): StationModel {
  const group = new THREE.Group();
  group.position.set(6, 0, -4);

  const ceramic = new THREE.MeshPhysicalMaterial({
    color: 0xcbd8d4, metalness: 0.35, roughness: 0.31, envMapIntensity: 1.1,
    clearcoat: 0.28, clearcoatRoughness: 0.23,
  });
  const titanium = new THREE.MeshPhysicalMaterial({
    color: 0x81979e, metalness: 0.73, roughness: 0.27, envMapIntensity: 1.45,
    clearcoat: 0.12, clearcoatRoughness: 0.2,
  });
  const carbon = new THREE.MeshStandardMaterial({
    color: 0x142630, metalness: 0.43, roughness: 0.42, envMapIntensity: 0.7,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb99468, metalness: 0.8, roughness: 0.27, envMapIntensity: 1.3,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0x94f2ee,
    emissive: 0x3aa8b1,
    emissiveIntensity: 1.9,
    metalness: 0.08,
    roughness: 0.2,
  });
  const solarTexture = solarCellTexture();
  const solarCells = new THREE.MeshStandardMaterial({
    map: solarTexture, color: 0xffffff, metalness: 0.4, roughness: 0.31, side: THREE.DoubleSide,
  });

  const ring = new THREE.Group();
  group.add(ring);
  for (const [radius, tube, z, material] of [
    [3.72, 0.055, 0.41, titanium],
    [3.72, 0.045, -0.43, titanium],
    [2.88, 0.075, 0.38, carbon],
    [2.88, 0.055, -0.41, copper],
    [3.78, 0.012, 0.43, copper],
    [2.91, 0.009, 0.43, light],
  ] as Array<[number, number, number, THREE.Material]>) {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 144), material);
    rail.position.z = z;
    ring.add(rail);
  }

  const podGeometry = habitatSegmentGeometry(16);
  const frontPanel = new RoundedBoxGeometry(0.37, 0.78, 0.055, 2, 0.025);
  const windowFrame = new RoundedBoxGeometry(0.22, 0.16, 0.032, 2, 0.023);
  const windowGlass = new RoundedBoxGeometry(0.17, 0.115, 0.014, 2, 0.018);
  const pods: StationModel['pods'] = [];
  for (let index = 0; index < 16; index += 1) {
    const angle = (index / 16) * Math.PI * 2;
    const pod = new THREE.Group();
    pod.rotation.z = angle;
    pod.add(new THREE.Mesh(podGeometry, index % 8 === 0 ? titanium : ceramic));

    const inset = new THREE.Mesh(frontPanel, carbon);
    inset.position.set(3.29, 0, 0.41);
    pod.add(inset);
    for (const offset of [-0.235, 0, 0.235]) {
      const frame = new THREE.Mesh(windowFrame, titanium);
      frame.position.set(3.31, offset, 0.451);
      const glazing = new THREE.Mesh(windowGlass, light);
      glazing.position.set(3.31, offset, 0.474);
      pod.add(frame, glazing);
    }
    for (const offset of [-0.34, 0.34]) {
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.012, 0.012), copper);
      seam.position.set(3.29, offset, 0.452);
      pod.add(seam);
    }

    for (const offset of [-0.44, 0.44]) {
      pod.add(beam(
        new THREE.Vector3(3.0, offset, 0.44),
        new THREE.Vector3(3.56, offset, 0.44),
        0.018,
        index % 4 === 0 ? copper : titanium,
      ));
    }
    const vent = new THREE.Mesh(new RoundedBoxGeometry(0.15, 0.36, 0.038, 2, 0.015), carbon);
    vent.position.set(3.48, 0, -0.42);
    pod.add(vent);
    ring.add(pod);
    pods.push({group: pod, angle});

    const boundary = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), light);
    boundary.position.set(Math.cos(angle + Math.PI / 16) * 3.75, Math.sin(angle + Math.PI / 16) * 3.75, 0.46);
    ring.add(boundary);
  }

  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    const radial = (distance: number, z: number) =>
      new THREE.Vector3(Math.cos(angle) * distance, Math.sin(angle) * distance, z);
    ring.add(
      beam(radial(0.83, 0.16), radial(2.88, 0.34), 0.041, index % 3 === 0 ? copper : titanium),
      beam(radial(0.83, -0.18), radial(2.88, -0.37), 0.033, titanium),
    );
    const braceAngle = angle + Math.PI / 12;
    ring.add(beam(
      radial(1.8, 0.18),
      new THREE.Vector3(Math.cos(braceAngle) * 2.89, Math.sin(braceAngle) * 2.89, 0.36),
      0.017,
      carbon,
    ));
  }

  const hub = new THREE.Group();
  group.add(hub);
  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.79, 0.79, 2.4, 48, 1, true),
    titanium,
  );
  hull.rotation.x = Math.PI / 2;
  hub.add(hull);
  for (const z of [-1.12, -0.57, 0.13, 0.76, 1.2]) {
    const collar = new THREE.Mesh(
      new THREE.TorusGeometry(z === 1.2 ? 0.77 : 0.8, z === 1.2 ? 0.09 : 0.037, 10, 64),
      z === 1.2 ? copper : carbon,
    );
    collar.position.z = z;
    hub.add(collar);
  }
  const dockingBezel = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.075, 12, 64), light);
  dockingBezel.position.z = 1.26;
  hub.add(dockingBezel);
  const innerTunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2.45, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x07131c, metalness: 0.48, roughness: 0.29, side: THREE.BackSide,
    }),
  );
  innerTunnel.rotation.x = Math.PI / 2;
  hub.add(innerTunnel);
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const portLight = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.03), light);
    portLight.position.set(Math.cos(angle) * 0.64, Math.sin(angle) * 0.64, 1.31);
    portLight.rotation.z = angle;
    hub.add(portLight);
  }

  const solar: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Group();
    wing.position.set(side * 5.13, 0, -0.57);
    group.add(wing);
    group.add(
      beam(
        new THREE.Vector3(side * 3.7, 0, -0.5),
        new THREE.Vector3(side * 4.55, 0, -0.57),
        0.055,
        titanium,
      ),
    );
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.31, 16), carbon);
    hinge.rotation.x = Math.PI / 2;
    hinge.position.set(-side * 0.51, 0, 0);
    wing.add(hinge);

    for (const row of [-1, 1]) {
      const panel = new THREE.Group();
      panel.position.set(side * 0.3, row * 0.69, 0);
      const cells = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.2, 0.045), solarCells);
      panel.add(cells);
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
      wing.add(panel);
    }
    solar.push(wing);
  }

  const antenna = new THREE.Group();
  antenna.position.set(0.22, 3.66, -0.3);
  antenna.add(beam(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.25, 0), 0.023, titanium));
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.29, 0.17, 24, 1, true), ceramic);
  dish.rotation.x = Math.PI / 2;
  dish.position.set(0, 0.96, 0);
  antenna.add(dish);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), light);
  beacon.position.set(0, 1.27, 0);
  antenna.add(beacon);
  group.add(antenna);

  return {group, ring, pods, solar, textures: [solarTexture]};
}
