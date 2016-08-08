function formCheck() {
    var errMsg = {'both': 'Заполните обязательные поля'};
    var formError = '';
    if ((jQuery('#jform_params_app_key').val() == '') || (jQuery('#jform_params_email').val() == '')) {
        formError = 'both';
    }
    if (formError == '') {
        Joomla.submitbutton('plugin.apply');
        return true;
    } else {
        alert(errMsg[formError]);
        return false;
    }
}

jQuery(document).ready(function () {
    jQuery('a[href="#description"]').hide();

    var text_after = "Введите Email и ключ API из личного кабинета <a href='https://getsale.io' target='_blank'>GetSale</a><br>" +
        "Если вы еще не регистрировались в сервисе GetSale это можно сделать по ссылке <a href='https://getsale.io' target='_blank'>GetSale</a>";
    var support_text = '' + '<br><br>Служба поддержки: <a href="mailto:support@getsale.io">support@getsale.io</a><br>Joomla GetSale v1.0.0';
    var success_text = 'Поздравляем! Ваш сайт успешно привязан к аккаунту <a href="https://getsale.io">GetSale</a>.<br/>' + 'Теперь вы можете создать виджеты в личном кабинете на <a href="https://getsale.io">GetSale</a>.';

    if ((jQuery('#jform_params_app_key').val() !== '') && (jQuery('#jform_params_email').val() !== '')) {
        if (window.getsale_succes_reg == true && jQuery('#jform_params_getsale_id').val() !== '') {
            jQuery('#jform_params_app_key').after('<img title="Введен правильный ключ!" class="gtsl_ok" src="../plugins/system/getsale/ok.png">');
            jQuery('#jform_params_email').after('<img title="Введен правильный email!" class="gtsl_ok" src="../plugins/system/getsale/ok.png">');
            jQuery('[id=jform_params_app_key-lbl]').parent().parent().after(success_text + support_text);
        } else if (window.getsale_succes_reg == true && jQuery('#jform_params_getsale_id').val() == '') {
            jQuery('#jform_params_getsale_id').val(window.getsale_id);
            Joomla.submitbutton('plugin.apply');
        } else if (window.getsale_succes_reg == false) {
            jQuery('[id=jform_params_app_key-lbl]').parent().parent().after(text_after + support_text);
            if (window.getsale_reg_error == 403) {
                jQuery('.alert.alert-success').hide();
                var error_text = 'Неверно введен Email или ключ API.';
            }
            if (window.getsale_reg_error == 500) {
                jQuery('.alert.alert-success').hide();
                var error_text = 'Данный сайт уже используется в другом аккаунте на сайте <a href="https://getsale.io">GetSale</a>';
            }
            if (window.getsale_reg_error == 404) {
                jQuery('.alert.alert-success').hide();
                var error_text = 'Данный Email не зарегистрирован на сайте <a href="https://getsale.io">GetSale</a>';
            }
            if (window.getsale_reg_error == 0) {
                jQuery('.alert.alert-success').hide();
                var error_text = 'Ответ от <a href="https://getsale.io">GetSale</a> не был получен. Проверьте ваше соединение с интернетом, или обратитесь в Cлужбу технической поддержки: <a href="mailto:support@getsale.io">support@getsale.io</a>';
            }
            var gtsl_btn_html = '<div style="width:100%;margin-top: 20px;">' +
                '<button style="float:left;" id="gtsl_auth_btn" onclick="formCheck(); return false;"> Авторизация </button>' +
                '<div style="padding-top: 2px;">' +
                '<span class="gtsl_err" style="margin-left: 5px;"> <b>Ошибка!</b> ' + error_text +
                '</span>' +
                '</div>' +
                '</div>';
            jQuery('input#jform_params_app_key').parent().after(gtsl_btn_html)
        } else {
            if (jQuery('#jform_enabled').val() == 0) {
                var error_text = 'Для начала работы необходимо включить плагин.';
            }
            jQuery('input#jform_params_app_key').parent().after('<button style="float:left;margin-top: 15px;" id="gtsl_auth_btn" onclick="formCheck(); return false;"> Авторизация </button>' +
                '<div style="padding-top: 20px;">' +
                '<span class="gtsl_err" style="margin-left: 5px;"> <b>Ошибка!</b> ' + error_text +
                '</span>' +
                '</div>');
            jQuery('[id=jform_params_app_key-lbl]').parent().parent().after(text_after + support_text);
        }
    } else {
        jQuery('input#jform_params_app_key').parent().after('<button style="float:left;margin-top: 15px;" id="gtsl_auth_btn" onclick="formCheck(); return false;"> Авторизация </button>');
        jQuery('[id=jform_params_app_key-lbl]').parent().parent().after(text_after + support_text);
    }
    //правим отступ
    jQuery('#jform_params_app_key').parent().css('margin-left', '70px');
    jQuery('#jform_params_email').parent().css('margin-left', '70px')
});

//добавляем вместо краткого описания нужный текст.
var text_after2 = "<p><b>GetSale</b> &mdash; профессиональный инструмент для создания popup-окон.</p>" +
    "<p>GetSale поможет вашему сайту нарастить контактную базу лояльных клиентов, информировать посетителей о предстоящих акциях, распродажах, раздавать промокоды, скидки и многое другое, что напрямую повлияет на конверсии покупателей и рост продаж.</p>";
jQuery('.readmore').parent().hide();
jQuery('.info-labels').after(text_after2);

if (jQuery("p.alert-message:contains('Учётная запись для вас была создана')").length) {
    (function (w, c) {
        w[c] = w[c] || [];
        w[c].push(function (getSale) {
            getSale.event('user-reg');
            console.log('user-reg');
        });
    })(window, 'getSaleCallbacks');
}

