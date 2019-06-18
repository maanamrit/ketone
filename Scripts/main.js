$(document).ready(function () {
    var socket = io();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Octr", "Nov", "Dec"
    ];

  //  console.log("I am running please check");
 //   console.log(new Date().toLocaleDateString());
    $('#dateData').val(new Date().toLocaleDateString());
    var dataObject = {};


    // $('#dateDataPicker').datepicker();
    // $('#showCalender').click(function(){
    //     $('#dateDataPicker').datepicker('show');
    // })
    $.ajax({

        type: 'get',
        url: '/api/getData',
        success: function (data) {
      //      console.log(data);
            // console.log(Object.keys(data["dashboarData"]).length);
            if (data["success"]) {
                updateDashboarData(data["dashboarData"]);

            }
            else {
                updateEmptyData();
            }
        },
        error: function (err) {
            console.log(err);
        }
    })
    socket.on('dataEvent', function (data) {
     //   console.log("data recived");
    //    console.log(data);
        updateDashboarData(data["updatedData"]);
    })
    function updateDashboarData(data) {
        for (x in data) {
            $('#' + x).val(data[x]);
        }
        totalCallPercnetage();
    }

    function updateEmptyData() {
        $('.ShowInputText').each(function () {
            $(this).val(0);
            dataObject[$(this).attr('id')] = $(this).val();
        })
        $('.ShowInputTextString').each(function () {
            $(this).val('Not updated yet.');
            dataObject[$(this).attr('id')] = $(this).val();
        })
    }

    $('#editButton').on('click', function () {
        $('.ShowInputText').prop('readonly', false);
        $('.ShowInputText').css({ 'background-color': 'white', 'border': '0.5px solid #000000' });
        $('.ShowInputTextString').prop('readonly', false);
        $('.ShowInputTextString').css({ 'background-color': 'white', 'border': '0.5px solid #000000' });

        // $('#dateDataPicker').datepicker().prop('readonly',false);
    })
    $('#submitButton').on('click', function () {
        var flag = 0;
        $('.ShowInputText').each(function () {

            if (isNaN($(this).val())) {
                $(this).css({ 'border': '1.5px solid red' });
                flag = flag + 1;
            }
            else {

                $(this).css({ 'border': '1px solid black' });
            }

        })
        if (flag > 0) {
            alert('Please Enter Numeric value');
        }
        else {
            $('.ShowInputText').css({ 'background-color': 'transparent', 'border': '0px' });
            $('.ShowInputText').prop('readonly', true);

            $('.ShowInputTextString').prop('readonly', true);
            $('.ShowInputTextString').css({ 'background-color': 'transparent', 'border': '0px' });


            //   console.log(dataObject);
            updateDashboardValue();


            var currentTime = new Date();


            hours = currentTime.getHours(),
                minutes = currentTime.getMinutes();

            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            var suffix = "AM";
            if (hours >= 12) {
                suffix = "PM";
                hours = hours - 12;
            }
            if (hours == 0) {
                hours = 12;
            }
            dateData = new Date();
            timeData = (hours + ":" + minutes + " " + suffix)




            dataObject["dateData"] = dateData.toLocaleDateString() + " " + timeData;
            //    console.log( $('#dateDataPicker').val());
            var dateNumber = "";
            var dateMonth = "";
            if (dateData.getDate() < 10) {
                dateNumber = "0" + (dateData.getDate() - 1);
            }
            else {
                dateNumber = dateData.getDate();
            }
            // if ((dateData.getMonth() + 1) < 10) {
            //     dateMonth = "0" + (dateData.getMonth() + 1);
            // }
            // else {
            //     dateMonth = dateData.getMonth() + 1;
            // }

            dataObject["dateDataPicker"] = dateNumber + "-" + monthNames[dateData.getMonth()] + "-" + new Date().getFullYear();
            // console.log(dataObject)
            //  console.log(dataObject);
            $.ajax({


                type: 'post',
                url: '/api/updateData',
                //   url: 'api/auth',
                data: dataObject,

                success: function (data) {
                 //   console.log(data);
                },
                error: function (err) {
                  console.log(err);
                }

            })
        }


    })
    function updateDashboardValue() {
        $('.ShowInputText').each(function () {

            dataObject[$(this).attr('id')] = $(this).val();
        })
        $('.ShowInputTextString').each(function () {

            dataObject[$(this).attr('id')] = $(this).val();
        })
    }

    function totalCallPercnetage() {
    //    console.log("Percentage data is called");
    //    console.log($('#answeredCall').val() + " -- " + $('#totalCall').val());
        if ($('#totalCall').val() == 0) {
            $('#totalCallsData').text("0%");
        }
        else {
            $('#totalCallsData').text(Math.floor((+$('#answeredCall').val() / +$('#totalCall').val()) * 100) + " %");
        }
        //   console.log(+('$totalCall').val()+"---"+('$answeredCall').val());
        var abandoncall = (+$('#totalCall').val()) - (+$('#answeredCall').val());
        $('#abandonCall').val(abandoncall);

        let totalCalls = 0;
        $('.totalOpen').each(function () {
            //   console.log($(this).attr('id')+"---"+$(this).val());
            totalCalls = totalCalls + (+$(this).val());
        })
        $('#totalCalls').text(totalCalls);

    }
})