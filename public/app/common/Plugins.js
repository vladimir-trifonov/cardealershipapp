require(['jquery'], function( $ ) {
    $.fn.monthYearPicker = function(options) {
        options = $.extend({
            dateFormat: "MM yy",
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            showAnim: ""
        }, options);

        function hideDaysFromCalendar() {
            var thisCalendar = $(this);
            $('.ui-datepicker-calendar').detach();
            $('.ui-datepicker-close').unbind("click").click(function() {
                var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                thisCalendar.datepicker('setDate', new Date(year, month, 1));
            });
        }
        $(this).datepicker(options).focus(hideDaysFromCalendar);
    };
});
