import { customElement, html, LitElement, TemplateResult } from 'lit-element';

@customElement('app-root')
export class AppRoot extends LitElement {
  render(): TemplateResult {
    return html`
      <h1>Hello</h1>
      <slot name="video-player"></slot>
    `;
  }
}
