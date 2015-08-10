define(["jquery", "modernizr", "throttle-debounce"], function(jq){
    ;(function($){
        $.fn.set = function(options){
            var settings = $.extend({
                collapsable: false,
                collapseAll: false,
                expandable: false,
                expandAll: false,
                initIndex: 0,
                animationSpeed: 250,
                breakpoint: "tablet"
            }, options);
            $.extend(this, settings);

            function isAccordion(el){
                if(el.children(".set__tab-container, .set__content-container").length == 0){
                    return true;
                }else{
                    return false;
                }
            }

            function isTabs(el){
                if(el.children(".set__tab-container, .set__content-container").length != 0){
                    return true;
                }else{
                    return false;
                }
            }

            function setIsOpen(set){
                if(set["trigger"].hasClass("set--is-active") && set["section"].hasClass("set--is-active")){
                    return true;
                }else{
                    return false;
                }
            }

            function hasOpenSet(el){
                var sets = getSets(el),
                    isOpen = false;

                sets.each(function(i, set){
                    if(setIsOpen(set)){
                        isOpen = true;
                    }
                });

                return isOpen;
            }

            function getTriggers(el){
                var triggers = new Array();
                if(isTabs(el)){
                    triggers = $(el).children(".set__tab-container").children("[data-toggle]");
                }else if(isAccordion(el)){
                    triggers = $(el).children("[data-toggle]");
                }
                return $(triggers);
            }

            function getSections(el){
                var sections = new Array();
                if(isTabs(el)){
                    sections = $(el).children(".set__content-container").children(".set__content");
                }else if(isAccordion(el)){
                    sections = $(el).children(".set__content");
                }
                return $(sections);
            }

            function getSets(el){
                var sets = new Array();
                var triggers = getTriggers(el);
                var sections = getSections(el);

                triggers.each(function(i, triggerEl){
                    sets[i] = {};
                    sets[i]["trigger"] = $(triggerEl);
                    sets[i]["section"] = $();
                    sections.each(function(n, sectionEl){
                        if($(sectionEl).attr("id") == $(triggerEl).data("toggle")){
                            sets[i]["section"] = $(sectionEl);
                        }
                    });
                });

                return $(sets);
            }

            function addAccordionIcons(triggers){
                var triggerLinks = triggers.find("a");

                triggerLinks.each(function(){
                    if($(this).find(".set__icon").size() == 0){
                        $(this).append('<i class="set__icon" />');
                    }
                });
            }

            function addTabClasses(el){
                if(!el.hasClass("set--tab")){
                    el.addClass("set--tab");
                }
            }

            function addAccordionClasses(el){
                if(!el.hasClass("set--accordion")){
                    el.addClass("set--accordion");
                }
            }

            function buildTabMarkup(el){
                var drawEvt = $.Event("set.draw"),
                    sets = getSets(el);

                if(!isTabs(el)){
                    var tabContainer = $('<div class="set__tab-container" />'),
                        contentContainer = $('<div class="set__content-container" />');

                    el.removeClass("set--accordion");
                    addTabClasses(el);

                    el.append(tabContainer);
                    el.append(contentContainer);

                    sets.each(function(i, set){
                        tabContainer.append(set["trigger"]);
                        contentContainer.append(set["section"]);
                    });

                    el.trigger(drawEvt);
                }
            }

            function buildAccordionMarkup(el){
                var drawEvt = $.Event("set.draw"),
                    sets = getSets(el);

                if(!isAccordion(el)){
                    var tabContainer = el.children(".set__tab-container"),
                        contentContainer = el.children(".set__content-container");

                    el.removeClass("set--tab");
                    addAccordionClasses(el);

                    sets.each(function(i, set){
                        el.append(set["trigger"]);
                        el.append(set["section"]);
                    });

                    tabContainer.remove();
                    contentContainer.remove();

                    el.trigger(drawEvt);
                }
            }

            function openSet(set){
                var openEvt = $.Event("set.open"),
                    openedEvt = $.Event("set.opened"),
                    triggerEl = $(set["trigger"]),
                    sectionEl = $(set["section"]);

                sectionEl.trigger(openEvt);

                triggerEl.addClass("set--is-active");
                if(isAccordion(triggerEl.closest(".set"))){
                    sectionEl.slideDown(settings.animationSpeed, function(){
                        sectionEl.addClass("set--is-active").css("display", "");
                        sectionEl.trigger(openedEvt);
                    });
                }else{
                    sectionEl.addClass("set--is-active");
                    sectionEl.trigger(openedEvt);
                }
            }

            function closeSet(set){
                var closeEvt = $.Event("set.close"),
                    closedEvt = $.Event("set.closed"),
                    triggerEl = $(set["trigger"]),
                    sectionEl = $(set["section"]);

                sectionEl.trigger(closeEvt);

                triggerEl.removeClass("set--is-active");
                if(isAccordion(triggerEl.closest(".set"))){
                    sectionEl.slideUp(settings.animationSpeed, function(){
                        sectionEl.removeClass("set--is-active").css("display", "");
                        sectionEl.trigger(closedEvt);
                    });
                }else{
                    sectionEl.removeClass("set--is-active");
                    sectionEl.trigger(closedEvt);
                }
            }

            function preventAnchorJump(anchor){
                anchor.click(function(e){
                    if(!$(this).parent().hasClass("set__trigger--is-link")){
                        e.preventDefault();
                    }
                });
            }

            function buildMarkup(el){
                var setType = el.data("js"),
                    breakpoint = "";

                switch(settings.breakpoint){
                    case "mobile":
                        breakpoint = "only screen and (min-width: 34em)";
                    break;
                    case "tablet":
                        breakpoint = "only screen and (min-width: 54em)";
                    break;
                    case "laptop":
                        breakpoint = "only screen and (min-width: 74em)";
                    break;
                    default:
                        breakpoint = settings.breakpoint;
                }

                switch(setType){
                    case "accordion":
                        buildAccordionMarkup(el);
                    break;
                    case "tab":
                        buildTabMarkup(el);
                    break;
                    case "set":
                    default:
                        if(Modernizr.mq(breakpoint)){
                            buildTabMarkup(el);
                        }else{
                            buildAccordionMarkup(el);
                        }
                }
            }

            function initSets(el){
                var initEvt = $.Event("set.init"),
                    sets = getSets(el),
                    setType = el.data("js");
                    
                sets.each(function(i, set){
                    set["trigger"].click($.debounce(settings.animationSpeed, true, function(evt){
                        if($(this).is("[data-toggle]")){
                            if(setIsOpen(set)){
                                if((settings.collapsable || settings.expandable) && setType == "accordion"){
                                    closeSet(set);
                                }
                            }else if(setType == "set" || setType == "tab" || !settings.expandable){
                                sets.each(function(n, set){
                                    closeSet(set);
                                });
                                openSet(set);
                            }else{
                                openSet(set);
                            }
                        }
                    }));
                });

                el.trigger(initEvt);
            }

            return this.each(function(){
                var el = $(this),
                    triggers = getTriggers(el),
                    triggerLinks = triggers.find("a"),
                    sections = getSections(el),
                    sets = getSets(el);

                addAccordionIcons(triggers);

                buildMarkup(el);

                $(window).resize($.debounce(250, function(e){
                    buildMarkup(el);
                }));

                preventAnchorJump(triggerLinks);

                initSets(el);

                if(!hasOpenSet(el) && settings.initIndex >= 0 && settings.initIndex < sets.size() && !settings.collapseAll){
                    openSet(sets[settings.initIndex]);
                }
                if(el.data("js") == "accordion"){
                    if(settings.expandable && settings.expandAll){
                        sets.each(function(i, set){
                            openSet(set);
                        });
                    }else if(settings.collapsable && settings.collapseAll){
                        sets.each(function(i, set){
                            closeSet(set);
                        });
                    }
                }
            });

            if ($.trim(window.location.hash)) $('a[href$="'+hash+'"]').trigger('click');
        }

        $(document).ready(function(){
            $("[data-js=set], [data-js=tab], [data-js=accordion]").each(function(i, set){
                $(set).set($(set).data());
            });
            var hash = $.trim(window.location.hash)
            if (hash) $('a[href$="'+hash+'"]').trigger('click');
        });
    }(jq));
});
