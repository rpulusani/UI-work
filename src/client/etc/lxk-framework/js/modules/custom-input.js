define(["jquery"], function(jq) {
    jq.fn.customInput = function(){
        return jq(this).each(function(i){ 
            var input = jq(this);
            var label = jq('label[for="'+input.attr('id')+'"]');
            var container = input.closest(".form__field");
            var inputType = input.attr("type");

            if(!(container.hasClass("form__field--" + inputType))){
                container.addClass("form__field--" + inputType);
            }

            if(input.closest("fieldset").attr("disabled")){
                input.attr("disabled","true");
            }

            if(input.is(":disabled")){
                container.addClass("form__field--is-disabled");
            }

            if(input.is('[type=checkbox],[type=radio]')){
                if(label.find("span").length == 0){
                    label.prepend("<span /> ");
                }

                if(input.is(":checked")){
                    label.addClass("form__field--is-checked");
                }
                    
                var allInputs = jq('input[name="'+input.attr('name')+'"]');
                
                input.bind('checkState', function(){        
                    if(input.is(':checked')){
                        if(input.is(':radio')){
                            allInputs.each(function(){
                                jq('label[for="'+jq(this).attr('id')+'"]').removeClass('form__field--is-checked');
                            });                
                        }
                        label.addClass('form__field--is-checked');
                    }
                    else{
                        label.removeClass('form__field--is-checked');
                    }
                })
                .trigger('checkState')
                .click(function(){
                    jq(this).trigger('checkState');
                });
            }
        });
    };

    jq("[data-js='customInput']").customInput();
});
