define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        MainView = require("views/MainView"),
        $ = require("jquery");

    var Router = Backbone.Router.extend({
        routes: {
            "": "index"
        },

        index: function() {
            $(".main-back-img").animate({
                opacity: 0
            }, 500, function() {
                new MainView();
                $(".main-view-wrapper").animate({opacity: 1}, 500);
            });
        }
    });

    module.exports = Router;
});