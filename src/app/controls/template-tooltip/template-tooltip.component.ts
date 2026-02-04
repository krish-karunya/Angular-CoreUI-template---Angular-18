import { Component, OnInit, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'template-tooltip',
  templateUrl: './template-tooltip.component.html',
  styleUrls: ['./template-tooltip.component.css'],
})
export class TemplateTooltipComponent implements OnInit {
  @Input() text!: string;
  @Input() contentTemplate!: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}
