const dialog = $(`
  <div class="dialog modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-m">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="dialog-message"></h3>
        </div>
        <div class="modal-body">
          <form class="form-inline">
            <div class="form-group user-group">
              <label class="sr-only" for="user">Benutzer</label>
              <input type="text" class="form-control" id="user" placeholder="Benutzer">
            </div>
            <div class="form-group password-group">
              <label class="sr-only" for="password">Passwort</label>
              <input type="password" class="form-control" id="password" placeholder="Passwort">
            </div>
            <button type="button" class="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
`);

const message = "Bitte anmelden";
const failedMessage = "Name oder Kennwort ist nicht korrekt";
let loginCallback;
export default {
  show: (error: boolean) => {
    dialog.find(".dialog-message").text(error ? failedMessage : message);
    dialog.find(".user-group").toggleClass("has-error", error);
    dialog.find(".password-group").toggleClass("has-error", error);
    dialog.modal("show");
  },
  hide: () => dialog.modal("hide"),
  onLogin: (callback) => loginCallback = callback
};

dialog.find("button").click(() => {
  const user = dialog.find("#user").val();
  const password = dialog.find("#password").val();
  loginCallback(user, password);
});

dialog.find("#user").keyup(() => {
  dialog.find(".user-group").removeClass("has-error");
  dialog.find(".password-group").removeClass("has-error");
});
