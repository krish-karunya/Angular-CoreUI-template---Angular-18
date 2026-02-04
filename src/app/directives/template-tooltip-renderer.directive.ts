import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  OnInit,
  HostListener,
  ComponentRef,
  OnDestroy,
} from "@angular/core";
import {
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from "@angular/cdk/overlay";
import { TemplateTooltipComponent } from "../controls/template-tooltip/template-tooltip.component";
import { ComponentPortal } from "@angular/cdk/portal";

@Directive({
  selector: "[templateTooltip]",
})
export class TemplateTooltipRendererDirective {
  @Input("templateTooltip") text: string = "";
  @Input() contentTemplate!: TemplateRef<any>;

  private _overlayRef!: OverlayRef;

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
  ) {}

  ngOnInit() {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPositions([
        {
          originX: "center",
          originY: "bottom",
          overlayX: "center",
          overlayY: "top",
          offsetY: 5,
        },
      ]);

    this._overlayRef = this._overlay.create({ positionStrategy });
  }

  @HostListener("mouseenter")
  show() {
    //attach the component if it has not already attached to the overlay
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<TemplateTooltipComponent> =
        this._overlayRef.attach(new ComponentPortal(TemplateTooltipComponent));
      tooltipRef.instance.text = this.text;
      tooltipRef.instance.contentTemplate = this.contentTemplate;
    }
  }

  @HostListener("mouseleave")
  hide() {
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
  }

  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
