

angular.module('mps.orders')
.controller('OrderContentsController', [
    'grid',
    '$scope',
    '$rootScope',
    'OrderItems',
    'PersonalizationServiceFactory',
    '$location',
    'FormatterService',
    'BlankCheck',
    function(
        GridService,
        $scope,
        $rootScope,
        OrderItems,
        Personalize,
        $location,
        formatter,
        BlankCheck
    ){
    $scope.validationMessages = [];
    if($scope.editable === "true" || $scope.editable === true){
        $scope.showEmpty = true;
    }else{
        $scope.showEmpty = false;
    }

    if($scope.taxable === "true" || $scope.taxable === true){
        $scope.showTax = true;
    }else{
        $scope.showTax = false;
    }

    $scope.$watch($scope.taxable, function(){
        $scope.$broadcast('OrderContentRefresh', {'OrderItems':OrderItems});
    });
    $scope.calculatingTax = $scope.taxLoading;
    $scope.$watch($scope.ordernbr, function(){
        $scope.orderId = $scope.ordernbr;
    });
    $scope.$on('TaxDataAvaialable', function(e,data){
    	
    	$scope.tax = data.tax;
    	$scope.calculate();
    	$scope.calculatingTax = false;
    });
    $scope.removeItem  = function(row){
        var index = $scope.orderSummaryGridOptions.data.indexOf(row.entity);
        $scope.orderSummaryGridOptions.data.splice(index,1);
        var errIndex = getValidationMessageIndex(row);
        OrderItems.data = $scope.orderSummaryGridOptions.data;
        if(OrderItems.data.length === 0){
            if($scope.configure && $scope.configure.actions){
                $scope.configure.actions.disabled = true;
            }
            $scope.datasource = [];
            $scope.validationMessages =[];
            $scope.$broadcast('OrderContentRefresh', {
                'OrderItems': [] // send whatever you want
            });
        }
        if (errIndex !== -1){
        	$scope.validationMessages.splice(errIndex,1);
        }
        $scope.calculate();
    };
    $scope.removeAllItems  = function(){
        $scope.orderSummaryGridOptions.data = [];
        OrderItems.data = $scope.orderSummaryGridOptions.data;
        $scope.calculate();
        $scope.datasource = [];
        $scope.validationMessages =[];
        if($scope.configure && $scope.configure.actions){
            $scope.configure.actions.disabled = true;
        }
        $scope.$broadcast('OrderContentRefresh', {
            'OrderItems': [] // send whatever you want
        });
    };

    function getValidationMessageIndex(row){
        var index = -1;
        var partNbr = row.entity.displayItemNumber;
        if(row.entity.childItems && row.entity.childItems.length > 0) {
            var ind = 0, 
            partLen = row.entity.childItems.length,
            partNbr = "";

            for(ind=0; ind<partLen; ind++) {
                partNbr = partNbr + row.entity.childItems[ind].displayItemNumber + "|";
            }
            partNbr = partNbr.substr(0, partNbr.length-1);
        }
        for(var i = 0; i < $scope.validationMessages.length; ++i){
            if($scope.validationMessages[i].partNumber == partNbr){
                index = i;
                break;
            }
        }
        return index;
    }
    $scope.submit = function(){
        if($scope.validationMessages.length === 0 &&
            $scope.submitAction !== null &&
            typeof $scope.submitAction === "function" && OrderItems.data.length > 0){
                $scope.submitAction();
        }
    };
    $scope.$on('OrderCatalogSubmit', function (event, service) {
        $scope.submit();
    });
    function getDataRow(entity){
        var row;
        if(OrderItems && OrderItems.data){
            for(var i =0; i < OrderItems.data.length; ++i){
                if(OrderItems.data[i].itemNumber === entity.itemNumber){
                    row = OrderItems.data[i];
                    break;
                }
            }
        }

        return row;
    }
    $scope.editOnChange = function(row){
        
        var message;
        var index = getValidationMessageIndex(row);
        var dataRow = getDataRow(row.entity);
        if(dataRow){
            dataRow.quantity = row.entity.quantity;
        }
        $scope.calculate();
        // Here comes the service and supplies part max quantity vaidation
        
        if(dataRow.partRequestArea && dataRow.partRequestArea.toUpperCase() === 'CONSUMABLE SVC PARTS REQUEST'){
        	$scope.maxCheck($scope.maxServiceQuantity,row,index);
        }else if(dataRow.partRequestArea && dataRow.partRequestArea.toUpperCase() === 'CONSUMABLES SUPPLIES REQUEST'){
        	$scope.maxCheck($scope.maxSuppliesQuantity,row,index);
        }else{
        	$scope.blankQuantityCheck(row,index);
        }
        
    };
    $scope.blankQuantityCheck = function(row,index){
        var partNbr = row.entity.displayItemNumber;
        if(row.entity.childItems && row.entity.childItems.length > 0) {
            var ind = 0, 
            partLen = row.entity.childItems.length,
            partNbr = "";

            for(ind=0; ind<partLen; ind++) {
                partNbr = partNbr + row.entity.childItems[ind].displayItemNumber + "|";
            }
            partNbr = partNbr.substr(0, partNbr.length-1);
        }
        if(row.entity.quantity === undefined || row.entity.quantity === null){
            //this validation is if quantity is 0
            message = {
                        partNumber: partNbr, 
                        key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.ZERO_QUANTITY_VALIDATION'
                      };
            row.entity.quantityError = true;
            if(index === -1)
                $scope.validationMessages.push(message);
            else
                $scope.validationMessages[index] = message;
        }
        else if(index > -1){
            $scope.validationMessages.splice(index,1);
            row.entity.quantityError = false;
        }
    };
    $scope.maxCheck = function(maxQuantity,row,index){
    	
    	if(row.entity.quantity === undefined || row.entity.quantity === null){
    		//this validation is if quantity is 0
        	message = {
        				partNumber: row.entity.displayItemNumber, 
        				key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.ZERO_QUANTITY_VALIDATION'
                  	  };
        	row.entity.quantityError = true;
        	if(index === -1)
        		$scope.validationMessages.push(message);
        	else
        		$scope.validationMessages[index] = message;
    	}else if(maxQuantity !== 'undefined' && row.entity.quantity > maxQuantity && index === -1){
            message = {
              partNumber: row.entity.displayItemNumber, 
              maxQuantity: maxQuantity,
              quantity: row.entity.quantity,
              key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.MAX_QTY_VALIDATION'
            };

            $scope.validationMessages.push(message);
            row.entity.quantityError = true;
            
        }else if((maxQuantity !== 'undefined' && 
        		(row.entity.quantity > 0 && row.entity.quantity <=  maxQuantity) && 
        		index > -1)){
            $scope.validationMessages.splice(index,1);
            row.entity.quantityError = false;
        }else if(index > -1){
            message = {
              partNumber: row.entity.displayItemNumber,
              maxQuantity: maxQuantity,
              quantity: row.entity.quantity,
              key: 'DEVICE_MAN.MANAGE_DEVICE_SUPPLIES.MAX_QTY_VALIDATION'
            };
            $scope.validationMessages[index] = message;
        }
    };
    
    $scope.calculate = function(){
        var subTotal = 0.0;
        if(OrderItems && OrderItems.data){
            for(var i = 0; i < OrderItems.data.length; ++i){
                var lineTotal = formatter.itemSubTotal(OrderItems.data[i].price,
                    OrderItems.data[i].quantity);
                OrderItems.data[i].totalLinePrice = lineTotal;
                subTotal += lineTotal;
            }
        }
        $scope.subTotal = formatter.formatCurrency(subTotal);
        if (BlankCheck.checkNotNullOrUndefined($scope.tax) &&  $scope.tax !== ''){
        	var taxNumeric = $scope.tax;
        	var amount = subTotal + taxNumeric;
        	$scope.total = formatter.formatCurrency(amount);
        	var taxPercent = (((amount - subTotal)/subTotal)*100);
        	
        	$scope.displaytax = OrderItems.formatTax(taxPercent);
        }
        else if(OrderItems && OrderItems.data &&  $scope.tax !== '' && subTotal > 0){
            $scope.total = formatter.formatCurrency(subTotal);
        }
        
    };
    
    $scope.submitDisable = function(){
        var disabled = true;

        if($scope.validationMessages.length === 0 && OrderItems && OrderItems.data && OrderItems.data.length > 0){
            disabled = false;
        }else{
            disabled = true;
        }

        return disabled;
    };
    $scope.$on('OrderContentRefresh', function (event, service) {
        if(service.OrderItems){
            var Grid = new GridService();
            var personal = new Personalize($location.url(),$rootScope.idpUser.id);
            $scope.orderSummaryGridOptions = {};
            $scope.orderSummaryGridOptions.showBookmarkColumn = false;
            Grid.setGridOptionsName('orderSummaryGridOptions');
            $scope.orderSummaryGridOptions.onRegisterAPI = Grid.getGridActions($scope,
            OrderItems, personal);
            if(service.OrderItems.length){
                OrderItems.data = service.OrderItems;
            }else{
                OrderItems = service.OrderItems;
            }
            Grid.display(OrderItems,$scope,personal, 48);
            $scope.calculate();
        }
    });
    if($rootScope.taxAvailableOnReturnChangeContact){
        $scope.tax = $rootScope.taxAvailableOnReturnChangeContact;
        $rootScope.taxAvailableOnReturnChangeContact = null;
    }
    $scope.calculate();
    
}]);

