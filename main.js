let btn_submit = document.getElementById("btn-submit");

function values(){
    let from = document.getElementById("from");
    let where = document.getElementById("where");
    let date = document.getElementById("date").value;
    let passangers = document.getElementById("passangers").value;
    from = from.options[from.selectedIndex].text;
    where = where.options[where.selectedIndex].text;
    return {from , where , date , passangers};
}

btn_submit.addEventListener('click', function() {
    let result = values()

    console.log(result.from);
    console.log(result.where);    
    console.log(result.date);
    console.log(result.passangers);
});

