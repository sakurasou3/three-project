import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

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
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

/**
 * テクスチャ設定
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/particles/4.png");

/**
 * パーティクルを作ってみよう
 */
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positionArray = new Float32Array(count * 3); // count数のオブジェクトが3つの座標を持つから*3する
const colorArray = new Float32Array(count * 3); // 色にも座標が存在するので、*3する

positionArray.map((position, index) => {
  // Math.random() - 0.5：値が-0.5〜0.5の値になる = 画面の真ん中にパーティクルがくる
  // * 10：値が-5〜5になる。引いてみると立方体になるけど、カメラ位置を固定すれば空間いっぱいに広がっているように見える
  positionArray[index] = (Math.random() - 0.5) * 10;
  colorArray[index] = Math.random(); // 色は0〜1の値をとる
});
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(colorArray, 3)
);

const pointMaterial = new THREE.PointsMaterial({
  size: 0.15,
  alphaMap: particlesTexture,
  transparent: true, // 透明にしないと、alphaMapが効かなくなる
  // alphaTest: 0.01, // テクスチャのエッジが丸くなる
  // depthTest: false, // 深度をなくすことで、ほぼエッジが見えなくなる+奥のパーティクルも見えるようになる→パーティクル以外のオブジェクトにも透けて見えるようになってしまう
  depthWrite: false, // これで解決できる
  vertexColors: true, // 頂点の色を設定する
  blending: THREE.AdditiveBlending, // 重なっているパーティクルが光るようになる
});
// pointMaterial.map = particlesTexture;
// pointMaterial.color.set("green");

const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

// 球をおいてみる
const cube = new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshNormalMaterial()
);
scene.add(cube);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

window.addEventListener("resize", onWindowResize);

const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  [...Array(count).keys()].map((i) => {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
  });
  // attributeをアニメーションしたいときはUpdateが必要
  particlesGeometry.attributes.position.needsUpdate = true;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
}

animate();
