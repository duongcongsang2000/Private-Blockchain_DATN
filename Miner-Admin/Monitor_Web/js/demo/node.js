var HOST = "http://localhost:1234";
var data = [];

async function getAllPublicKey() {
    var url = `${HOST}/publickey/get`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                if (result.success) {
                    console.log(result);
                    load_data_to_selectoption(result.data);
                } else {
                    console.log("Error:", result.message);
                }
            })
            .catch(error => {
                console.log('error', error)
            })
}

async function loadPublickeys(page=1, record_per_page=10, reversed=0, active=1) {
    var url = `${HOST}/publickey/getall?page=${page}&limit=${record_per_page}&reversed=${reversed}&active=${active}`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                console.log(result);
                if (active == 1) {
                    load_data_to_table(result.data);
                } else {
                    load_data_to_table_restore(result.data);
                }
            })
            .catch(error => {
                console.log('error', error)
            })
}

async function deletePublickeys(publicKey) {
    var url = `${HOST}/publickey/delete?address=${publicKey}`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
            })
            .then(result => {
                console.log(result);
                $(`.publickeys[data-id=${publicKey}]`).remove()
            })
            .catch(error => {
                console.log('error', error)
            })
}

async function restorePublickeys(publicKey) {
    var url = `${HOST}/publickey/restore?address=${publicKey}`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    // fetch(url, requestOptions)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error: ${response.status}`);
    //             }
    //         })
    //         .then(result => {
    //             console.log(result);
    //         })
    //         .catch(error => {
    //             console.log('error', error)
    //         })

    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
        };
        
    $.ajax(settings).done(function (response) {
    console.log(response);
    });
}

async function createPublickey() {
    var url = `${HOST}/publickey/gen`;
    
    headers = {
        "Accept": "application/json",
    }

    params = {}
    var requestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow',
    }; 

    fetch(url, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.json();
            })
            .then(result => {
                console.log(result);
                showModelPublicKey(result.data)
            })
            .catch(error => {
                console.log('error', error)
            })
}

function load_data_to_selectoption(data) {
    $('#publicKeys').empty();
    $.each(data, function(index, value) {
    $('#publicKeys').append(`<option value="${value.public_key}">${value.name}</option>`)
    })
    $('#publicKeys').selectpicker('refresh');
    $('.selectpicker').selectpicker('val', 0);
    $("#publicKeys").val($('#publicKeys option:first').val());
    $("#publicKeys").selectpicker('refresh');
    $("#publicKeyAddress").val($("#publicKeys").val())
    loadFirstBlockAddress()
}

function load_data_to_table(result) {
    $("tbody").empty();

    data = result.data;
    page = result.page;
    console.log(page)
    $("#ContentPlaceHolder1_ddlRecordsPerPage").val(page.record_per_page)
    $("#current_page").text(page.current_page)
    $('#total_page').text(page.total_page)
    // Disabled First Page if current page = 1
    if ($("#current_page").text() == "1") {
        $(".page-item")[0].classList.add('disabled')
        $(".page-item")[1].classList.add('disabled')
    } else {
        $(".page-item")[0].classList.remove('disabled')
        $(".page-item")[1].classList.remove('disabled')
    }

    // Disabled Last Page if current page = lastpage
    if ($("#current_page").text() == page.total_page) {
        console.log("OK")
        $(".page-item")[3].classList.add('disabled')
        $(".page-item")[4].classList.add('disabled')
    } else {
        $(".page-item")[3].classList.remove('disabled')
        $(".page-item")[4].classList.remove('disabled')
        // $(".page-item")[4].removeAttr('onclick')
        // $(".page-item")[4].attr("onclick", loadBlocks(page.current_page + 1, record_per_page));
        // $(".page-item")[4].children[0].on("click", loadBlocks(page.current_page + 1, record_per_page));
    }


    for (let i = 0; i < data.length; i++) {
        $("tbody").append(`
        <tr class="publickeys" data-id="${data[i].public_key}">
            <td>
                ${data[i].name}
            </td>
            <td>
                ${data[i].public_key}
            </td>
            <td>
                <button type="button" class="btn btn-danger">
                    <a class="dropdown-item" href="#" onclick="confirmDeleteNodeNotify('${data[i].name}', '${data[i].public_key}')">Xóa</a>
                </button>
            </td>
        </tr>
        `)
    }
}

function load_data_to_table_restore(result) {
    $("tbody").empty();

    data = result.data;
    page = result.page;
    console.log(page)
    $("#ContentPlaceHolder1_ddlRecordsPerPage").val(page.record_per_page)
    $("#current_page").text(page.current_page)
    $('#total_page').text(page.total_page)
    // Disabled First Page if current page = 1
    if ($("#current_page").text() == "1") {
        $(".page-item")[0].classList.add('disabled')
        $(".page-item")[1].classList.add('disabled')
    } else {
        $(".page-item")[0].classList.remove('disabled')
        $(".page-item")[1].classList.remove('disabled')
    }

    // Disabled Last Page if current page = lastpage
    if ($("#current_page").text() == page.total_page) {
        console.log("OK")
        $(".page-item")[3].classList.add('disabled')
        $(".page-item")[4].classList.add('disabled')
    } else {
        $(".page-item")[3].classList.remove('disabled')
        $(".page-item")[4].classList.remove('disabled')
        // $(".page-item")[4].removeAttr('onclick')
        // $(".page-item")[4].attr("onclick", loadBlocks(page.current_page + 1, record_per_page));
        // $(".page-item")[4].children[0].on("click", loadBlocks(page.current_page + 1, record_per_page));
    }


    for (let i = 0; i < data.length; i++) {
        $("tbody").append(`
        <tr class="publickeys" data-id="${data[i].public_key}">
            <td>
                ${data[i].name}
            </td>
            <td>
                ${data[i].public_key}
            </td>
            <td>
                <button type="button" class="btn btn-info">
                    <a class="dropdown-item" href="#" onclick="confirmRestoreNodeNotify('${data[i].name}', '${data[i].public_key}')">Restore</a>
                </button>
            </td>
        </tr>
        `)
    }
}


function confirmDeleteNodeNotify(name, publicKey) {

   let message = `Bạn có thực sự muốn xóa những publickey dưới đây không? \
   <div class="alert modal-alert-info text-left"><ol id="deleteNodeModalBodyIP"></ol></div>`
   
   $('.deleteNodeModalLabelType').text(``)
   $('#deleteNodeModalConfirm').attr("onclick", `deletePublickeys('${publicKey}')`);
   
   $('#deleteNodeModalBody').empty();
   $('#deleteNodeModalBody').append(message);
   $('#deleteNodeModalConfirm').text("Xóa")
$('#deleteNodeModalBodyIP').append(`<li><strong>${name}</strong></li>`)
$('#deleteNodeModal').modal('show');
}

function confirmRestoreNodeNotify(name, publicKey) {

    let message = `Bạn có thực sự muốn khôi phục những publickey dưới đây không? \
    <div class="alert modal-alert-info text-left"><ol id="deleteNodeModalBodyIP"></ol></div>`
    
    $('.deleteNodeModalLabelType').text(``)
    $('#deleteNodeModalConfirm').attr("onclick", `restorePublickeys('${publicKey}');window.location.reload();`);
    
    $('#deleteNodeModalBody').empty();
    $('#deleteNodeModalBody').append(message);
    $('#deleteNodeModalConfirm').text("Khôi phục")
 $('#deleteNodeModalBodyIP').append(`<li><strong>${name}</strong></li>`)
 $('#deleteNodeModal').modal('show');
 }

function showModelPublicKey(data) {

    // Title
    $('.deleteNodeModalLabel').text(`Tạo Public key, Private Key thành công!`)
    let message = `<b>PrivateKey chỉ hiển thị duy nhất lần này. Vui lòng lưu lại Private Key!</b> \
    <div class="alert modal-alert-info text-left"><ol id="deleteNodeModalBodyIP">
    </div>`
    
    // $('.deleteNodeModalLabelType').text(`Đóng`)
    // $('#deleteNodeModalConfirm').attr("onclick", window.location.reload());
    
    $('#deleteNodeModalBody').empty();
    $('#deleteNodeModalBody').append(message);
    $('#deleteNodeModalConfirm').text("Xác nhận")
    $('#deleteNodeModalBodyIP').append(`
    <label for="privateKey">Private Key:</label>
    <input type="text" id="privateKey" name="privateKey" value="${data.privateKey}"></br></br>
    <label for="publicKey">Public Key:</label>
    <input type="text" id="publicKey" name="publicKey" value="${data.publicKey}">
    `)
    $('#deleteNodeModal').modal('show');
    
 }

