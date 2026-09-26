import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';
import ts from 'typescript';

const source = await readFile(new URL('../src/components/CinematicHome/StationModel.ts', import.meta.url), 'utf8');
let compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
}).outputText;
for (const specifier of [
  'three',
  'three/addons/geometries/RoundedBoxGeometry.js',
  'three/addons/utils/BufferGeometryUtils.js',
]) {
  compiled = compiled.replaceAll(`from '${specifier}'`, `from '${import.meta.resolve(specifier)}'`);
}
const {createStation, poseStation} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`
);

test('station shell and mechanisms keep their clearance throughout the scroll', () => {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: () => ({width: 768, height: 512, getContext: () => null}),
  };
  let station;
  try {
    station = createStation();
  } finally {
    globalThis.document = originalDocument;
  }

  station.pressureHull.geometry.computeBoundingBox();
  const hull = station.pressureHull.geometry.boundingBox.clone().translate(station.pressureHull.position);
  const [front, rear] = station.shellFaces;
  front.computeBoundingBox();
  rear.computeBoundingBox();
  assert.ok(front.boundingBox.min.z - hull.max.z > 0.12, 'front cladding clears the pressure hull');
  assert.ok(hull.min.z - rear.boundingBox.max.z > 0.035, 'rear cladding clears the pressure hull');

  const wallPositions = station.outerWall.getAttribute('position');
  let nearestWallRadius = Infinity;
  for (let index = 0; index < wallPositions.count; index += 1) {
    nearestWallRadius = Math.min(nearestWallRadius,
      Math.hypot(wallPositions.getX(index), wallPositions.getY(index)));
  }
  assert.ok(nearestWallRadius - 3.56 > 0.02, 'outer wall clears the pressure hull');

  let minimumLeafGap = Infinity;
  for (let step = 0; step <= 100; step += 1) {
    poseStation(station, step / 200);
    // Remove the rigid camera-facing pose; clearance is measured in station space.
    station.group.rotation.set(0, 0, 0);
    station.group.position.set(0, 0, 0);
    for (const {group, slides, collars} of station.pods) {
      const extension = Math.hypot(group.position.x, group.position.y);
      for (const slide of slides) {
        assert.ok(slide.scale.x < 0.06 && slide.scale.z < 0.06,
          'radial slide keeps a narrow cross section');
        const innerEnd = slide.position.x - slide.scale.y / 2;
        const outerEnd = slide.position.x + slide.scale.y / 2;
        assert.ok(innerEnd < 3.11, 'slide remains inside its fixed sleeve');
        assert.ok(Math.abs(outerEnd - (3.16 + extension)) < 0.000001,
          'slide reaches the moving cladding bracket');
      }
      assert.ok(Math.abs(collars.position.x - (3.16 + extension)) < 0.000001);
    }
    for (const {group} of station.dockingLocks) {
      assert.ok(Math.abs(Math.hypot(group.position.x, group.position.y) - 0.66) < 0.000001,
        'docking lock stays on its circular track');
    }
    for (const {wing, leaves, braces} of station.solar) {
      wing.updateWorldMatrix(true, true);
      const top = new THREE.Box3().setFromObject(leaves.find(({row}) => row === 1).hinge);
      const bottom = new THREE.Box3().setFromObject(leaves.find(({row}) => row === -1).hinge);
      const gap = top.min.y - bottom.max.y;
      minimumLeafGap = Math.min(minimumLeafGap, gap);
      for (const {mesh, row} of braces) {
        mesh.updateMatrix();
        const braceTip = new THREE.Vector3(0, 0.5, 0).applyMatrix4(mesh.matrix);
        const socket = leaves.find((leaf) => leaf.row === row).socket;
        const socketPoint = wing.worldToLocal(socket.getWorldPosition(new THREE.Vector3()));
        assert.ok(braceTip.distanceTo(socketPoint) < 0.000001,
          'folding brace stays attached to its solar leaf');
      }
    }
  }
  assert.ok(minimumLeafGap > 0.02, `solar leaves remain separated (minimum gap ${minimumLeafGap})`);

  station.group.rotation.set(0, 0, 0);
  station.group.position.set(0, 0, 0);
  station.ring.updateWorldMatrix(true, true);
  const ringBounds = new THREE.Box3().setFromObject(station.ring);
  assert.ok(ringBounds.min.z > -0.87,
    `rotating rear structure clears the fixed solar truss (rear extent ${ringBounds.min.z})`);
});
