import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls, sphere, plane, octahedron;
// アニメーション用
const clock = new THREE.Clock();

window.addEventListener("load", init);

function init() {
  //シーン
  scene = new THREE.Scene();

  //カメラ
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 2);

  //レンダラー
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  /**
   * マテリアルセクション
   */

  // geometry
  const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const octahedronGeometry = new THREE.OctahedronGeometry(0.5);

  // テクスチャ
  const texture = new THREE.TextureLoader().load("../textures/brick.jpg");
  // material
  // MeshBasicMaterial: 光源を必要としないマテリアル
  // https://threejs.org/docs/?q=Material#api/en/materials/MeshBasicMaterial
  // const material = new THREE.MeshBasicMaterial({
  //   // color: "lime", // color指定
  //   map: texture, // texture指定
  //   // wireframe: true, // wireframe表示
  // });
  // もしくは以下のような書き方も可能
  // const material = new THREE.MeshBasicMaterial();
  // material.map = texture;
  // colorは書き方が2種類。
  // material.color.set("lime");
  // material.color = new THREE.Color("red");
  // material.wireframe = true;

  // materialのsideをDoubleに設定することで、planeの裏側も表示できるようになる
  // material.side = THREE.DoubleSide;
  // transparentとopacityを一緒に指定することで、半透明にもできる
  // material.opacity = 0.5;
  // material.transparent = true;

  // MeshNormalMaterial: 法線（表面に対して垂直）ベクトルをbaseに作られている…？光を必要としない。
  // https://threejs.org/docs/?q=Material#api/en/materials/MeshNormalMaterial
  // const material = new THREE.MeshNormalMaterial();
  // 平坦な麺を表現できる（sphereが特にわかりやすい）
  // material.flatShading = true;

  // MeshStandardMaterial: 光源を必要とする。lightがないと可視化できない
  // https://threejs.org/docs/?q=Material#api/en/materials/MeshStandardMaterial
  // const material = new THREE.MeshStandardMaterial();
  // material.color.set("#049ef4");
  // material.map = texture;
  // 表面の荒さ。小さくすればするほど磨いたようになる
  // material.roughness = 0.34;
  // 金属っぽさ。光源の光がわかりやすいかも
  // material.metalness = 0.64;

  // MeshPhongMaterial: 光源を必要とする。反射光を操作できる
  // https://threejs.org/docs/?q=Material#api/en/materials/MeshPhongMaterial
  const material = new THREE.MeshPhongMaterial();
  // 反射率と反射光の色を指定
  material.shininess = 1000;
  material.specular = new THREE.Color("red");

  // 光源を追加
  // AmbientLight: 光源を持たず、全体を満遍なく照らす
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight();
  pointLight.color.set(0xffffff);
  pointLight.intensity = 20;
  pointLight.position.set(1, 2, 3);
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  scene.add(pointLightHelper);

  // Mesh
  sphere = new THREE.Mesh(sphereGeometry, material);
  sphere.position.x = -1.5;
  plane = new THREE.Mesh(planeGeometry, material);
  octahedron = new THREE.Mesh(octahedronGeometry, material);
  octahedron.position.x = 1.5;

  scene.add(sphere, plane, octahedron);

  //マウス操作
  const controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}

function animate() {
  // オブジェクトを経過時間と共に回転させる
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.x = elapsedTime;
  plane.rotation.x = elapsedTime;
  octahedron.rotation.x = elapsedTime;
  sphere.rotation.y = elapsedTime;
  plane.rotation.y = elapsedTime;
  octahedron.rotation.y = elapsedTime;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
