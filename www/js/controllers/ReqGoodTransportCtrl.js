﻿(function () {

    app.controller('ReqGoodTransportCtrl', ReqGoodTransportCtrl);
    ReqGoodTransportCtrl.$inject = ['$scope', '$stateParams', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', '$controller', 'Books', '$state', 'ErrorMng', '$sce', '$ionicPopup', 'Events', 'ionicDatePicker'];

    function ReqGoodTransportCtrl($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, $controller, Books, $state, ErrorMng, $sce, $ionicPopup, Events, ionicDatePicker) {
        
        var vm = this;

        vm.booksLoaded = false;
        vm.bestSellersBooksLoaded = false;
        vm.booksDetailsLoaded = false;

        /* all document table data */
        vm.heartBooks = []; 
        vm.bestSellersBooks = [];
        vm.pocheDuMois = {};

        /* Link to pax global object to allow binding to the view */
        vm.coGlobal = coGlobal;

        vm.setMotion = function () {

            // Set Motion
            //$timeout(function () {
            //    ionicMaterialMotion.slideUp({
            //        selector: '.slide-up'
            //    });
            //}, 100);
            
            $timeout(function () {
                ionicMaterialMotion.blinds({
                    startVelocity: 3000
                });
            }, 100);
        }; 

        /* Load all heart books */ 
        vm.loadHeartBooks = function () {
            // If data has not been loaded yet, then load it from server
            if (Books.booksLoaded === false) {
                vm.loadBooks(); 
            } else { 
                vm.heartBooks = Books.heartBooks;
                vm.pocheDuMois = Books.pocheDuMois;
                vm.setMotion();

            };
        }; 

        /* Load all books data from server */
        vm.loadBooks = function () {
            Books.GetBooks(coGlobal.BookListTypeEnum.HEART).then(
                function (result) {
                    if (result.operationResult === true) {
                        /* service state */
                        Books.heartBooks = result.resultData.booksList;
                        Books.pocheDuMois = result.resultData.monthBook;
                        Books.booksLoaded = true;
                        /* vm state */
                        vm.booksLoaded = Books.booksLoaded;
                        vm.heartBooks = Books.heartBooks;
                        vm.pocheDuMois = Books.pocheDuMois;
                        vm.setMotion();

                    } else {
                        // handle error here
                        ErrorMng.showSystemError(result.msg);
                    };
                },
                function (error) { 
                    // handle error here
                    ErrorMng.showSystemError(error.msg ? error.msg : error);
                });
        };

        /* Load all details for heart books */
        vm.loadDetailsForHeartBooks = function () {
            // If data has not been loaded yet, then load it from server
            if (Books.detailsForHeartBooksLoaded === false) {
                Books.getDetailsForHeartBooks();
            };
        };

        /* Load all best sellers books */
        vm.loadBestSellers = function () {
            // If data has not been loaded yet, then load it from server
            if (Books.bestSellersBooksLoaded === false) {
                vm.loadBestSellersBooks();
            } else {
                vm.bestSellersBooks = Books.bestSellersBooks;
                //vm.setMotion();

            };
        };

        /* Load all events data from server */
        vm.loadEventsFromServer = function () {
            Events.GetEvents().then(
                function (result) {
                    if (result.operationResult === true) {
                        Events.heartEvents = result.resultData.events;
                        Events.eventsLoaded = true;

                    } else {
                        // handle error here
                        ErrorMng.showSystemError(result.msg);
                    };
                },
                function (error) {
                    // handle error here
                    ErrorMng.showSystemError(error.msg);
                });
        };

        /* Load all events */
        vm.loadEvents = function () {
            // If data has not been loaded yet, then load it from server
            if (Events.eventsLoaded != true) {
                vm.loadEventsFromServer();
            };
        };

        /* Load all books data from server */ 
        vm.loadBestSellersBooks = function () {
            Books.GetBooks(coGlobal.BookListTypeEnum.BEST_SELLERS).then(
                function (result) {
                    if (result.operationResult === true) {
                        /* service state */
                        Books.bestSellersBooks = result.resultData.booksList;
                        Books.bestSellersBooksLoaded = true;
                        /* vm state */
                        vm.bestSellersBooksLoaded = Books.bestSellersBooksLoaded;
                        vm.bestSellersBooks = Books.bestSellersBooks;
                        //vm.setMotion();

                    } else {
                        // handle error here
                        ErrorMng.showSystemError(result.msg);
                    };
                },
                function (error) {
                    // handle error here
                    ErrorMng.showSystemError(error.msg);
                });
        };

        /* Go to details book */
        vm.goToBookDetails = function (book) {            
            /* First set current book */
            Books.currentBook = book;
            $state.go('app.book-details');
        };

        /* Execute search books and go to results list */
        vm.goToSearchBookResults = function () {
            /* First set service searchBook key */
            Books.searchBookKey = vm.searchBookKey;
            $state.go('app.search-book-results');
        };

        /* Go to 'Poche du mois' page */
        vm.goToPocheDuMois = function () { 
            /* First set current book */
            Books.currentBook = vm.pocheDuMois;
            Books.currentBook.isPocheDuMois = true;
            $state.go('app.book-details');
        };

        /* Load all heart books */
        vm.loadDetailsOfHeartBooks = function () {
            // If data has not been loaded yet, then load it from server
            if (Books.booksLoaded === false) {
                vm.loadBooks();
            } else {
                vm.heartBooks = Books.heartBooks;
            };
        };

        vm.initAllIsLoadedFlags = function () {
            Books.booksLoaded = false;
            Books.detailsForHeartBooksLoaded = false;
            Books.bestSellersBooksLoaded = false;
            Events.eventsLoaded = false;
        };

        /* Address Autocomplete callback initialization */
        vm.initAutocomplete = function () {
            // Search filter FROM - Create the autocomplete object
            vm.autocompleteFrom = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('req-filter-from')),
                { types: ['geocode'] });

            // Search filter TO - Create the autocomplete object
            vm.autocompleteTo = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(document.getElementById('req-filter-to')),
                { types: ['geocode'] });
        }




        vm.datepickerDate = {
            callback: function (val) {  //Mandatory
                console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            },
            disabledDates: [            //Optional
              new Date(2016, 2, 16),
              new Date(2015, 3, 16),
              new Date(2015, 4, 16),
              new Date(2015, 5, 16),
              new Date('Wednesday, August 12, 2015'),
              new Date("08-16-2016"),
              new Date(1439676000000)
            ],
            from: new Date(2012, 1, 1), //Optional
            to: new Date(2016, 10, 30), //Optional
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            disableWeekdays: [0],       //Optional
            closeOnSelect: false,       //Optional
            templateType: 'popup'       //Optional
        };

        vm.openDatePicker = function () {
            ionicDatePicker.openDatePicker(vm.datepickerDate);
        };



        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/
        /*  ------------------------------------------------------     INIT FUNCTIONS     ------------------------------------------------------*/
        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/


        /* Init controller function */
        vm.initController = function () {
            /* If a notification comes occurred, then reset all 'isLoaded' flags 
             * in order to force the app to reload data from the server */
            if (coGlobal.NotificationOccurred === true) {
                vm.initAllIsLoadedFlags();
                coGlobal.NotificationOccurred = false;
            };
            vm.initAutocomplete();
            vm.loadHeartBooks();
            vm.loadDetailsForHeartBooks();
            vm.loadBestSellers();
            vm.loadEvents();
        };

        /* Call init controller */
        vm.initController();

        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/
        /*  ------------------------------------------------------  STYLE - Animations - Headers  ------------------------------------------------------*/
        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

//        // Set Motion
//        $timeout(function () {
//            ionicMaterialMotion.slideUp({
//                selector: '.slide-up'
//            });
//        }, 10000);
//
//        $timeout(function () {
//            ionicMaterialMotion.fadeSlideInRight({
//                startVelocity: 3000
//            });
//        }, 10000);

        // Set Ink
        ionicMaterialInk.displayEffect();

        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/
        /*  ------------------------------------------------------  STYLE - Animations - Headers  ------------------------------------------------------*/
        /*  --------------------------------------------------------------------------------------------------------------------------------------------*/

    };

})();