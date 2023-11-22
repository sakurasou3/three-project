import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer;
let sphere;

window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = innerWidth;
  const height = innerHeight;

  // シーン
  scene = new THREE.Scene();
  // カメラ（レクチャー部分）
  // PerspectiveCamera: 手前のものは大きく、奥のものは小さく見える
  // 参考：https://threejs.org/examples/?q=camera#webgl_camera
  // camera = new THREE.PerspectiveCamera(
  //   75, // 視野角。だいたい45〜75度の間を指定するのが一般的。
  //   window.innerWidth / window.innerHeight, // アスペクト比。w/h。画面いっぱいの場合は画面サイズと一致させる。
  //   0.1, // 開始距離。カメラのレンズの位置、と思っていいかも？
  //   1000 // 終了距離。どの範囲までを映すかの指標。10000以内が妥当。
  // );
  // camera.position.set(0, 0, 500);
  const aspectRatio = width / height;
  camera = new THREE.OrthographicCamera(
    500 * aspectRatio, // left: 左の座標にアスペクト比をかけることで描画時のアスペクト比を保つ
    -500 * aspectRatio, // right：右の座標。アスペクト比は左と同様
    -500, // top: 上の座標。ブラウザは基本左右の幅が変わるので、上下にはアスペクト比をかけなくていい。
    500, // bottom: したの座標。
    0.1, // 開始位置
    1000 // 終了位置
  );
  camera.position.z = 1000; // 値を変えてもオブジェクトの大きさが変わらない。これがOrthographicCameraの最大の特徴。

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  // 座標軸を表示
  const axes = new THREE.AxesHelper(1500);
  axes.position.x = 0;
  scene.add(axes); //x 軸は赤, y 軸は緑, z 軸は青

  // ボックスを作成
  const geometry = new THREE.SphereGeometry(200, 64, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xc7ebb,
    wireframe: true,
  });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  //マウス操作
  new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // レンダリング
  renderer.render(scene, camera);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
