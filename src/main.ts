import { XmlParser } from "./xml/XmlParser";
import { EditorScreen } from "./views/EditorScreen";
import { EditorContext } from "./views/EditorContext";
import { EditorInteractionController } from "./controller/EditorInteractionController";

const editorScreen = document.getElementById('editorScreen') as HTMLDivElement;
const textarea = document.getElementById('xmlInput') as HTMLTextAreaElement;
const button = document.getElementById('loadButton') as HTMLButtonElement;

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