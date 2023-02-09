// every time you refresh the page : the code is re-interpreted
// be carful in choosing the names of the variable , ids , names to avoid conflict
let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");

// mode of the create/update button function
mode = "create";
// temp var to store the index of the product to be updated
let tmp;

// get total
function getTotal() {
    if (price.value != "") {
        // parseInt() will not work if the value of the field is empty  = ""
        // how the values in the varibles get updated every time we click ?
        let res = +price.value +
            +taxes.value +
            +ads.value -
            +discount.value;
        total.innerHTML = res;
        total.style.backgroundColor = "green";
    }
    else {
        total.innerHTML = "";
        total.style.backgroundColor = "red";
    }
}
// create product && save to lacal storage
// array of products
let dataPro;

// to clear the local storage
// localStorage.clear() ;

// check if the local storage is not empty : 
//we have previous data ,
// get the data and put it into the array
if (localStorage.product != null) {
    // parse : the opposite of stringify
    dataPro = JSON.parse(localStorage.product);
} else {
    // create an empty array
    dataPro = [];
}


submit.onclick = function () {
    let newPro = {
        title: title.value.toLowerCase(),
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value.toLowerCase(),
    }

    // check required fields
    if(title.value!="" && category.value!="" && price.value!=""){
        if (mode === "create") {
            if (newPro.count > 1) {
                for (let i = 0; i < newPro.count; i++) {
                    dataPro.push(newPro);
                }
            }
            else { // only once
                dataPro.push(newPro);
            }
        } else {
            // mode = update
            dataPro[tmp] = newPro;
            mood = "create";
            submit.innerHTML = "Create";
            count.style.display = "block";
        }
    }else{
        // don't erase if the user forgot to type a required field
        clearData();
    }
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}
// clear input fields
function clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = "";
    total.style.backgroundColor = "#eee";
    count.value = "";
    category.value = "";
}
// read
function showData() {
    let table = "";
    for (let i = 0; i < dataPro.length; i++) {
        table += `
            <tr>
                <th>${i+1}</th>
                <th>${dataPro[i].title}</th>
                <th>${dataPro[i].price}</th>
                <th>${dataPro[i].taxes}</th>
                <th>${dataPro[i].discount}</th>
                <th>${dataPro[i].total}</th>
                <th>${dataPro[i].category}</th>
                <td><button onclick="updateData(${i})" >Update</button></td>
                <td><button onclick="deleteData(${i})" >Delete</button></td>
            </tr>
        `
    }
    let delAllButton = document.getElementById("del");
    if (dataPro.length > 0) {
        delAllButton.innerHTML = `
            <button id="deleteAll" onclick="deleteAll()">Delete All (${dataPro.length})</button>
        `
    }
    else {
        delAllButton.innerHTML = "";
    }
    document.getElementById("tbody").innerHTML = table;
}
// always showData , with every new reloading for the js file
showData();
// count
// delete one product
function deleteData(i) {
    dataPro.splice(i, 1);
    localStorage.product = JSON.stringify(dataPro);
    showData();
}
// delete all products
function deleteAll() {
    dataPro.splice(0);
    localStorage.clear();
    showData();
}
// update
function updateData(i) {
    // console.log(i) ;
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    category.value = dataPro[i].category;
    getTotal();
    count.style.display = "none";
    submit.innerHTML = "Update";
    mode = "update";
    tmp = i;
    scroll({
        top: 0,
        behavior: "smooth",
    })
}
// search
// default search mode
let searchMode = "title";
function getSearchMode(id) {
    search = document.getElementById("search");
    if (id == "searchTitle") {
        searchMode = "title";
    } else {
        searchMode = "category";
    }
    search.placeholder = "Search By " + searchMode;
    search.focus();
    search.value = "";
    showData();
}

function searchData(value) {
    let table = "";
    for (let i = 0; i < dataPro.length; i++) {
        if (searchMode == "title") {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table += `
                        <tr>
                            <th>${i}</th>
                            <th>${dataPro[i].title}</th>
                            <th>${dataPro[i].price}</th>
                            <th>${dataPro[i].taxes}</th>
                            <th>${dataPro[i].discount}</th>
                            <th>${dataPro[i].total}</th>
                            <th>${dataPro[i].category}</th>
                            <td><button onclick="updateData(${i})" >Update</button></td>
                            <td><button onclick="deleteData(${i})" >Delete</button></td>
                        </tr> 
                    ` ;
            }
        } else {
            if (dataPro[i].category.includes(value.toLowerCase())) {
                table += `
                        <tr>
                            <th>${i}</th>
                            <th>${dataPro[i].title}</th>
                            <th>${dataPro[i].price}</th>
                            <th>${dataPro[i].taxes}</th>
                            <th>${dataPro[i].discount}</th>
                            <th>${dataPro[i].total}</th>
                            <th>${dataPro[i].category}</th>
                            <td><button onclick="updateData(${i})" >Update</button></td>
                            <td><button onclick="deleteData(${i})" >Delete</button></td>
                        </tr> 
                    ` ;
            }
        }
    }
    document.getElementById("tbody").innerHTML = table;
}
// clean the data