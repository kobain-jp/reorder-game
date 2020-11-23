(function (window) {
    'use strict';

    function ReorderGame() {
        this.model = new window.app.Model();
        this.view = new window.app.View();
        this.controller = new window.app.Controller(this.model, this.view);

    }

    var app = new ReorderGame('todos-vanillajs');
    app.controller.init();


})(window);