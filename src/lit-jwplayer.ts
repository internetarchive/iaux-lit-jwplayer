import { LazyLoaderService } from '@internetarchive/lazy-loader-service';
import {
  html,
  LitElement,
  TemplateResult,
  internalProperty,
  customElement,
  property,
  PropertyValues,
} from 'lit-element';
import { jwplayer } from './types/jwplayer';
import type { JWPlayer } from './types/jwplayer';

@customElement('lit-jwplayer')
export class LitJWPlayer extends LitElement {
  @property({ type: String })
  jwPlayerScriptUrl?: string;

  @property({ type: String })
  playlistUrl?: string;

  @property({ type: String })
  fileUrl?: string;

  @internalProperty()
  private videoIdentifier = `${Math.random()}`.replace('.', '');

  private jwPlayerInstance?: JWPlayer;

  private lazyLoaderService = new LazyLoaderService();

  firstUpdated(): void {
    this.setupJWPlayer();
  }

  render(): TemplateResult {
    return html`
      <div
        id="${this.videoContainerIdentifier}"
        class="jw-player-container"
      ></div>

      ${this.styles}
    `;
  }

  updated(changedProps: PropertyValues): void {
    if (changedProps.has('jwPlayerScriptUrl')) {
      this.setupJWPlayer();
    }

    if (changedProps.has('playlistUrl')) {
      this.playPlaylist();
    }

    if (changedProps.has('fileUrl')) {
      this.playFile();
    }
  }

  private async playPlaylist(): Promise<void> {
    if (!this.playlistUrl) return;
    await this.setupJWPlayer();
    this.jwPlayerInstance?.setup({
      playlist: this.playlistUrl,
    });
  }

  private async playFile(): Promise<void> {
    if (!this.fileUrl) return;
    await this.setupJWPlayer();
    this.jwPlayerInstance?.setup({
      file: this.fileUrl,
    });
  }

  private async setupJWPlayer(): Promise<void> {
    if (this.jwPlayerInstance || !this.jwPlayerScriptUrl) return;

    await this.lazyLoaderService.loadScript({
      src: this.jwPlayerScriptUrl,
    });

    this.jwPlayerInstance = jwplayer(this.videoContainerIdentifier);
  }

  private get videoContainerIdentifier(): string {
    return `lit-sjwplayer-${this.videoIdentifier}`;
  }

  /**
   * JWPlayer does not work in the ShadowRoot so this component
   * needs to be in the LightDOM for it to work.
   *
   * Setting createRenderRoot to `this` makes the component use the
   * LightDOM.
   */
  /** @inheritdoc */
  createRenderRoot(): this {
    // Render template without shadow DOM. Note that shadow DOM features like
    // encapsulated CSS and slots are unavailable.
    // We have to do this to accomodate the PayPal buttons and HostedFields,
    // which do not work in the shadow DOM
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  private get styles(): TemplateResult {
    return html`
      <style>
        video-player {
          display: block;
        }
      </style>
    `;
  }
}
