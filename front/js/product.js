//Récupération des sélecteurs pour les futurs modifications
let title = document.getElementById("title")
let price = document.getElementById("price")
let description = document.getElementById("description")
let colors = document.getElementById("colors")
let imgItem = document.querySelector(".item__img")
let img = document.createElement("img")
imgItem.appendChild(img)


// Récupération des données de l'api par id
const paramsUrl = new URLSearchParams(window.location.search).get("id")

// requête fetch API + ID
fetch(`http://localhost:3000/api/products/${paramsUrl}`)
.then((response)=> response.json())
.then((product) => {
    console.log(product)
    // ajout des éléments des produits aux sélecteurs
    img.setAttribute("src", product.imageUrl)
    img.setAttribute("alt", product.altTxt)
    title.innerHTML = product.name
    price.innerHTML = product.price
    description.innerHTML = product.description
    document.title = product.name
    
    // création de la boucle pour les couleurs
    for (let i = 0; i < product.colors.length; i++) {
        let color = document.createElement("option")
        color.setAttribute("value", product.colors[i])
        color.innerHTML = product.colors[i]
        colors.appendChild(color)
    }
})





function addToCart() {
    const idProduct = paramsUrl 
    const color = document.querySelector("#colors").value 
    const quantity = document.querySelector("#quantity").value
    const price = document.querySelector("#price").textContent
    const title = document.querySelector("#title").textContent 
    const img = document.querySelectorAll(".item__img") 

    const productCart = JSON.parse(localStorage.getItem("cart"))

    // couleur quantité exacte
    if (quantity.value > 0 && quantity.value <= 100 && color.value != "") {

        // check si articles dans le panier
        if (localStorage.getItem("cart")) {

            // renvoie les produits identiques
            const resultFind = productCart.find(
                (el) => el.idProduct === paramsUrl && el.color === color
            )

            // si retourne un produit addition des deux produits identique
            if (resultFind) {
                let newQuantite = parseInt(quantity) + parseInt(resultFind.quantity)
                resultFind.quantity = newQuantite
                localStorage.setItem("cart", JSON.stringify(productCart))
                alert("Article ajouté au panier")
            }

            // si retourne rien rajout du produit dans le localstorage
            else {
                let productCartObj = { idProduct, color, quantity, title, price, img}

                productCart.push(productCartObj)

                let objCart = JSON.stringify(productCart)
                localStorage.setItem("cart", objCart)
                alert("Article ajouté au panier")
            }
        }
        // ajout article si localstorage vide
        else {
            let productCart = []
            let productCartObj = {idProduct, color, quantity}

            productCart.push(productCartObj)

            let objCart = JSON.stringify(productCart)
            localStorage.setItem("cart", objCart)
            alert("Article ajouté au panier")
        }
    } else{
        alert("Veuillez sélectionner une couleur, la quantitée doit être comprise entre 1 et 100")
    }

}

let addToCartBtn = document.getElementById("addToCart")
addToCartBtn.addEventListener("click", addToCart)