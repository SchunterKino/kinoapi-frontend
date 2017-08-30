const dialog = $(`
  <div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">
    <div class="modal-dialog modal-m">
      <div class="modal-content">
        <div class="modal-header"><h3 style="margin:0;"></h3></div>
        <div class="modal-body">
          <div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>
        </div>
      </div>
    </div>
  </div>
`)

module.exports = {
  show: (message) => {
    dialog.find('h3').text(message)
    dialog.modal('show')
  },
  hide: () => dialog.modal('hide')
}
