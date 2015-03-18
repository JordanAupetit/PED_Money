(function() {
    'use strict';


    angular.module('appModule')
        .directive('mydatepicker', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).datepicker({dateFormat:'yy-mm-dd'})
                }
            };
        })

        .directive('tooltip', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).tooltip()
                }
            };
        })

        .directive('btnAddOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $('#sidebar-wrapper-right').animate({ 'right': '0' }, 'slow' );
                    });
                }
            };
        })

        .directive('closeMenuCreateOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $('#sidebar-wrapper-right').animate({ 'right': '-350px' }, 'slow' );
                    });
                }
            };
        })

        .directive('showSidebarMenu', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $('#sidebar-wrapper-left').animate({ 'left': '0' }, 'slow' );
                    });
                }
            };
        })

        .directive('hideSidebarMenu', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $('#sidebar-wrapper-left').animate({ 'left': '-300px' }, 'slow' );
                    });
                }
            };
        })

        .directive('buttonCheckbox', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    $(element).click(function() {
                        $(this).find('input').click();
                    });
                }
            };
        })

        .directive('hoverOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {

                    /*var btns = $(element).find('.operationButtons')
                    btns.hide()

                    $(element).hover(function() {
                        $(btns).parent().find("span.valueSpan").removeClass("wid100p")
                        $(btns).parent().find("span.valueSpan").addClass("wid50p")
                        btns.show()
                    },
                    function(){
                        $(btns).parent().find("span.valueSpan").addClass("wid100p")
                        $(btns).parent().find("span.valueSpan").removeClass("wid50p")
                        btns.hide()
                    })*/
                }
            };
        })

        .directive('clickOperation', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {
                    
                    $(element).find(".firstLineOperation").click(function() {
                        var infos = $(element).find(".otherLineOperation")
                        var thisLine = $(element).parent()
                        var height = thisLine.css("height")

                        $(".otherLineOperation").hide()
                        $(".operationLine").css("height", "50px")

                        if(height === "50px") {
                            infos.show()
                            thisLine.css("height", "100%")
                        } else {
                            infos.hide()
                            thisLine.css("height", "50px")
                        }
                    });

                    // On cache toutes les infos sup des operations
                    $(".otherLineOperation").hide()
                }
            };
        })

        .directive('onReadFile', function ($parse) {
            return {
                restrict: 'A',
                scope: false,
                link: function(scope, element, attrs) {
                    var fn = $parse(attrs.onReadFile);

                    // Style input file
                    $(".importCsv > div > input[type=file]").filestyle(
                        {
                            buttonText: "Choose a CSV file",
                            icon: false
                        }
                    )
         
                    element.on('change', function(onChangeEvent) {
                        var reader = new FileReader();
             
                        reader.onload = function(onLoadEvent) {
                            scope.$apply(function() {
                                fn(scope, {$fileContent:onLoadEvent.target.result});
                            });
                        };
             
                        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);

                        // Reset l'input file
                        //element.closest('form').get(0).reset()
                    });
                }
            };
        })

        .directive('buttonImportCsvToApp', function () {
            return {
                restrict: 'AE',
                replace: false,
                transclude: false,
                link: function (scope, element, attrs) {

                    $(element).click(function(){
                        // Reset l'input file
                        element.closest('form').get(0).reset()
                    })
                }
            };
        })

})();






