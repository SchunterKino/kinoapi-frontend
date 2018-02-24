import * as $ from "jquery";
import { ErrorCode } from "../api";

export class LoginDialog {
  private loginCallback: (password: string) => void;
  private dialog: JQuery<HTMLElement> = $(`
    <div class="dialog modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-m">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="dialog-message"></h3>
          </div>
          <div class="modal-body">
            <form class="form-inline" id="form">
              <div class="form-group password-group">
                <label class="sr-only" for="password">Passwort</label>
                <input type="password" class="form-control" id="password" placeholder="Passwort">
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `);

  public constructor(private errorMessages: { [errorCode: number]: string }) {
    this.dialog.find("#form").submit((event) => {
      event.preventDefault();
      const password = this.dialog.find("#password").val();
      this.hide();
      this.loginCallback(password.toString());
    });
    this.dialog.find("#password").keyup(() => {
      this.dialog.find(".password-group").removeClass("has-error");
    });
  }

  public show(error: ErrorCode, onLogin: (password: string) => void) {
    this.loginCallback = onLogin;
    this.dialog.find(".dialog-message").text(this.errorMessages[error]);
    this.dialog.find(".password-group").toggleClass("has-error", error === ErrorCode.UNAUTHORIZED);
    $(".modal-backdrop").remove();
    this.dialog.modal("show");
  }

  public hide() {
    this.dialog.modal("hide");
  }

  public isVisible(): boolean {
    return this.dialog.is(":visible");
  }
}

export default new LoginDialog({
  [ErrorCode.UNAUTHORIZED]: "Kennwort ist nicht korrekt.",
  [ErrorCode.INVALID_TOKEN]: "Bitte anmelden.",
  [ErrorCode.SESSION_EXPIRED]: "Session ist abgelaufen. Bitte erneut anmelden.",
  [ErrorCode.AUTH_ERROR]: "Konnte nicht einloggen. Versuche es später erneut.",
});
