import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

//UIデバッグ
const gui = new GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

//ライト
// AmbientLight: 距離は関係なく、均一に光を当てる.
// 地面からの反射（バウンシング）を表現するために使われる
// https://threejs.org/docs/?q=Light#api/en/lights/AmbientLight
const ambientLight = new THREE.AmbientLight();
ambientLight.color.set("0xffffff");
ambientLight.intensity = 0.5;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01);

// DirectionalLight: 日光のシミュレート.defaultでは真上から原点に向かって降り注いでいる
// https://threejs.org/docs/?q=Light#api/en/lights/DirectionalLight
const directionalLight = new THREE.DirectionalLight();
directionalLight.color = new THREE.Color(0x0fffff);
directionalLight.intensity = 4;
// 光源の位置を変更することも可能
directionalLight.position.set(1, 0.55, 0);
scene.add(directionalLight);

// HemisphereLight: 半球に分割し、上と下の色を変えることができるが、影はつけられないので注意
// https://threejs.org/docs/?q=Light#api/en/lights/HemisphereLight
// skyColor, groundColor, intensityを指定する
const hemisphereLight = new THREE.HemisphereLight(0x0ffff0, 0xffff00, 1.5);
hemisphereLight.position.set(2, 0.5, 1);
scene.add(hemisphereLight);

// PointLight: 豆電球.defaultは原点に光源が設置される
// https://threejs.org/docs/?q=Light#api/en/lights/PointLight
const pointLight = new THREE.PointLight(0xff4000, 0.5, 10, 2);
// pointLight.decay = 200; // この減衰がうまく動いてないかも…？？？
pointLight.position.set(-1, 0, 1.5);
scene.add(pointLight);

// RectAreaLight: 撮影時の四角くて大きな照明設備のイメージ
// ※マテリアルにMeshStandardMaterialを使っていないとうまく動作しない
// https://threejs.org/docs/?q=Light#api/en/lights/RectAreaLight
const rectAreaLight = new THREE.RectAreaLight(0x4eff00, 1, 1, 2);
rectAreaLight.position.set(1.5, 0, 1.5);
// 原点に向かって照射
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

// SpotLight: 懐中電灯のイメージ
// https://threejs.org/docs/?q=Light#api/en/lights/SpotLight
const spotLight = new THREE.SpotLight(
  0xffffff,
  0.7,
  6,
  Math.PI * 0.1,
  0.01,
  10
);
spotLight.position.set(0, 1, 1);
scene.add(spotLight);

// 懐中電灯の向きを指定。
// scene.addを再度行わないといけない
console.log(spotLight.target);
spotLight.target.position.x = 0.3;
spotLight.target.castShadow = true;
scene.add(spotLight.target);

// helper
// 日光の場所
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.3
);
scene.add(directionalLightHelper);
// 半球光源
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.5
);
scene.add(hemisphereLightHelper);
// 豆電球
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
scene.add(pointLightHelper);
// 懐中電灯
// ※これだけだとtargetで指定した照射角度が反映されない
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
// アニメーションされるたびにヘルパーを更新して角度を正しく表示させる
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});
// 撮影時の照明
// ※THREEにはないので注意。
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

//マテリアル
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.3;

//オブジェクト
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
