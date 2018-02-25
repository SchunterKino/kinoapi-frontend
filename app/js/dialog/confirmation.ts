import * as $ from "jquery";

export class ConfirmationDialog {
  private acceptCallback: () => void;
  private dialog: JQuery<HTMLElement> = $(`
    <div class="dialog modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-m">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="dialog-message"></h3>
          </div>
          <div class="modal-body from-inline">
            <button id="accept" class="btn btn-primary">Ok</button>
            <button id="cancel" class="btn btn-default">Abbrechen</button>
          </div>
        </div>
      </div>
    </div>
  `);

  public constructor() {
    this.dialog.find("#cancel").click(() => this.hide());
    this.dialog.find("#accept").click((event) => {
      this.hide();
      this.acceptCallback();
    });
  }

  public show(message: string, accept: () => void) {
    this.acceptCallback = accept;
    this.dialog.find(".dialog-message").text(message);
    if (!this.isVisible()) {
      $(".modal-backdrop").remove();
      this.dialog.modal("show");
    }
  }

  public hide() {
    if (this.isVisible()) {
      this.dialog.modal("hide");
    }
  }

  public isVisible(): boolean {
    return this.dialog.is(":visible");
  }
}

export default new ConfirmationDialog();
