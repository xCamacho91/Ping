var messenger = function (messengerRoute, textboxSelector, resultSelector) {

    //a call to messenger will return an object containing its configuration object(config) and the message function
    return {

        config: {
            messengerRoute: messengerRoute,
            textboxSelector: textboxSelector,
            resultSelector: resultSelector
        },

        //add a message
        //beware that function message is not aware of the containing object so we need to pass messenger itself as an argument to this function
        message: function (messenger) {

            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes();

            var message = $(messenger.config.textboxSelector).val();

            $.ajax({
                url: '/app/' + messenger.config.messengerRoute,
                type: "POST",
                data: JSON.stringify({
                    message: message
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: function(){
                    $(messenger.config.resultSelector).append('<div class="chat-left"><div class="chat-avatar"><img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin"><div class="chat-name">Russell</div></div><div class="chat-text">'+message+'</div></div>');
                },
                success: function (data) {
                    $(messenger.config.resultSelector+'>div').last().append('<div class="chat-hour">'+ time +'<span class="fa fa-check-circle"></span></div>');
                }
            });


        }
    }
}