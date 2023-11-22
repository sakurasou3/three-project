import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// カーソルの位置を取得
// const cursor = {
//   x: 0,
//   y: 0,
// };
// window.addEventListener("mousemove", (event) => {
//   // -0.5〜0.5の間の値になるよう調整する
//   cursor.x = event.clientX / sizes.width - 0.5;
//   cursor.y = event.clientY / sizes.height - 0.5;
// });

//サイズ
const sizes = {
  width: 800,
  height: 600,
};

//シーン
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const materila = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: false,
});

//オブジェクト
const mesh = new THREE.Mesh(geometry, materila);
scene.add(mesh);

//カメラ
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 3;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// カメラ制御
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 慣性が有効になる（重みがつく）

//アニメーション
const animate = () => {
  // カメラ制御
  // camera.position.x = cursor.x * 3; // カメラ移動を早くするために3倍した
  // camera.position.y = cursor.y * 3;
  // camera.position.x = Math.sin(Math.PI * 2 * cursor.x) * 3; // θ = cursor.x
  // camera.position.z = Math.cos(Math.PI * 2 * cursor.x) * 3;
  // camera.position.y = cursor.y * 5;
  // camera.lookAt(mesh.position);
  controls.update(); // enableDampingをtrueにしたので必要

  //レンダリング
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
