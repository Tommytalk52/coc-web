var data = {
    gold: [200, 400, 600, 800, 1000, 1300, 1600, 1900, 2200, 3000, 3500],
    elixir: [200, 400, 600, 800, 1000, 1300, 1600, 2200, 2500, 3000, 3500],
    delixir: [200, 400, 600, 800, 1000, 1300, 1600, 2200, 2500, 3000, 3500] 
};

$(document).ready(function() {
    $('select,button').addClass('button');
    $('#result').css("background-color","#FCCA46");
	$('#mainupdate').on('click', function() {
		var res = $('#resource').val();
        console.log(res);
		var num = $('#num').val();
        $('.hide').hide();
        var total = 0;
        var select;
        for(var i = 1; i <= ~~num; i++) {
            select = $( "" ).appendTo( ".select" );
            $('#lvl' + i).show();
            var level = $('#lvl' + i).val();
            var delta = data[res][level - 1];
            total += ~~delta;
        }
        $('#result').css("background-color","#16BAC5");
        if(res === "delixir"){
            res = "dark elixir";
        }
        $('#result').html('The amount of ' + res + ' you will get per hour is: ' +
            total);
	});
});
