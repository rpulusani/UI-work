define(['jquery', 'throttle-debounce', "modernizr"], function(jq) {
  'use strict';
  ;(function($){
    $.fn.dropdown = function(options){
      var settings = $.extend({}, options);
      $.extend(this, settings);

      function getPosition(element){
        var position = element.offset();
        return position;
      }

      function vertPositioning(element){
        var position = getPosition(element);
        if((position.top) < (element.find(".dropdown__menu").height() + element.height())){
          return "bottom";
        }else if(($(document).height() - position.top) < (element.find(".dropdown__menu").height() + element.height() + 50)){
          return "top";
        }else{
          return "default";
        }
      }

      function horzPositioning(element){
        var position = getPosition(element);
        if((position.left) < (element.find(".dropdown__menu").width())){
          return "left";
        }else if(($(document).width() - position.left) < (element.find(".dropdown__menu").width())){
          return "right";
        }else{
          return "default";
        }
      }

      function positionMenu(element){
        switch (vertPositioning(element)){
          case "bottom":
            if(element.hasClass("dropdown--align-top")){
              element.removeClass("dropdown--align-top");
            }
          break;
          case "top":
            element.addClass("dropdown--align-top");
          break;
          default:
        }
        switch (horzPositioning(element)){
          case "left":
            if(element.hasClass("dropdown--align-right")){
              element.removeClass("dropdown--align-right");
            }
            element.addClass("dropdown--align-left");
          break;
          case "right":
            if(element.hasClass("dropdown--align-left")){
              element.removeClass("dropdown--align-left");
            }
            element.addClass("dropdown--align-right");
          break;
          default:
            if(!element.hasClass("dropdown--align-left") && !element.hasClass("dropdown--align-right")){
              if(element.closest("[dir=rtl]").size()){
                element.addClass("dropdown--align-right");
              }else{
                element.addClass("dropdown--align-left");
              }
            }
        }
        return element;
      }

      function openMenu(element){
        if(!element.closest(".navigation").length){
          $("body").addClass("dropdown--is-open");
        }
        element.addClass("dropdown--is-open");
        
        //IE7 needs to clone the dropdown as the last element in the DOM to fix it's z-indexing bug
        if(Modernizr.generatedcontent === false){
          var menuCopy = $(element).find(".dropdown__menu").clone(),
              menuPosition = getPosition($(element).find(".dropdown__menu"));
          
          if(element.hasClass("dropdown--align-top")){
            menuCopy.addClass("dropdown--align-top");
          }
          $("body").append(menuCopy);
          menuCopy.css("top", menuPosition.top).css("left", menuPosition.left).addClass("dropdown--is-open");
        }
      }

      function closeMenu(element){
        //IE7 needs to remove the cloned dropdown
        if(Modernizr.generatedcontent === false){
          $("body > .dropdown__menu").remove();
        }
        $(".dropdown--is-open").removeClass("dropdown--is-open");
      }

      function isMenuOpen(element){
        if(element.hasClass("dropdown--is-open")){
          return true;
        }else{
          return false;
        }
      }

      function triggerDropdown(element){
        element.find(".dropdown__trigger").click(function(e){
          e.stopPropagation();
          if(isMenuOpen(element)){
            closeMenu(element);
          }else{
            closeMenu(element);
            openMenu(element);
          }
        });
        $(document).click(function(){
          closeMenu(element);
        });
        return element;
      }

      function positionArrow(element){
        var caret = element.find(".dropdown__caret"),
            caretWidth = parseFloat(caret.css("border-left-width")),
            arrow = element.find(".dropdown__arrow"),
            arrowWidth = parseFloat(arrow.css("border-left-width"));
        if(caret.size()){
          var caretPosition = caret.position();
          if(element.hasClass("dropdown--align-right")){
            arrow.css("right", (element.width() - (caretPosition.left + arrowWidth + (.5)*caretWidth)));
            arrow.css("left", "auto");
          }else{
            arrow.css("left", ((caretPosition.left) + arrowWidth - (.5)*caretWidth));
            arrow.css("right", "auto");
          }
        }
      }

      function addArrow(element){
        if(!element.find(".dropdown__arrow").length){
          element.find(".dropdown__menu").prepend('<span class="dropdown__arrow"><span class="dropdown__arrow-inner"></span></span>');
        }
      }

      function addClose(element){
        if(!element.find(".dropdown__close").length){
          element.find(".dropdown__menu").prepend('<span class="dropdown__close">&times;</span>').click(function(){
            closeMenu(element);
          });
        }
      }

      function repositionDropdown(element){
        $(window).resize($.debounce(250, function(){
          positionMenu(element);
          positionArrow(element);
        }));
      }

      return this.each(function(options){
        var element = $(this);
        addArrow(element);
        addClose(element);
        positionMenu(element);
        positionArrow(element);
        triggerDropdown(element);
        repositionDropdown(element);
      });
    };
    $(document).ready(function(){
      $('[data-js=dropdown]').dropdown();
    });
  })(jq);
});