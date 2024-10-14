const partForm = document.getElementById("add-part-form");

function submit() {
    let name = document.getElementById("name");
    let tote_id = document.getElementById("tote_id");
    let description = document.getElementById("description");
    let lab_location = document.getElementById("lab_location");
    let num = document.getElementById("num");
    
    fetch(`http://localhost:3003/packinv/items`, {
        method: "POST",
        body: JSON.stringify({
            name: name.value,
            description: description.value,
            lab_location: lab_location.value,
            num: num.value,
            tote_id: tote_id.value
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
        alert("Item has been added");
    location.href = "/items";
    
}

partForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submit();
});



