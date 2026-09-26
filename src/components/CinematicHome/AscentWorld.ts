import * as THREE from 'three';

export const orbitOrigin = new THREE.Vector3(0, 72, -74);

export type FlightPose = {
  at: number;
  position: [number, number, number];
  target: [number, number, number];
};

export const orbitEntryPose: FlightPose = {
  at: 0,
  position: [0, 0.5, 19],
  target: [1.5, 0, -4],
};

// The last pose exactly matches the orbital camera's first pose after the origin offset.
export const flightPath: FlightPose[] = [
  {at: 0, position: [0, 0.5, 19], target: [0, 0, -5]},
  {at: 0.12, position: [0, 4, 18], target: [0, 8, -20]},
  {at: 0.29, position: [0, 18, 14], target: [0, 31, -34]},
  {at: 0.51, position: [0, 37, 5], target: [0, 55, -63]},
  {at: 0.73, position: [0, 59, -14], target: [0, 77, -94]},
  {at: 0.9, position: [0, 70, -38], target: [0, 73, -91]},
  {
    at: 1,
    position: orbitEntryPose.position.map((value, axis) => value + orbitOrigin.getComponent(axis)) as FlightPose['position'],
    target: orbitEntryPose.target.map((value, axis) => value + orbitOrigin.getComponent(axis)) as FlightPose['target'],
  },
];

const clamp = (value: number): number => Math.min(1, Math.max(0, value));
const smooth = (a: number, b: number, value: number): number => {
  const x = clamp((value - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function createAscentWorld(scene: THREE.Scene, loader: THREE.TextureLoader, onTextureReady: (url: string) => void) {
  const textures: THREE.Texture[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const objects: THREE.Object3D[] = [];
  let disposed = false;

  const load = (url: string, apply: (texture: THREE.Texture) => void) => {
    loader.load(url, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      textures.push(texture);
      apply(texture);
      onTextureReady(url);
    });
  };
  const add = (object: THREE.Object3D) => {
    scene.add(object);
    objects.push(object);
  };

  const skyGeometry = new THREE.SphereGeometry(480, 32, 20);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {uFlight: {value: 0}},
    vertexShader: `
      varying vec3 vDirection;
      void main() {
        vDirection = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uFlight;
      varying vec3 vDirection;
      void main() {
        float height = smoothstep(-0.35, 0.8, vDirection.y);
        float darkness = smoothstep(0.20, 0.96, uFlight);
        vec3 low = mix(vec3(0.50, 0.73, 0.84), vec3(0.015, 0.050, 0.095), darkness);
        vec3 high = mix(vec3(0.09, 0.31, 0.53), vec3(0.006, 0.015, 0.033), darkness);
        gl_FragColor = vec4(mix(low, high, height), 1.0);
      }
    `,
    toneMapped: false,
  });
  geometries.push(skyGeometry);
  materials.push(skyMaterial);
  add(new THREE.Mesh(skyGeometry, skyMaterial));

  const campusGeometry = new THREE.PlaneGeometry(44, 24.75);
  const campusMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 1, depthWrite: false, toneMapped: false});
  const campus = new THREE.Mesh(campusGeometry, campusMaterial);
  campus.position.set(0, 0, -5);
  campus.renderOrder = 3;
  geometries.push(campusGeometry);
  materials.push(campusMaterial);
  add(campus);
  load('/img/journey/binjiang-campus.webp', (texture) => {
    campusMaterial.map = texture;
    campusMaterial.needsUpdate = true;
  });

  const earthGeometry = new THREE.SphereGeometry(110, 72, 48);
  const earthMaterial = new THREE.MeshStandardMaterial({color: 0xd1e5ec, roughness: 1, transparent: true, opacity: 0, depthWrite: false});
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.set(0, -40, -145);
  earth.rotation.y = 2.15;
  geometries.push(earthGeometry);
  materials.push(earthMaterial);
  add(earth);
  load('/img/journey/earth-map.webp', (texture) => {
    earthMaterial.map = texture;
    earthMaterial.color.setHex(0xffffff);
    earthMaterial.needsUpdate = true;
  });

  const atmosphereGeometry = new THREE.SphereGeometry(111.4, 64, 40);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {uOpacity: {value: 0}},
    vertexShader: `
      varying vec3 vNormalWorld;
      varying vec3 vPositionWorld;
      void main() {
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        vPositionWorld = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vNormalWorld;
      varying vec3 vPositionWorld;
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vPositionWorld);
        float rim = pow(1.0 - max(dot(normalize(vNormalWorld), viewDirection), 0.0), 3.0);
        gl_FragColor = vec4(0.19, 0.62, 0.94, rim * uOpacity);
      }
    `,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.position.copy(earth.position);
  geometries.push(atmosphereGeometry);
  materials.push(atmosphereMaterial);
  add(atmosphere);

  const cloudSpecs: Array<[number, number, number, number, number]> = [
    [-18, 16, -26, 65, 34],
    [20, 27, -37, 76, 39],
    [-17, 39, -59, 88, 45],
    [20, 51, -78, 91, 47],
    [-11, 62, -99, 116, 58],
  ];
  const cloudMaterials: THREE.MeshBasicMaterial[] = [];
  const clouds = cloudSpecs.map(([x, y, z, width, height], index) => {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.rotation.z = (index - 2) * 0.08;
    mesh.renderOrder = 2;
    geometries.push(geometry);
    materials.push(material);
    cloudMaterials.push(material);
    add(mesh);
    return mesh;
  });
  load('/img/journey/cloud-bank.webp', (texture) => {
    cloudMaterials.forEach((material) => {
      material.map = texture;
      material.needsUpdate = true;
    });
  });

  return {
    update(flightProgress: number, spaceProgress: number, camera: THREE.Camera, isMobile: boolean) {
      const flight = clamp(flightProgress);
      const earthVisibility = smooth(0.46, 0.83, flight) * (1 - smooth(0.18, 0.28, spaceProgress));
      skyMaterial.uniforms.uFlight.value = flight;
      campusMaterial.opacity = 1 - smooth(0.07, 0.35, flight);
      campus.scale.setScalar(isMobile ? 1.6 : 1);
      campus.position.y = isMobile ? 5.3 : 0;
      campus.visible = campusMaterial.opacity > 0.005;
      earthMaterial.opacity = earthVisibility;
      earth.visible = earthVisibility > 0.005;
      atmosphereMaterial.uniforms.uOpacity.value = earthVisibility * 0.7;
      atmosphere.visible = earth.visible;
      earth.rotation.y = 2.15 + flight * 0.05;
      const cloudVisibility = smooth(0.18, 0.36, flight) * (1 - smooth(0.79, 0.99, flight));
      clouds.forEach((cloud, index) => {
        cloud.quaternion.copy(camera.quaternion);
        cloud.rotateZ((index - 2) * 0.08);
        cloudMaterials[index].opacity = cloudVisibility * (index % 2 ? 0.75 : 0.9);
        cloud.visible = cloudMaterials[index].opacity > 0.005;
      });
    },
    dispose() {
      disposed = true;
      objects.forEach((object) => scene.remove(object));
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
    },
  };
}
