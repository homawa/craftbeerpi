angular.module('craftberpi.controllers2', []).controller('DashBoardController', function($scope, $location, CBPSteps, CBPKettle, ChartFactory, $uibModal, ws) {

  CBPKettle.query(function(data) {
    $scope.kettles = data.objects;
    if ($scope.kettles.length == 0) {
      console.log("SETUP");
      $location.url("/setup");
    }
  });

  CBPSteps.query(function(data) {
    $scope.steps = data.objects;
  });

  CBPKettle.getstate(function(data) {
    $scope.kettle_state = data;
  });

  $scope.getTemp = function(item) {
    if ($scope.kettle_state == undefined) {
      return ""
    } else {
      return $scope.kettle_state[item.id]['temp'];
    }
  }
  $scope.buttonState = function(item, element) {
    var state = false;

    if ($scope.kettle_state[item.id] == undefined) {
      return "btn-default"
    }

    if ($scope.kettle_state[item.id][element] != undefined) {
      if (element == "automatic") {
        state = $scope.kettle_state[item.id]['automatic'];
      } else {
        state = $scope.kettle_state[item.id][element]['state'];
      }

      if (state == true) {
        return "btn-success"
      } else {
        return "btn-default"
      }
    }
  }
  $scope.kettleState = function(vid) {
    if ($scope.steps == undefined) {
      return;
    }
    for (i = 0; i < $scope.steps.length; i++) {
      if ($scope.steps[i].state == "A" && vid == $scope.steps[i].kettleid) {
        return "panel-success"
      }
    }
  }

  $scope.stepStyle = function(item) {
    num_of_kettles = 1;
    if (item.state == "D") {
      return "info";
    }
    else if (item.type == "M" && item.state == "A" && num_of_kettles > 0 && $scope.kettle_temps != undefined && $scope.kettle_temps[item["kettleid"]][1] >= item.temp) {
          return "active"
    } else if (item.state == "A" && item.timer_start != null) {
      return "active"
    } else if (item.state == "A" && item.timer_start == null) {
      return "warning"
    } else
      return "";
  }

  $scope.toTimestamp = function(timer) {
    return new Date(timer).getTime();
  }

  $scope.reset = function() {
    ws.emit("reset");
  }

  $scope.next = function() {
    ws.emit("next");
  }

  $scope.start = function() {
    ws.emit("start");
  }

  $scope.setTargetTemp = function(item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/base/static/partials/dashboard/target_temp.html',
      controller: 'TargetTempController',
      size: "sm",
      resolve: {
        kettle: function() {
          return item
        }
      }
    });

    modalInstance.result.then(function(target_temp) {
      if (target_temp != undefined) {
        ws.emit("kettle_set_target_temp", {
          "kettleid": item.id,
          "temp": target_temp
        });
      }

    }, function() {
      console.log("dismiss");
    });
  };

  $scope.calcVolume = function(item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '/base/static/partials/dashboard/volume.html',
      controller: 'VolumeController',
      size: "sm",
      resolve: {
        kettle: function() {
          return item
        }
      }
    });
    modalInstance.result.then(function(target_temp) {}, function() {
      console.log("dismiss");
    });
  };

  $scope.switch_automatic = function(item) {
    ws.emit("switch_automatic", {
      "vid": item.id
    });
  }

  $scope.switchGPIO = function(item, element) {

    ws.emit("switch_gipo", {
      "vid": item.id,
      "element": element,
      "gpio": item[element],
      "state": true
    });
  }

  $scope.kettle_update = function(data) {
    $scope.kettles = data;
  }

  $scope.kettle_state_update = function(data) {
/*
    console.log(data)
    charts = ChartFactory.get();

    for (var key in data) {
      //console.log(charts[key])
      charts[key].flow({
        columns: [
            ['data1', data[key].temp],
        ],
        length: 1
      });
    }
*/
    $scope.kettle_state = data;
  }
  $scope.step_update = function(data) {
    $scope.steps = data;
  }
  $scope.kettle_automatic_on = function(data) {
    $scope.kettle_state[data].heater.state = true;
  }
  $scope.kettle_automatic_off = function(data) {
    $scope.kettle_state[data].heater.state = false;
  }

  ws.on('kettle_state_update', $scope.kettle_state_update);
  ws.on('kettle_update', $scope.kettle_update);
  ws.on('step_update', $scope.step_update);
  ws.on('kettle_automatic_on', $scope.kettle_automatic_on);
  ws.on('kettle_automatic_off', $scope.kettle_automatic_off);

}).controller('TargetTempController', function($scope, $uibModalInstance, kettle) {

  $scope.target_temp = undefined;
  $scope.kettle = kettle;
  $scope.ok = function() {
    $uibModalInstance.close($scope.target_temp);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}).controller('VolumeController', function($scope, $uibModalInstance, kettle) {

  $scope.free = 0
  $scope.kettle = kettle;

  function Round(v) {
    return ("" + (Math.round(v * 100) / 100)).replace(/\./g, ",");
  }

  $scope.volume = function() {

    var maxHeight = parseFloat($scope.kettle.height);
    var free = parseFloat($scope.free);
    var height = maxHeight - free;
    var radius = parseFloat($scope.kettle.diameter) / 2.0;
    return Round(Math.PI * radius * radius * height / 1000.0);
  }

  $scope.maxvolume = function() {
    console.log(kettle.height)
    var maxHeight = parseFloat($scope.kettle.height);
    var radius = parseFloat($scope.kettle.diameter) / 2.0;
    return Round(Math.PI * radius * radius * maxHeight / 1000.0);
  }

  $scope.ok = function() {
    $uibModalInstance.close($scope.target_temp);
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
});
