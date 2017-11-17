//Remplir les champs vides par null

function validA() {

	var a = $('#accordion-2');
	var b = $('#accordion-5');
	var c = $('#accordion-7');
    var d = $('#accordion-4');
    var e = $('#accordion_2');
    var f = $('#accordion_5');
    var g = $('#accordion_7');
    var h = $('#accordion_4');

	a.find("input").each(function(){
		($(this).val() === "" ? $(this).val('null') : $(this).val())
	});
    b.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    c.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    d.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    e.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    f.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    g.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
    h.find("input").each(function(){
        ($(this).val() === "" ? $(this).val('null') : $(this).val())
    })
}


//Validation numéro de téléphone
$('.numbersOnly').keyup(function () {

    if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    }
});


// ///Valider que les champs ne sont pas vide
// function validateForm() {
// 	console.log($('.data-verif').html());
//
//     if ($('.data-verif').val() === "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }