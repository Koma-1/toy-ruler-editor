import { XmlParser } from "./xml/XmlParser";
import { EditorPlaneView } from "./views/EditorPlaneView";

const svg = document.getElementById('editor') as unknown as SVGSVGElement;
const textarea = document.getElementById('xmlInput') as HTMLTextAreaElement;
const button = document.getElementById('loadButton') as HTMLButtonElement;

let currentView: EditorPlaneView | null = null;

button.addEventListener("click", () => {
  const xml = textarea.value;

  try {
    const plane = new XmlParser().parse(xml);
    currentView = new EditorPlaneView(svg, plane);
    currentView.render();
  } catch (e) {
    console.error("XML parsing/rendering failed:", e);
    alert("XML parsing/rendering failed.");
  }
});