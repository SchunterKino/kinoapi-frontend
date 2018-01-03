import * as $ from "jquery";

let acceptCallback: () => void;

const dialog = $(`
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

const hide = () => {
  dialog.modal("hide");
};

dialog.find("#accept").click((event) => {
  hide();
  acceptCallback();
});

dialog.find("#cancel").click(hide);

export default {
  show: (message: string, accept: () => void) => {
    acceptCallback = accept;
    dialog.find(".dialog-message").text(message);
    dialog.modal("show");
  },
  isVisible: () => dialog.is(":visible"),
  hide
};
