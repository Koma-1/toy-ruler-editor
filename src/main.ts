import { XmlParser } from "./xml/XmlParser";
import { EditorScreen } from "./views/EditorScreen";
import { EditorContext } from "./views/EditorContext";
import { EditorInteractionController } from "./controller/EditorInteractionController";

const defaultXml = `<root width="500" height="500">
  <ruler id="H0" direction="horizontal" type="chain" offset="0" />
  <ruler id="H1" direction="horizontal" type="chain" offsetFrom="H0" offset="100" />
  <ruler id="H2" direction="horizontal" type="chain" offsetFrom="H1" offset="50" />
  <ruler id="H3" direction="horizontal" type="chain" offsetFrom="H2" offset="50" />
  <ruler id="H4" direction="horizontal" type="chain" offsetFrom="H3" offset="50" />
  <ruler id="V0" direction="vertical" type="chain" offset="0" />
  <ruler id="V1" direction="vertical" type="chain" offsetFrom="V0" offset="150" />
  <ruler id="V2" direction="vertical" type="chain" offsetFrom="V1" offset="80" />
  <ruler id="V3" direction="vertical" type="chain" offsetFrom="V2" offset="20" />
  <ruler id="V4" direction="vertical" type="chain" offsetFrom="V3" offset="30" />
  <ruler id="V5" direction="vertical" type="chain" offsetFrom="V4" offset="40" />
  <rect id="rect1" startXRuler="V2" startYRuler="H2" endXRuler="V1" endYRuler="H1"/>
  <rect id="rect2" startXRuler="V5" startYRuler="H4" endXRuler="V3" endYRuler="H2"/>
  <rect id="rect3" startXRuler="V1" startYRuler="H1" endX="15" endY="30"/>
  <rect id="rect4" startXRuler="V1" startYRuler="H2" endXRuler="V0" endYRuler="H3"/>
  <rect id="rect5" startX="300" startY="30" endX="380" endY="100"/>
</root>`


const editorScreen = document.getElementById('editorScreen') as HTMLDivElement;
const textarea = document.getElementById('xmlInput') as HTMLTextAreaElement;
const button = document.getElementById('loadButton') as HTMLButtonElement;

textarea.value = defaultXml;

let currentScreen: EditorScreen | null = null;

button.addEventListener("click", () => {
  const xml = textarea.value;

  try {
    const model = new XmlParser().parse(xml);
    currentScreen = new EditorScreen(editorScreen, model);
    currentScreen.render();
  } catch (e) {
    console.error("XML parsing/rendering failed:", e);
    alert("XML parsing/rendering failed.");
  }
});