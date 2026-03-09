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
let totalPrice = 0;
const totalPriceEl = document.getElementById("total_price");
let log_in_btn = document.getElementById("log_in_btn")
let loged_in = localStorage.getItem("user") ? true : false;
let log_out_btn = document.getElementById("log_out");

addEventListener("DOMContentLoaded", async () => {
    if (cards) {
        await getFilteredTrains();
    }
})

if (log_in_btn) {
    log_in_btn.addEventListener("click", () => {

        if (localStorage.getItem("user")) {
            Swal.fire({
                icon: "error",
                title: "არ არის საჭირო",
                text: "თქვენ უკვე გაიარეთ რეგისტრაცია"
            })
        } else {
            window.location.href = "login.html";
        }

    });
}

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
                        <br><button class="btn_buy" onclick="goCheckout('${places.id}')"><span>დაჯავშნა</span></button>
                    </div>
                </div>
            `;

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
        if (!localStorage.getItem("user")) {
            swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "გთხოვთ გაიარეთ რეგისტრაცია",
                draggable: true,
         })   
        } else {            
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
        }
    });
}

function goCheckout(trainId) {
    const params = new URLSearchParams(window.location.search);
    const passangers = params.get("passangers");

    window.location.href = `checkout.html?id=${trainId}&passangers=${passangers}`;
}

addEventListener("DOMContentLoaded", async () => {

    if (!card) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const passangers = parseInt(params.get("passangers"));

    if (!id) {
        card.innerHTML = "<h2>No train selected</h2>";
        return;
    }

    try {
        const response = await fetch(`https://railway.stepprojects.ge/api/trains/${id}`);

        if (!response.ok) {
            throw new Error("Train not found");
        }

        const train = await response.json();

        card.innerHTML = `
        <div class="card">
            <div class="no_dash">
                <h6 class="number">${train.number}</h6>
                <h6 class="name">${train.name} Express</h6>
            </div>
            <div>
                <h6 class="from_time">${train.departure}</h6>
                <h6 class="from_place">${train.from}</h6>
            </div>
            <div>
                <h6 class="where_time">${train.arrive}</h6>
                <h6 class="where_place">${train.to}</h6>
            </div>
        </div>
        `;

        for (let i = 1; i <= passangers; i++) {
            card_passangers.innerHTML += `
            <h1>მგზავრი ${i}</h1><br><br>
            <div class="card_passanger">
                <span class="background">ადგილი: 0</span>
                <input type="text" required placeholder="სახელი">
                <input type="text" required placeholder="გვარი">
                <input type="text" required placeholder="პირადი ნომერი">
                <div><br><button type="button" class="select_class_btn"><span>დაჯავშნა</span></button></div>
            </div><br><br><br>
            `;
        }
        
        const classButtons = document.querySelectorAll(".select_class_btn");

        classButtons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                Swal.fire({
                    title: 'აირჩიეთ კლასი',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'I კლასი',
                    denyButtonText: 'II კლასი',
                    cancelButtonText: 'ბიზნეს კლასი',
                }).then((result) => {
                    let selectedClass = "";
                    if(result.isConfirmed) selectedClass = "I";
                    else if(result.isDenied) selectedClass = "II";
                    else if(result.isDismissed) selectedClass = "ბიზნეს";

                    if(selectedClass) {
                        btn.previousElementSibling.textContent = `კლასი: ${selectedClass}`;
                        showSeatModal(selectedClass, index);
                    }
                });
            });
        });

    } catch (error) {
        card.innerHTML = "<h2>Something went wrong</h2>";
    }
});

let occupiedSeatsByClass = {
    "I": [],
    "II": [],
    "ბიზნეს": []
};

const classPrices = {
    "I": 35,
    "II": 75,
    "ბიზნეს": 125
};

function showSeatModal(selectedClass, passengerIndex) {
    const rows = ["A", "B", "C", "D"];
    const cols = 10;
    let seatHtml = "";

    rows.forEach(row => {
        seatHtml += `<div style="display:flex; justify-content:center; margin-bottom:5px;">`;
        for (let i = 1; i <= cols; i++) {
            const seatCode = `${row}${i}`;
            const isOccupied = occupiedSeatsByClass[selectedClass].includes(seatCode);
            seatHtml += `<button class="seat-btn" 
                                style="
                                    background-color:${isOccupied ? '#e74c3c' : '#3498db'};
                                    color:white; border:none; border-radius:5px; 
                                    width:40px; height:40px; margin:2px; cursor:${isOccupied ? 'not-allowed' : 'pointer'};
                                "
                                ${isOccupied ? "disabled" : ""}
                                >${seatCode}</button>`;
        }
        seatHtml += `</div>`;
    });

    Swal.fire({
        title: `აირჩიეთ ადგილი - ${selectedClass} (${classPrices[selectedClass]}₾)`,
        html: `<div>${seatHtml}</div>
               <br><img src="./imgs/train-inside-image.png" style="width:100%; max-width:300px;">`,
        showConfirmButton: false,
        didOpen: () => {
            const seatButtons = Swal.getHtmlContainer().querySelectorAll(".seat-btn");
            seatButtons.forEach(button => {
                if (!button.disabled) {
                    button.addEventListener("click", () => {
                        const passengerCards = document.querySelectorAll(".card_passanger .background");
                        if(passengerCards[passengerIndex]) {

                            const oldPriceMatch = passengerCards[passengerIndex].textContent.match(/\d+₾$/);
                            if(oldPriceMatch) totalPrice -= parseInt(oldPriceMatch[0]);

                            passengerCards[passengerIndex].textContent = 
                                `ადგილი: ${button.textContent} (${selectedClass}) - ${classPrices[selectedClass]}₾`;

                            totalPrice += classPrices[selectedClass];
                            const totalPriceEl = document.getElementById("total_price");
                            if(totalPriceEl) totalPriceEl.textContent = `${totalPrice}₾`;
                        }
                        occupiedSeatsByClass[selectedClass].push(button.textContent);
                        Swal.close();
                    });
                }
            });
        }
    });
}

let buyBtn = document.getElementById("buy_btn");

if (buyBtn) {
    buyBtn.addEventListener("click", () => {

        const form = document.getElementById("checkout_form");
        if (!form.reportValidity()) return;

        const params = new URLSearchParams(window.location.search);
        const trainId = params.get("id");

        const passengerCards = document.querySelectorAll(".card_passanger");

        let seatNotSelected = false;

        passengerCards.forEach(card => {
            const seat = card.querySelector(".background").textContent;
            if (seat === "ადგილი: 0") {
                seatNotSelected = true;
            }
        });

        if (seatNotSelected) {
            Swal.fire({
                icon: "warning",
                title: "გთხოვთ აირჩიოთ ადგილი ყველა მგზავრისთვის"
            });
            return;
        }

        let passengers = [];

        passengerCards.forEach(card => {
            const inputs = card.querySelectorAll("input");
            const seat = card.querySelector(".background").textContent;

            passengers.push({
                name: inputs[0].value,
                lastname: inputs[1].value,
                personalId: inputs[2].value,
                seat: seat
            });
        });

        const ticket = {
            trainId: trainId,
            passengers: passengers,
            totalPrice: totalPrice,
            date: new Date().toLocaleString()
        };

        let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        tickets.push(ticket);
        localStorage.setItem("tickets", JSON.stringify(tickets));

        Swal.fire({
            icon: "success",
            title: "ბილეთი წარმატებით შეძენილია"
        }).then(() => {
            window.location.href = "ticketcheck.html";
        });
    });
}

const clearAllBtn = document.getElementById("clear_all_tickets_btn");

if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
        Swal.fire({
            icon: "warning",
            title: "ყველა ბილეთის წაშლა?",
            text: "ამ ქმედებას უკან ვერ დააბრუნებთ!",
            showCancelButton: true,
            confirmButtonText: "დიახ",
            cancelButtonText: "არა"
        }).then(result => {
            if(result.isConfirmed){
                localStorage.removeItem("tickets");
                const container = document.getElementById("tickets_container");
                if(container) container.innerHTML = "<h2>ბილეთები არ არის</h2>";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("tickets_container");
    if (!container) return;

    function renderTickets() {
        container.innerHTML = "";
        let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        if (tickets.length === 0) {
            container.innerHTML = "<h2>ბილეთები არ არის</h2>";
            return;
        }

        tickets.forEach((ticket, index) => {
            let passengersHtml = "";
            ticket.passengers.forEach(p => {
                passengersHtml += `
                <br><br>
                    <div class="ticket_passenger">
                        <p>სახელი: ${p.name}</p>
                        <p>გვარი: ${p.lastname}</p>
                        <p>${p.seat}</p>
                    </div>
                `;
            });

            container.innerHTML += `
                <div class="train-card ticket_card" data-index="${index}">
                <br><br>
                    <div class="train-header">
                        <h3 class="number">მატარებლის ID: ${ticket.trainId}</h3><br>
                        <h3 class="name">თქვენი ბილეთი</h3>
                    </div>
                    <div class="train-info">
                        ${passengersHtml}
                    </div>
                    <div class="train-footer">
                        <h3>ფასი: ${ticket.totalPrice}₾</h3><br>
                        <small>${ticket.date}</small><br>
                        <br>
                        <button class="delete_ticket_btn">წაშლა</button>
                    </div>
                </div><br>
            `;
        });

        const deleteButtons = document.querySelectorAll(".delete_ticket_btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const card = e.target.closest(".ticket_card");
                const idx = parseInt(card.getAttribute("data-index"));
                Swal.fire({
                    icon: "warning",
                    title: "გსურთ წაშლა?",
                    showCancelButton: true,
                    confirmButtonText: "დიახ",
                    cancelButtonText: "არა"
                }).then(result => {
                    if(result.isConfirmed){
                        tickets.splice(idx, 1);
                        localStorage.setItem("tickets", JSON.stringify(tickets));
                        renderTickets();
                    }
                });
            });
        });
    }

    renderTickets();

    const clearAllBtn = document.getElementById("clear_all_tickets_btn");
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            Swal.fire({
                icon: "warning",
                title: "ყველა ბილეთის წაშლა?",
                text: "ეს ქმედება არ დაბრუნდება!",
                showCancelButton: true,
                confirmButtonText: "დიახ",
                cancelButtonText: "არა"
            }).then(result => {
                if(result.isConfirmed){
                    localStorage.removeItem("tickets");
                    renderTickets();
                }
            });
        });
    }
});

const registerForm = document.getElementById("register_form");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const user = {
            fname: document.getElementById("fname").value,
            lname: document.getElementById("lname").value,
            age: document.getElementById("age").value,
            email: document.getElementById("mail").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value,
            phone: document.getElementById("phone_number").value,
            gender: document.getElementById("gender").value
        };

        localStorage.setItem("user", JSON.stringify(user));

        Swal.fire({
            icon: "success",
            title: "რეგისტრაცია წარმატებით დასრულდა"
        }).then(() => {
            window.location.href = "index.html";
            loged_in = true
        });
    });
}

if (log_out_btn) {
    log_out_btn.addEventListener("click", () => {

        Swal.fire({
            icon: "warning",
            title: "გსურთ გამოსვლა?",
            showCancelButton: true,
            confirmButtonText: "დიახ",
            cancelButtonText: "არა"
        }).then(result => {

            if (result.isConfirmed) {
                localStorage.removeItem("user");

                Swal.fire({
                    icon: "success",
                    title: "თქვენ გამოხვედით"
                }).then(() => {
                    window.location.href = "index.html";
                });
            }

        });

    });
}

if (localStorage.getItem("user")) {
    if (log_in_btn) log_in_btn.style.display = "none";
} else {
    if (log_out_btn) log_out_btn.style.display = "none";
}