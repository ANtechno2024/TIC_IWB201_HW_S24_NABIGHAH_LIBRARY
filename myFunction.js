function generateCaptcha() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var captcha = '';
    for (var i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
}

function refreshCaptcha() {
    var captcha = generateCaptcha();
    var captchaContainer = $('#captchaContainer');
    captchaContainer.html('<img src="data:image/png;base64,' + generateCaptchaImage(captcha) + '" alt="Captcha">');
    captchaContainer.data('captcha', captcha);
}

function generateCaptchaImage(text) {
    var canvas = $('<canvas></canvas>')[0];
    canvas.width = 150;
    canvas.height = 50;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f4f4f4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(text, 20, 35);
    return canvas.toDataURL('image/png').split('base64,')[1];
}

$(window).on('load', refreshCaptcha);

function toggleDetails(rowNumber) {
    var detailsRow = $('#detailsRow' + rowNumber);
    var checkbox = $('#checkbox' + rowNumber);

    if (checkbox.prop('checked')) {
        detailsRow.show();
    } else {
        detailsRow.hide();
    }
}

function selectRow(rowNumber) {
    var radio = $('#detailsRow' + rowNumber).find('input[type="radio"]');
    radio.prop('checked', true);
}

function checkSelection() {
    var selectedRadio = $('input[name="selection"]:checked');
    if (selectedRadio.length > 0) {
        $('#checkoutModal').show();
    } else {
        alert("يرجى اختيار خيار واحد على الأقل قبل المتابعة.");
    }
}

function closeModal() {
    $('#checkoutModal').hide()
}

function completePurchase() {
    var fullName = $('#fullName').val();
    var nationalId = $('#nationalId').val();
    var birthdate = $('#birthdate').val();
    var mobileNumber = $('#mobileNumber').val();
    var email = $('#email').val();
    var captchaInput = $('#captchaInput').val();

    if (fullName !== "" && !isValidName(fullName)) {
        alert(" يجب أن يكون الاسم ثلاثي ومكتوب باللغة العربية أو يمكن تركه فارغاً");
        return;
    }

    if (!/^\d{11}$/.test(nationalId) || !['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'].includes(nationalId.substr(0, 2))) {
        alert("الرجاء ادخال رقمك الوطني على ان يتالف الرقم من 11 خانة");
        return;
    } 
    if (nationalId === '') {
        alert("يرجى إدخال الرقم الوطني");
        return;
    }

    if (email !== "" && !isValidemail(email)) {
        alert("الرجاء إدخال بريد الكتروني صحيح أو تركه فارغاً");
        return;
    }
    
    if (mobileNumber !== "" && !isValidPhone(mobileNumber)) {
        alert("الرجاء إدخال رقم هاتف صحيح أو تركه فارغًا.");
        return;
    }

    if (birthdate !== "" && !isValidDate(birthdate)) {
        alert("الرجاء إدخال عمر صحيح ويجب أن يكون فوق عمر ال18 أو يمكن تركه فارغاً");
        return;
    }

    var userInput = $('#captchaInput').val();
    var captcha = $('#captchaContainer').data('captcha');
    if (userInput === captcha) {
        alert('تم التحقق بنجاح!');
    } else {
        alert('فشل التحقق، يرجى المحاولة مرة أخرى.');
        refreshCaptcha();
        return;
    }
    $('#captchaInput').val('');

    var selectedRadio = $('input[name="selection"]:checked');
    var selectedRow = selectedRadio ? selectedRadio.parents('tr') : null;
    if (selectedRow) {
        var selectedCity = selectedRow.find('td:nth-child(1)').text();
        var details = selectedRow.find('td:nth-child(2)').text();
        var rent = selectedRow.find('td:nth-child(3)').text();

        var message = "تمت عملية الشراء بنجاح!\n\n";
        message += "رقم الكتاب ISBN: " + selectedCity + "\n";
        message += " عنوان الكتاب: " + details + "\n";
        message += " السعر: " + rent + "\n";
        message += "رقمك الوطني: " + nationalId + "\n";

        alert(message);
    } else {
        alert("الرجاء تحديد خيار قبل متابعة عملية الشراء.");
    }

    closeModal();
}

function isValidDate(birthdate) {
    var today = new Date();
    var birthdateObj = new Date(birthdate);
    var age = today.getFullYear() - birthdateObj.getFullYear();
    var monthDiff = today.getMonth() - birthdateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
        age--;
    }
    if (age < 18) {
        return;
    }
    return true;
}

function isValidemail(email) {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return;
        }
    return true;
}

function isValidPhone(mobileNumber) {
    if (!/^09\d{8}$/.test(mobileNumber)) {
        return;
    }
    return true;
}

function isValidName(fullName) {
        var nameWords = fullName.split(" ");
        if (nameWords.length < 3) {
            return;
        }
    
        var arabicAlphabetRegex = /^[\u0621-\u064A ]+$/;
        if (!arabicAlphabetRegex.test(fullName)) {
            return;
        }
    return true;
}

