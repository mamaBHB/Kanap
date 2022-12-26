const itemCartList = JSON.parse(localStorage.getItem("cart"))
console.log(itemCartList)



// panier vide
if (!itemCartList || itemCartList.length == 0) {
    const elemPanierVide = `<div style="display:flex; justify-content:center"><p style="font-size:40px; padding: 30px">Votre panier est vide</p></div>`;
    const elem = document.querySelector("#cartAndFormContainer h1");
    elem.insertAdjacentHTML("afterend", elemPanierVide);
    document.querySelector(".cart").remove();
} 
else {
    displayCart(itemCartList);
}


async function displayCart(itemCartList){
    const totalPrice = document.getElementById("totalPrice")
    totalPrice.innerHTML = "0"
    let nombreArticles = 0

    // boucle des produits dans localstorage
    for (let i = 0; i<itemCartList.length; i++){
        let idProduct = itemCartList[i].idProduct
        nombreArticles += itemCartList[i].quantity
        const response = await fetch("http://localhost:3000/api/products/" + idProduct)

        // ajout des produits
        if (response.ok){
            const data = await response.json()
            const addProductsCart = `<article class="cart__item" data-id="${itemCartList[i].idProduct}" data-color="${itemCartList[i].color}">
            <div class="cart__item__img">
              <img src="${data.imageUrl}" alt="${data.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${data.name}</h2>
                <p>${itemCartList[i].color}</p>
                <p id="price_product" data-id="price-${itemCartList[i].idProduct}-${itemCartList[i].color}">${data.price}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${itemCartList[i].quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
            </article>`

            const element = document.querySelector(".cart")
            element.insertAdjacentHTML("afterbegin", addProductsCart)


            // maj prix total
            // ajout nombre articles total
            const actualTotalPrice = parseInt(totalPrice.innerHTML)
            totalPrice.innerHTML = actualTotalPrice + data.price * itemCartList[i].quantity


            const deleteButton = document.querySelector(
                `.cart__item[data-id="${itemCartList[i].idProduct}"][data-color="${itemCartList[i].color}"] .deleteItem`
            )

            // supprimer article
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault()
                const idProductRemove = itemCartList[i].idProduct
                const colorProductRemove = itemCartList[i].color
                
                var productFilter = itemCartList.filter(
                    (product) => 
                    product.idProduct != idProductRemove ||
                    product.color != colorProductRemove
                )
                localStorage.setItem("cart", JSON.stringify(productFilter))
                const elemRemove = document.querySelector(
                    `.cart__item[data-id="${itemCartList[i].idProduct}"][data-color="${itemCartList[i].color}"]`
                )
                elemRemove.remove()

                // update prix
                location.reload()
            })
            
        
            const elInput = document.querySelector(
                `.cart__item[data-id="${itemCartList[i].idProduct}"][data-color="${itemCartList[i].color}"] .itemQuantity`
            )

            // nombre article au chargement
            elInput.addEventListener("input", (e) =>{
                e.preventDefault()
                let quantityItem = elInput.value
                const productId = itemCartList[i].idProduct
                var productFilter = itemCartList.filter((product) => product.idProduct == productId)
                productFilter[0].quantity = quantityItem
                localStorage.setItem("cart", JSON.stringify(itemCartList))

                // calcul nouveau montant du panier*
                let total = 0
                for(let i = 0; i<itemCartList.lenght; i++){
                    fetch("http://localhost:3000/api/products/"+itemCartList[i].idProduct)
                        .then((response) => response.json())
                        .then ((data) =>{
                            total += data.price * itemCartList[i].quantity
                            console.log("prix total :", total)
                            totalPrice.innerHTML=total
                        })
                }
            })

        }
    }
}


// formulaire
// messages d'erreur 
const errorPrenom = () => {
    const errorMsgPrenom = document.getElementById("firstNameErrorMsg")
    errorMsgPrenom.innerHTML = "Veuillez entrer uniquement des lettres."
}
const errorNom = () => {
    const errorMsgNom = document.getElementById("lastNameErrorMsg")
    errorMsgNom.innerHTML = "Veuillez entrer uniquement des lettres."
}
const errorAdress = () => {
    const errorMsgAdress = document.getElementById("addressErrorMsg")
    errorMsgAdress.innerHTML = "Veuillez entrer votre adresse."
}
const errorVille = () => {
    const errorMsgVille = document.getElementById("cityErrorMsg")
    errorMsgVille.innerHTML = "Veuillez entrer votre ville."
}
const errorEmail = () => {
    const errorMsgEmail = document.getElementById("emailErrorMsg")
    errorMsgEmail.innerHTML = "Veuillez entrer une adresse email valide."
}


const form = document.querySelector(".cart__order__form")

// function POST 
const postRequest = () => {
    let prenom = form.firstName.value
    let nom = form.lastName.value
    let adresse = form.address.value
    let ville = form.city.value
    let email = form.email.value
  
    var contact = {
      firstName: prenom,
      lastName: nom,
      address: adresse,
      city: ville,
      email: email,
    }
  
    var products = []
    for (let i = 0; i < itemCartList.length; i++) {
      var id = itemCartList[i].idProduct
      products.push(id)
    }
  
    var body = {
      contact: contact,
      products: products,
    }
  
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("orderId", data.orderId)
        document.location.href = "confirmation.html?id=" + data.orderId
      })
  
      .catch((error) => {
        console.log(error)
      })
}
 

const postForm = () => {
    
    let prenom = form.firstName.value
    let nom = form.lastName.value
    let adresse = form.address.value
    let ville = form.city.value
    let email = form.email.value
  
    // regex
    let emailRegex = new RegExp(
        "[a-zA-Z0-9.-_]*[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]*"
    )
    let classicRegex = new RegExp(
        "^[a-zA-Z ,.'-]+$"
    )
  
    let adresseRegex = new RegExp(
        "[0-9]{1,3}(\s*[a-zA-Zàâäéèêëïîôöùûüç]*)*"
    )
    

    var emailValid = emailRegex.test(email)
    var prenomValid = classicRegex.test(prenom)
    var nomValid = classicRegex.test(nom)
    var villeValid = classicRegex.test(ville)
    var adresseValid = adresseRegex.test(adresse)
    if (emailValid && prenomValid && nomValid && villeValid && adresseValid) {
      postRequest()
    } 

    // si non valide ajout message d'erreur
    else {
        
        if (!emailValid) {
            errorEmail()
        }
        if (!prenomValid) {
            errorPrenom()
        }
        if (!nomValid) {
            errorNom()
        }
        if (!villeValid) {
            errorVille()
        }
        if (!adresseValid) {
            errorAdress()
        }
    }
}
  
const order = document.getElementById("order")
order.addEventListener("click", (e) => {
  e.preventDefault()
  postForm()
})