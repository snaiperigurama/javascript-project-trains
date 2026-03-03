let btn_submit = document.getElementById("btn-submit");
let cards = document.getElementById("cards");
let card = document.getElementById("card");
let card_passangers = document.getElementById("card_passangers");
let btn_buyt1 = document.getElementById("1");
let btn_buyt2 = document.getElementById("2");
let btn_buyt3 = document.getElementById("3");
let index_from
let index_where
let index_date
let index_passanger
let purchase_number1
let purchase_number2
let purchase_number3
let purchase_name1
let purchase_name2
let purchase_name3
let purchase_departure1
let purchase_departure2
let purchase_departure3
let purchase_arrive1
let purchase_arrive2
let purchase_arrive3
let purchase_from1
let purchase_from2
let purchase_from3
let purchase_to1
let purchase_to2
let purchase_to3
let purchase_id1
let purchase_id2
let purchase_id3
let id

addEventListener("DOMContentLoaded", async () => {
    if (cards) {
        await getFilteredTrains();
    }

    if (card) {
        await console.log(id)
    }
})

function values(){
    let from = document.getElementById("from");
    let where = document.getElementById("where");
    let date = document.getElementById("date").value;
    let passangers = document.getElementById("passangers").value;
    from = from.options[from.selectedIndex].text;
    where = where.options[where.selectedIndex].text;
    index_date = date
    index_from = from
    index_passanger = passangers
    index_where = where
    return {from , where , date , passangers};
}

async function getFilteredTrains() {
    const params = new URLSearchParams(window.location.search);

    const result = {
        from: params.get("from"),
        where: params.get("where"),
        date: params.get("date"),
        passangers: params.get("passangers")
    };

    try {
        let response = await fetch("https://railway.stepprojects.ge/api/trains");
        console.log(result.date);
        if (!response.ok) {
            throw new Error("Get Request Failed");
        }

        let data = await response.json();

        cards.innerHTML = "";

        
        let number = 1
        for (let places of data) {
        if (places.from == result.from && places.to == result.where && number < 4) {
            cards.innerHTML += `
                <div class="card">
                    <div class="no_dash">
                        <h6 class="number">${places.number}</h6>
                        <h6 class="name">${places.name} Express</h6>
                    </div>
                    <div>
                        <h6 class="from_time">${places.departure}</h6>
                        <h6 class="from_place">${places.from}</h6>
                    </div>
                    <div>
                        <h6 class="where_time">${places.arrive}</h6>
                        <h6 class="where_place">${places.to}</h6>
                    </div>
                    <div>
                        <br><button class="btn_buy" id="${number}" onclick="c${number}()"><span>დაჯავშნა</span></button>
                    </div>
                </div>
            `;
            if(number == 1) {
                purchase_arrive1 = places.arrive
                purchase_departure1 = places.departure
                purchase_id1 = number
                purchase_to1 = places.to
                purchase_from1 = places.from
                purchase_name1 = places.name
                purchase_number1 = places.number
            } else if(number == 2) {
                purchase_arrive2 = places.arrive
                purchase_departure2 = places.departure
                purchase_id2 = number
                purchase_to2 = places.to
                purchase_from2 = places.from
                purchase_name2 = places.name
                purchase_number2 = places.number
            } else {
                purchase_arrive3 = places.arrive
                purchase_departure3 = places.departure
                purchase_id3 = number
                purchase_to3 = places.to
                purchase_from3 = places.from
                purchase_name3 = places.name
                purchase_number3 = places.number
            }
            number = number + 1
        }
    }
    } catch (error) {
        console.error(error);
    }
}

if (btn_submit) {
    btn_submit.addEventListener('click', function() {
        let v = values();
        if (v.from == v.where) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ 2 განსხვავებული რეალური ქალაქი",
                draggable: true,
            });
            return;
        }

        if (v.from == "საიდან" || v.where == "სად") {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ 2 განსხვავებული რეალური ქალაქი",
                draggable: true,
            });
            return;
        }

        if (v.date == "") {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ თარიღი",
                draggable: true,
            });
            return;
        }

        if (v.passangers < 1) {
            Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ აირჩიოთ მგზავრების რაოდენობა",
                draggable: true,
            });
            return;
        }

        const query = new URLSearchParams(v).toString();
        window.location.href = `purchase.html?${query}`;
    });
}

function c1() {
    id = 1;
    window.location.href = "checkout.html?id=1";
}

function c2() {
    id = 2;
    window.location.href = "checkout.html?id=2";
}

function c3() {
    id = 3;
    window.location.href = "checkout.html?id=3";
}
