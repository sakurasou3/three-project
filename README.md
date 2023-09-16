# three-project

## Three.js とは

- 3D = Three Demention の Three と思われる。
- 構成

  1. Scene

  - ステージ的なもの

  2. Camera

  - Scene 上の Object を移すカメラ。PerspectiveCamera がよく使われる。

  3. Renderer

  - ブラウザ上に画面を映せるような変換器。WebGLRenderer がよく使われる。

- オブジェクト

1. ジオメトリ
   オブジェクトの骨格部分。球体、BOX、平面などが主流。
   これらの Base となるのが、[BufferGeometry](https://threejs.org/docs/?q=BufferGeo#api/en/core/BufferGeometry)
