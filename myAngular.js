var myapp = angular.module('myapp', []);

myapp.controller('MainCtrl', function ($scope) {
    $scope.showContent = function($fileContent){
        $scope.content = $fileContent;
    };
  });

myapp.directive('onReadFile', function ($parse) {
	return {
		restrict: 'A',
		scope: false,
		link: function(scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);
            
			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						fn(scope, {$fileContent:onLoadEvent.target.result});

						var txt = onLoadEvent.target.result;
						processData (txt);
					});
				};

				reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);

			});
		}
	};
});

function processData (txt) {
	var allTextLines = txt.split('\r\n');
	var mowerIndex = 1;

	if(allTextLines.length<3 || allTextLines.length%2==0) {
		console.log('File content incorrect !!');	
	}else {

		var corners = processFirstLine (allTextLines[0]);

		for (var i = 1; i < allTextLines.length; i++) {
			var row = allTextLines[i];	
			var mower = processPositionLine (row, mowerIndex, corners);
			processCommandLine (allTextLines[++i], mower);
			mowerIndex++;	
		}
	} 
}

function processFirstLine (row) {
	var row = row.split (' ');
	var col = [];

	for (var j = 0; j < row.length; j++) {
		col.push (row[j]);
	}
	
	console.log ("Upper Right Corner of the lawn : " + col[0] + " , " +col[1]);
	console.log("*****************************************************");

	return col;
}

function processPositionLine (row, mowerIndex, corners) {
	var row = row.split (' ');
	var col = [];

	for (var j = 0; j < row.length; j++) {
		col.push (row[j]);
	}
	var mower = {ID : mowerIndex, X : col[0], Y : col[1] , P : col[2], CornerX : corners[0] , CornerY : corners[1]}
	console.log ("Position Line of Mower N° " + mower.ID + " : " + mower.X + " , " + mower.Y + " , " + mower.P);	
	console.log ("Corners Mower N° " + mower.ID + " : " + "CornerX = " + mower.CornerX + " CornerY = " + mower.CornerY);

	return mower;
}

function processCommandLine (row, mower) {
	var row = row.split (' ');
	var col = [];
	var final = [];

	console.log ("Command Line of Mower N° " + mower.ID + " : " + row);

	for (var j = 0; j < row.length; j++) {
		var command = row[j];

		switch(command) {
			case "G" : AGauche(mower); break;
			case "D" : ADroite(mower); break;
			case "A" : Avancer(mower); break;
		}
	}

	console.log ("Final Position of Mower N° " + mower.ID + " : " + mower.X + " , " + mower.Y + " , " + mower.P);
	console.log("*****************************************************");
}

function AGauche(mower) {
	switch(mower.P) {
			case "N" : mower.P = 'E'; break;
			case "S" : mower.P = 'O'; break;
			case "E" : mower.P = 'S'; break;
			case "O" : mower.P = 'N'; break;
	}
}

function ADroite(mower) {
	switch(mower.P) {
			case "N" : mower.P = 'O'; break;
			case "S" : mower.P = 'E'; break;
			case "E" : mower.P = 'N'; break;
			case "O" : mower.P = 'S'; break;
	}
}

function Avancer(mower) {
	switch(mower.P) {
			case "N" : if(mower.Y<mower.CornerY) mower.Y++; break;
			case "S" : if(mower.Y>0) mower.Y--; break;
			case "E" : if(mower.X>0) mower.X--; break;
			case "O" : if(mower.X<mower.CornerX) mower.X++; break;
	}
}