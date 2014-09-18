define(["backbone", "common/Events", "template!car-insert-edit-view", "models/CarModel", "collections/ModelsOfCarCollection", "views/ManufacturerView", "views/ModelOfCarView", "jquery", "jquery-ui", "icheck"], function(Backbone, Events, template, CarModel, ModelsOfCarCollection, ManufacturerView, ModelOfCarView, $) {
    var CarInsertEditView = Backbone.View.extend({
        el: ".car-insert-edit-container",

        template: template,
        model: null,
        modelCopy: null,

        initialize: function(options) {

            var that = this;
            _.bindAll(this, "addModelEventHandler",
                "clearModelEventHandler",
                "cancelModelEventHandler",
                "saveModelEventHandler",
                "handleFileSelectEventHandler",
                "initializeEventHandlers");

            if (options.model) {
                this.stopListening();
                this.model = options.model;
                this.isEditMode = true;
            } else {
                this.model = new CarModel();
            }

            this.manufacturersCollection = options.manufacturersCollection;
            this.render();
            this.initThirdParty();

            this.initModelEventHandlers();

            if (this.isEditMode) {
                this.initEditMode();
            }

            this.initializeEventHandlers();
        },

        render: function() {
            this.$el.html(this.template());

            var manufacturerView = new ManufacturerView({
                el: $("#manufacturer"),
                collection: this.manufacturersCollection
            });
            var modelOfCarView = new ModelOfCarView({
                el: $("#modelOfCar"),
                collection: new ModelsOfCarCollection()
            });
            manufacturerView.modelOfCarView = modelOfCarView;

            for (var attribute in this.model.attributes) {
                if (this.model.attributes.hasOwnProperty(attribute)) {
                    this[attribute] = this.$("#" + attribute);
                }
            }

            return this;
        },

        initThirdParty: function() {
            var that = this;
            this.$(".datepicker").monthYearPicker();
            // this.$("input[type=checkBox]").iCheck({
            //     checkboxClass: 'icheckbox_square-grey modelPropertyChange'
            // });
        },

        initializeEventHandlers: function() {
            var that = this;

            this.$('.modelPropertyInput').off("input.ciew").on("input.ciew", function(e) {
                if (!that.isInitEditMode) {
                    that.change.call(this, e, that);
                }
            });

            this.$('.modelPropertyChange').off("change.ciew").on("change.ciew", function(e) {
                if (!that.isInitEditMode) {
                    that.change.call(this, e, that);
                }
            });

            this.$el.off("blur.ciew").on("blur.ciew", ".modelPropertyBlur", function(e) {
                var elContext = this;
                setTimeout(function() {
                    that.change.call(elContext, e, that);
                }, 100)
            });

            this.$("#addButton").off('click.ciev').on("click.ciev", this.addModelEventHandler);
            this.$("#clearButton").off('click.ciev').on("click.ciev", this.clearModelEventHandler);
            this.$("#saveButton").off('click.ciev').on("click.ciev", this.saveModelEventHandler);
            this.$("#cancelButton").off('click.ciev').on("click.ciev", this.cancelModelEventHandler);
            this.$("#photo").off('change.ciev').on("change.ciev", this.handleFileSelectEventHandler);
        },

        initModelEventHandlers: function() {
            var that = this;

            this.listenTo(this.model, 'validated', this.modelValidated);
            this.listenTo(this.model, 'change', this.modelChanged);

            Events.off("destroy.ciev").on("destroy.ciev", function(e, model) {
                if (model == that.model) {
                    that.newModel();
                }
            });

            Events.off("beforeEdit.ciev").on("beforeEdit.ciev", function() {
                that.cancelModel();
            });
        },

        initEditMode: function() {
            var that = this;

            this.isInitEditMode = true;

            this.modelCopy = JSON.stringify(this.model);
            this.model.trigger("change", null, { 'isInitEditMode':  this.isInitEditMode });

            this.$(".insert-controls").hide();
            this.$(".edit-controls").show();
            if (this.model.get('photoData')) {
                this.loadPhoto(this.model.get('photo'), this.model.get('photoData'), this.isInitEditMode);
            }

            this.$("#saveButton").attr("disabled", "disabled");

            that.isInitEditMode = false;
        },

        modelValidated: function(errors) {
            var that = this;

            for (var attribute in this.model.attributes) {
                if (this.model.attributes.hasOwnProperty(attribute)) {
                    that[attribute].attr("validation", "valid");
                }
            }

            if (errors.length === 0) {
                $("#addButton, #saveButton").removeAttr("disabled");
            } else {
                $("#addButton, #saveButton").attr("disabled", "true");

                errors.forEach(function(err) {
                    that[err.propName].attr("validation", "not-valid");
                })
            }
        },

        modelChanged: _.debounce(function(e, options) {
            var that = this,
                formKeyValues = {};
            for (var attribute in this.model.attributes) {
                if (this.model.attributes.hasOwnProperty(attribute)) {
                    if (this[attribute].attr('type') === "checkBox") {
                        formKeyValues[attribute] = this[attribute].prop('checked');
                    } else {
                        formKeyValues[attribute] = this[attribute].val();
                    }
                }
            }

            for (var key in formKeyValues) {
                if (this.model.get(key) !== formKeyValues[key]) {
                    if (this[key].attr('type') === "checkBox") {
                        this[key].prop('checked', this.model.get(key));
                    } else  {
                        if (this[key].attr('type') === "file") {
                            if (!this.model.get(key)) {
                                this[key].val("");
                            }
                        } else {
                            this[key].val(this.model.get(key));
                        }
                    }

                    if (key === "manufacturer" && options && options.isInitEditMode === true) {
                        this["modelOfCar"].one("loaded", function() {
                            that["modelOfCar"].val(JSON.parse(that.modelCopy)['modelOfCar']);
                        });
                        this["manufacturer"].trigger("change");
                    }
                }
            }

        }, 100),

        change: function(e, obj) {
            var $el = $(this),
                modelPropName = $el.attr("data-modelName"),
                propValue = null;

            if (obj[modelPropName].attr('type') === "checkBox") {
                propValue = obj[modelPropName].prop('checked');
            } else {
                propValue = obj[modelPropName].val();
            }

            var newProp = {};
            newProp[modelPropName] = propValue;
            obj.model.set(newProp);

            if (modelPropName === 'manufacturer') {
                var newProp = {};
                newProp['modelOfCar'] = null;
                obj.model.set(newProp);
            }

            Events.trigger("change", obj.model);
        },

        addModelEventHandler: function(e) {
            e.preventDefault();

            var photoData = null,
                carModel = this.model;

            photoData = this.$('#carPhoto img').attr("src");

            carModel.set({
                'order': this.collection.nextOrder()
            });
            carModel.set({
                'photoData': photoData
            });

            this.newModel(carModel);
        },

        clearModelEventHandler: function(e) {
            e.preventDefault();

            this.clearModel();
        },

        saveModelEventHandler: function(e) {
            e.preventDefault();
            this.saveModel();
        },

        saveModel: function() {
            var photoData = this.$('#carPhoto img').attr("src");
            this.model.set({
                'photoData': photoData
            });

            this.model.collection = this.collection;
            Backbone.sync("update", this.model);
            this.newModel();
        },

        cancelModelEventHandler: function(e) {
            e.preventDefault();
            this.cancelModel();
        },

        cancelModel: function() {
            Events.trigger("cancel");
            this.collection.fetch();
            this.newModel();
        },

        newModel: function(carModel) {
            this.stopListening();
            if (carModel) {
                this.collection.create(carModel);
            }

            this.model = new CarModel();
            this.initModelEventHandlers();

            this.clearModel();

            if (this.isEditMode) {
                this.$el.find(".insert-controls").show();
                this.$el.find(".edit-controls").hide();
                this.isEditMode = false;
            }
        },

        clearModel: function() {
            this.model.clear().set(this.model.defaults);
            this['modelOfCar'].attr('disabled', true);

            this.$el.find('#carPhoto .thumbWrapper').remove();
        },

        handleFileSelectEventHandler: function(evt) {
            var that = this,
                file = evt.target.files[0];

            if (!file || !file.type.match('image.*')) {
                return;
            }

            var reader = new FileReader();

            reader.onload = (function(theFile) {
                return function(e) {
                    that.loadPhoto.call(that, theFile.name, e.target.result);
                };
            })(file);

            reader.readAsDataURL(file);
        },

        loadPhoto: function(fileName, data, isInitEditMode) {
            var that = this,
                $thumb = $("<span class='thumbWrapper'><img class='thumb' src='" +
                    data +
                    "' title='" +
                    escape(fileName) +
                    "'/><button class='destroy'>X</button></span>");

            $thumb.on("click", function(e) {
                e.preventDefault();
                var $el = $(this);
                $el.closest('.controls')
                    .find('input').val("").trigger('change')
                    .end()
                    .find('.thumbWrapper').html("");
            })

            this.$('#carPhoto').html($thumb);

            if (!isInitEditMode) {
                this.model.trigger('change');
            }
        }
    });

    return CarInsertEditView;
});