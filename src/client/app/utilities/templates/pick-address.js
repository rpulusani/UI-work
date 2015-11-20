<h1 translate="{{title}}"></h1>

<h4 translate="{{addressSelectText}}"></h3>

<div class="row">
    <div class="col-1-3 well">
        <div ng-show="isRowSelected()">
            <p translate="{{configure.address.translate.primaryTitle}}"></p>
            <div>
                 <p ng-bind-html="formattedSelectedContact"></p>
            </div>
        </div>
        <div ng-hide="isRowSelected()">
            <span translate="LABEL.NONE_SELECTED"></span>
        </div>
    </div>
</div>

<h2 ng-show="pagination.totalItems() !== -1 && pagination.totalItems() !== undefined" 
translate="CONTACT.SEARCH_EXISTING_CONTACT" translate-values="{total: pagination.totalItems()}">
</h2>

<hr/>

<div ui-grid="gridOptions" class="table" ui-grid-move-columns ui-grid-resize-columns ui-grid-selection></div>

<div pagination grid="{{gridOptions}}"></div>
<div class="col-2-3"></div>
<div class="col-1">
    <button class="btn btn--secondary" translate="CONTACT.DISCARD_CONTACT_CHANGES" ng-click="discardSelect()"></button>
    <button class="btn btn--primary" translate="CONTACT.CHANGE_CONTACT" 
            ng-click="goToDeviceAdd()"></button>
</div>
