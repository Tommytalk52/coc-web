
var lvlselectoptions = [
    {val:1, text:'1'},
    {val:2, text:'2'},
    {val:3, text:'3'},
    {val:4, text:'4'},
    {val:5, text:'5'},
    {val:6, text:'6'},
    {val:7, text:'7'},
    {val:8, text:'8'},
    {val:9, text:'9'},
    {val:10, text:'10'},
    {val:11, text:'11'},
    {val:12, text:'12'}
];

function convert_time(s)
{
    var unit = s.charAt(s.length - 1);
    var val = s.substring(0, s.length - 1);
    val = ~~val;
    switch (unit)
    {
        case 'S':
            return val;
        case 'M':
            return val * 60;
        case 'H':
            return val * 3600;
        case 'D':
            return val * 86400;
        default:
            return -1;
    }
    return -1;
}

function convert_cost(s)
{
    var unit = s.charAt(s.length - 1);
    var val = s.substring(0, s.length - 1);
    val = ~~val;
    return val;
}

//if the document is loaded
$(document).ready(function() {
    var thlvl;
    //if the town hall selecter is changed
    $('#thselect').on('change', function() {
        $('tbody').empty();
        //if the value is not "null"
        if($(this).val() !== "null") {
            //then show the main table
            $('#tablemax').show();
            //set the value of the global variable to the value of the select
            thlvl = ~~($(this).val());

            //for each top level of data, find the key and the value`
            $.each(data, function(k, v) {
                //if the maxnum value is bigger than 0
                if(v.maxnums[thlvl] > 0) {
                    //create a row
                    var $row = $('<tr>', {
                        item: k,
                        maxlvls: v.maxlvls[thlvl],
                        maxnums: v.maxnums[thlvl]
                    });
                    //make a th with a html content of the description and append it to row
                    $('<th>', {html: v.description}).appendTo($row);
                    //make a select with the class buttonsmall
                    var $select = $('<select>', {class: 'buttonsmall quantity'});
                    //make a quantity selector according to the max number avaliable
                    for(i=1; i<=v.maxnums[thlvl]; i++) {
                        //create an option and append it to the select
                        $('<option>', { value:i, html:i}).appendTo($select);
                    }
                    //make a td and put the select into it, then append it to the row
                    $('<td>').append($select).appendTo($row);
                    //create a cell with the class levels and append it to the row
                    $('<td>', {class: "levels"}).appendTo($row);
                    //create a cell with the class completed and append it to the row
                    $('<td>', {class: "completed"}).appendTo($row);

                    //append the row to the tbody
                    $('tbody').append($row);
                }
            });
            $('.quantity').trigger('change');




        }
        //otherwise 
        else{
            //hide the main table
            $('#tablemax').hide();
        }
    });
    //if the quantity selector is changed
    $('table').on('change', '.quantity', function() {
        //set the table row variable to the table row closest to the quantity selector
        var $row = $(this).closest('tr');
        //in the current tr, find the cell with the class "levels" and empty it
        $row.find('td.levels').empty();
        //set "num" to the value of the quantity selector
        var num = $(this).val();
        for (s = 0; s < num; s++) {
            var $select = $('<select>', {class: "buttonsmall"});
            for(i=1; i<=$row.attr('maxlvls'); i++) {
                //create an option and append it to the select
                $('<option>', { value:i, html:i}).appendTo($select);
            }
            $row.find('td.levels').append($select);
        }

    }).trigger('change');

    //when any select in the table changes
    $('tbody').on('change', 'select', function() {
        $('.info').remove();
        //for every row in the tbody
        $('tbody tr').each(function() {
            //set the row variable to the current row
            var $row = $(this);
            //retrieve the max number of items from the data.js file
            var maxnum = $row.attr('maxnums');
            //retrieve the max level of items from the data.js file
            var maxlvl = $row.attr('maxlvls');
            var item = $row.attr('item');

            //set the variable maxed to -1
            var maxed = -1;

            var quantity = $row.find('.quantity').val();
            if (quantity < maxnum) {
                maxed = 0;
            }
            //in the row find the select inside the cell with the class of "levels"
            var stuff = {
                capacity: 0,
                rate: 0,
                time: "",
                cost: 0,
                dps: ""
            };

            $row.find('td.levels select').each(function() {
                var v = ~~$(this).val();
                //if maxed is equal to -1
                if (maxed == -1) {
                    //set it to 1
                    maxed = 1;
                    //this makes it so it doesen't automatically say yes
                }
                //if the value of the level selector is less than the max for the current th
                if ($(this).val() < maxlvl) {
                    //then set the value of maxed to 0
                    maxed = 0;
                }
                //find the data for rate and capacity inside data
                var xxrc = data[item][v];
                var xxtc = data[item][v+1];
                try {
                    if (stuff.time.length) {
                        stuff.time += ", ";
                    }
                    stuff.time += xxtc.time;
                    stuff.capacity += xxrc.capacity;
                    stuff.rate += xxrc.rate;
                    if (stuff.dps.length) {
                        stuff.dps += ", ";
                    }
                    stuff.dps += xxrc.dps;
                    stuff.cost += convert_cost(xxtc.cost);
                }
                catch(TypeError) {
                    stuff.time += 0;
                    stuff.cost += 0;
                    stuff.capacity += xxrc.capacity;
                    stuff.rate += xxrc.rate + ', ';
                    stuff.dps += xxrc.dps;
                }

            });

            $('<td>', {
                html: "cost to upgrade to next level: " + stuff.cost + '<br /> time to upgrade to next level: ' + stuff.time + '<br /> rate of generation (per hour): ' + stuff.rate + '<br /> capacity: ' + stuff.capacity + "<br /> damage per shot: " + stuff.dps,
                class: 'info'
            }).appendTo($row);

            //if maxed is equal to 1
            if(maxed == 1) {
                //search in the row for the td with the class "completed" and set the contents to "yes"
                $row.find('.completed').html('yes');
            } else {
                //search in the row for the td with the class "completed" and set the contents to "no"
                $row.find('.completed').html('no');
            }
        });
    });
    
});

