define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone");

    var CarModel = Backbone.Model.extend({

        defaults: {
            photo: null,
            manufacturer: null,
            modelOfCar: null,
            dateOfManufacture: null,
            inStock: true,
            licensePlate: null,
            geoLocationLong: null,
            geoLocationLat: null,
            photoData: null,
            order: null
        },
        initialize: function() {
            this.bind("change", this.attributesChanged);
        },
        attributesChanged: function(e) {
            var that = this,
                required = ["manufacturer", "modelOfCar", "licensePlate", "geoLocationLong", "geoLocationLat"],
                number = ["geoLocationLong", "geoLocationLat"],
                errors = [],
                licansePlateRegexPattern = /[a-zA-Z]{1,2}\d{4}[A-Za-z0-9]{1,2}$/g,
                errObj;

            if(!licansePlateRegexPattern.test(that.get("licensePlate"))) {
                errObj = {};
                errObj.propName = "licensePlate";
                errObj.errMsg = "Invalid license number";
                errors.push(errObj);
            }
            number.forEach(function(propName) {
                var propValue = that.get(propName);
                if(isNaN(propValue)) {
                    errObj = {};
                    errObj.propName = propName;
                    errObj.errMsg = "Not a number";

                    errors.push(errObj);
                }
            })
            required.forEach(function(propName) {
                if(!that.get(propName)) {
                    errObj = {};
                    errObj.propName = propName;
                    errObj.errMsg = "Required Field";

                    errors.push(errObj);
                }
            })

            this.trigger("validated", errors);
        }
    });

    module.exports = CarModel;
});