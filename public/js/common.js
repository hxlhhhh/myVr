//提示成功,没有text
function myVr_alert(title,confirmFun,cancelFun) {
    swal({
        title: title,
        icon: 'success',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}
//提示成功,有text
function myVr_text_alert(title,text,confirmFun,cancelFun) {
    swal({
        title: title,
        text: text,
        icon: 'success',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}

function myVr_text_alert_confirm(title,text,confirmFun) {
    swal({
        title: title,
        text: text,
        icon: 'success',
        buttons: {
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }
    })
}


//提示失败,没有text
function myVr_error(title,confirmFun,cancelFun) {
    swal({
        title: title,
        icon: 'error',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}
//提示失败，只有确定框
function myVr_error(title,text) {
    swal({
        title: title,
        text:text,
        icon: 'error',
        buttons: {
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){

        }else{

        }
    })
}
//提示失败,有text
function myVr_text_error(title,text,confirmFun,cancelFun) {
    swal({
        title: title,
        text: text,
        icon: 'error',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}


//提示警告,没有text
function myVr_warn(title,confirmFun,cancelFun) {
    swal({
        title: title,
        icon: 'warning',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}
//提示警告,有text
function myVr_text_warn(title,text,confirmFun,cancelFun) {
    swal({
        title: title,
        text: text,
        icon: 'warning',
        buttons: {
            cancel: "取消",
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }else{
            if (cancelFun) {
                cancelFun();
            }
        }
    })
}
function myVr_text_warn_confirm(title,text,confirmFun) {
    swal({
        title: title,
        text: text,
        icon: 'warning',
        buttons: {
            confirm: "确定"
        }
    }).then(function(isConfirm){
        if(isConfirm){
            if (confirmFun !== null) {
                confirmFun();
            }
        }
    })
}
