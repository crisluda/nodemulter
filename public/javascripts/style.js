$(document).ready(function () {
    $('.card-alert > button').on('click', function () {
        $(this).closest('div.card-alert').fadeOut('slow');
    })
})