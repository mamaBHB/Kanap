// requête fetch
fetch("http://localhost:3000/api/products")
.then(function(res) {
  if (res.ok) {
    // conservation de la réponse
    return res.json()
  }
  
})
.then(function(value) {
    // création tableau
    var products = value
    console.log(products)

    // boucle pour les produits
    for(let i=0; i<products.length; i++){
    
        // ajout des produits
        const allProducts = `<section class="items" id="items"> 
        <a href="./product.html?id=${products[i]._id}">
        <article>
        <img src="${products[i].imageUrl}" alt="${products[i].altTxt}">
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}</p>
        </article>
        </a>
        </section>`
        
        const addAllProducts = document.getElementById("items")
        addAllProducts.insertAdjacentHTML("beforeend", allProducts)
    }
})