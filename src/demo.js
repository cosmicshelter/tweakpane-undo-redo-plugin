import './style.css'
import * as THREE from 'three';
import * as Tweakpane from 'tweakpane';
import addUndoRedoFeature from './main';

addUndoRedoFeature(Tweakpane);

/**
 * Setup Three
 */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/**
 * Render loop
 */
function animate() {
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

/**
 * Setup Pane
 */
const pane = new Tweakpane.Pane({ title: 'Tweakpane Undo / Redo' });

const cubeFolder = pane.addFolder({ title: 'Cube' });
cubeFolder.addBinding(cube.scale, 'x');
cubeFolder.addBinding(cube.scale, 'y');
cubeFolder.addBinding(cube.scale, 'z');

const cameraFolder = pane.addFolder({ title: 'Camera' });
const cameraTabs = cameraFolder.addTab({ pages: [{ title: 'Position' }, { title: 'Settings' }] });

cameraTabs.pages[0].addBinding(camera.position, 'x');
cameraTabs.pages[0].addBinding(camera.position, 'y');
cameraTabs.pages[0].addBinding(camera.position, 'z');

cameraTabs.pages[1].addBinding(camera, 'near').on('change', () => { camera.updateProjectionMatrix() });
cameraTabs.pages[1].addBinding(camera, 'far').on('change', () => { camera.updateProjectionMatrix() });
cameraTabs.pages[1].addBinding(camera, 'fov').on('change', () => { camera.updateProjectionMatrix() });