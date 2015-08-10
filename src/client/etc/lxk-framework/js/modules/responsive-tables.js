/*
* Name: responsiveTable
* Version: 0.3.1
* 
* Author: Brad Barton
* Built for: Lexmark International
* Date Created: 11/15/2013
* Last Modified: 6/29/2015 by Brad Barton
* 
* Purpose: This jQuery plugin builds the necessary markup for tables to become responsive
*/

define(['jquery'], function(jq) {
  'use strict';
  (function($){
    $.fn.responsiveTable = function(options){
      var settings = $.extend({}, options);
      $.extend(this, settings);

      function addClasses(element){
        element.addClass("table--responsive");
      }

      function getLabels(element){
        var labels = element.find("thead th").map(function(){
          return $(this).text();
        });
        return labels;
      }

      function setLabels(element){
        var labels = getLabels(element);

        element.find("tbody tr").each(function(){
          $(this).find("td").each(function(i){
            $(this).attr("data-label", labels[i]);
          });
        });
      }

      return this.each(function(){
        if($(this).hasClass("table--responsive") != true){
          addClasses($(this));
        }
        setLabels($(this));
      })
    }

    $("[data-js=responsive-table]").responsiveTable();
  })(jq);
});