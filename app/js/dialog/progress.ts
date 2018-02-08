import * as $ from "jquery";

export class ProgressDialog {
  private dialog: JQuery<HTMLElement> = $(`
    <div class="dialog modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-m">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="dialog-message"></h3>
          </div>
          <div class="modal-body">
            <div class="progress progress-striped active">
              <div class="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  public show(message: string) {
    this.dialog.find(".dialog-message").text(message);
    this.dialog.modal("show");
  }

  public hide() {
    this.dialog.modal("hide");
  }

  public isVisible() {
    this.dialog.is(":visible");
  }
}

export default new ProgressDialog();
