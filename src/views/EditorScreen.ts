import { EditorPlane } from "../core/EditorPlane";
import { CornerRulerAreaView } from "./CornerRulerAreaView";
import { EditorPlaneView } from "./EditorPlaneView";
import { RulerAreaView } from "./RulerAreaView";
import { EditorContext } from "./EditorContext";
import { ToolBar as ToolBarView } from "./ToolBarView";
import { XAxisRulerAreaView } from "./XAxisRulerAreaView";
import { YAxisRulerAreaView } from "./YAxisRulerAreaView";
import { EditorInteractionContoroller } from "../controller/EditorInteractionController";
import { InteractionEvent } from "../controller/events";

export class EditorScreen {
    private editorPlaneView: EditorPlaneView;
    private rulerAreaView: RulerAreaView;
    private toolBarView: ToolBarView;
    private context: EditorContext;
    public controller: EditorInteractionContoroller;
    constructor(
        private container: HTMLDivElement,
        private model: EditorPlane,
    ) {
        this.context = new EditorContext(model);
        this.controller = new EditorInteractionContoroller({
            enableIntersectionPicker: (e) => {
                console.log("EditorInteractionContoroller.env.enableIntersectionPicker ->", e);
                if (e) {
                    this.context.pointPicker.enable();
                    this.context.requestRender();
                } else {
                    this.context.pointPicker.disable();
                    this.context.requestRender();
                }
            },
            requestRender: () => {this.context.requestRender();},
            deleteSelectedElement: () => {},
            addElement: (e) => {this.model.addElement(e);},
        });
        this.context.setPushEventCallback((e: InteractionEvent) => {
            this.controller.push(e);
        });

        this.context.setRenderCallback(() => {this.render();});
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const c1 = document.createElement("div");
        c1.style.display = "inline-block";
        this.container.appendChild(c1);
        const c11 = document.createElement("div");
        const c12 = document.createElement("div");
        c1.appendChild(c11);
        c1.appendChild(c12);


        const cornerRulerAreaView = CornerRulerAreaView.createAndAttach(c11, this.model, this.context);
        const xAxisRulerAreaView = XAxisRulerAreaView.createAndAttach(c11, this.model, this.context);
        const yAxisRulerAreaView = YAxisRulerAreaView.createAndAttach(c12, this.model, this.context);
        this.editorPlaneView = EditorPlaneView.createAndAttach(c12, this.model, this.context);
        this.rulerAreaView = new RulerAreaView(
            xAxisRulerAreaView,
            yAxisRulerAreaView,
            cornerRulerAreaView,
        );

        this.editorPlaneView.setScrollListener((l, t) => {this.rulerAreaView.setScroll(l, t);});

        const c2 = document.createElement("div");
        c2.style.display = "inline-block";
        this.container.appendChild(c2);

        this.toolBarView = new ToolBarView(c2, this.model, this.context, this.controller);

        this.setScreenSize(700, 500, 50);
    }

    public render() {
        this.editorPlaneView.render();
        this.rulerAreaView.render();
        this.toolBarView.render();
    }

    private setupScrollSync(
        editor: HTMLDivElement,
        hRuler: HTMLDivElement,
        vRuler: HTMLDivElement
    ): void {
        editor.addEventListener("scroll", () => {
            vRuler.scrollLeft = editor.scrollLeft;
            hRuler.scrollTop = editor.scrollTop;
        });
    }

    private setScreenSize(width: number, height: number, rulerAreaWidth: number) {
        this.editorPlaneView.setScreenSize(width, height);
        this.rulerAreaView.setRulerAreaSize(width, height, rulerAreaWidth);
    }

}