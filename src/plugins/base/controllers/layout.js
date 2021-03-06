angular.module('app')
    .controller('app.layout', ['$scope', '$stateParams', '$location', 'settings', 'utils',
        function ($scope, $stateParams, $location, settings, utils) {


            utils.async("GET", settings.menuApi, {}).then(function (res) {

                var data = res.body;
                if (!angular.isArray(data)) {
                    data = data.items;
                }
                var menus = data.sort(function (a, b) {
                    return a.order - b.order;
                });

                $scope.menus = utils.menus.initMenus(settings.menuRoot, menus);

                if ($scope.menus.length) {
                    var uri = $location.path().split('/').slice(1);
                    if (uri[0] === 'dashboard') {
                        $scope.menus[0].expanded = true;
                    }
                    else {
                        $scope.menus.forEach(function (menu) {
                            if (menu.tag == uri[0]) {
                                menu.expanded = true;
                            }
                            else if (menu.expanded == true) {
                                menu.expanded = false;
                            }
                        });
                    }
                }

                $scope.menusCache = utils.menus.buildMenuTree(menus);

            });

            $scope.onSelect = function ($item, $model, $label) {
                //var hash = $item.url;
                location.hash = $item.url;
            };

            $scope.getMenus = function (value) {

                return $scope.menusCache.filter(function (raw) {
                    return raw.label.contains(value);
                });
            };

            $scope.displayName = localStorage.getItem("displayName");
            $scope.action = {
                logout: function () {
                    utils.async("GET", "logout").then(function (res) {
                        localStorage.removeItem("displayName");
                        location.reload();
                    }, function (error) {
                        location.reload();
                    });
                }
            };


        }]);

