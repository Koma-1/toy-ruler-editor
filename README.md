# Toy Ruler-Based Vector Graphics Editor

このリポジトリは、学習目的の、ルーラーを使ったグラフィックスエディタです。

## 概要

グラフィックス要素を、ルーラーの交点を参照して配置できるベクターグラフィックスエディタです。
ルーラーは他のルーラーからのオフセットで定義でき、連動して動かすことができます。

## 特徴

- XML形式でルーラーと図形を定義
- ルーラーの位置は絶対座標または他のルーラーからのオフセットを指定
- グラフィックス要素の座標をルーラーで指定することで、編集時に位置関係を維持

### 現時点の機能

- TextAreaから直接XMLを入力
- SVGで描画しブラウザ上で表示

##　XML記述例

```xml
<xml>
  <ruler id="H0" direction="horizontal" type="chain" offset="20" />
  <ruler id="V0" direction="vertical" type="chain" offset="50" />
  <rect id="rect1" startXRuler="V0" startYRuler="H0" endX="200" endY="100"/>
</xml>
```

