//Remplir les champs vides par null

function validA() {

    var a = $('#accordion-2');
    var b = $('#accordion-5');
    var c = $('#accordion-7');

    var e = $('#accordion_2');
    var f = $('#accordion_5');
    var g = $('#accordion_7');


    a.find("input").each(function () {
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });
    b.find("textarea").each(function () {
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });
    c.find("textarea").each(function () {
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });


    $('#endroitTxt').val() === "" ? $('#endroitTxt').val('null') : $('#endroitTxt').val();


    $('#descLieux').val() === "" ? $('#descLieux').val('null') : $('#descLieux').val();

}


//Remplir les champs vides par null pour l'édition

function validAEdit() {



    var e = $('#accordion_2');
    var f = $('#accordion_5');
    var g = $('#accordion_7');


    e.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });
    f.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });
    g.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    });

    $('#endroitTxtEdit').val() === "" ? $('#endroitTxtEdit').val('null') : $('#endroitTxtEdit').val();


    $('#descLieuxEdit').val() === "" ? $('#descLieuxEdit').val('null') : $('#descLieuxEdit').val();
}

//Validation numéro de téléphone
$('.numbersOnly').keyup(function () {

    if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    }
});

