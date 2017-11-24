import * as $ from "jquery";

const dialog = $(`
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

export default {
  show: (message: string) => {
    dialog.find(".dialog-message").text(message);
    dialog.modal("show");
  },
  hide: () => {
    dialog.modal("hide");
    $(".modal-backdrop").remove();
  },
  isVisible: () => dialog.is(":visible")
};
