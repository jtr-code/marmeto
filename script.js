const menTab = document.getElementById("menTab");
const womenTab = document.getElementById("womenTab");
const kidsTab = document.getElementById("kidsTab");
const productContainer = document.getElementById("productContainer");

const apiUrl =
  "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json";

async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

function renderProductCards(products) {
  productContainer.innerHTML = "";
  if (!Array.isArray(products) || products.length === 0) {
    productContainer.innerHTML = "<p>No products available.</p>";
    console.error("Products array is invalid or empty:", products);
    return;
  }
  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    const title = product.title;
    const titleEllipsis = title.length > 15 ? title.slice(0, 15) + "..." : title;

    card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${titleEllipsis}</h3>
            <p>Vendor: ${product.vendor}</p>
            <p>Price: $${product.price}</p>
            <p>Compare at price: $${product.compare_at_price}</p>
            <p>Discount: ${calculateDiscount(
              product.price,
              product.compare_at_price
            )}%</p>
            <button class="add-to-cart">Add to Cart</button>
        `;
    productContainer.appendChild(card);
  });
}

function calculateDiscount(price, comparePrice) {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

async function handleTabClick(categoryName) {
  const categories = await fetchProducts();
  const category = categories.find((cat) => cat.category_name === categoryName);
  if (category) {
    renderProductCards(category.category_products);
  } else {
    productContainer.innerHTML = "<p>No products available in this category.</p>";
  }
}

menTab.addEventListener("click", () => handleTabClick("Men"));
womenTab.addEventListener("click", () => handleTabClick("Women"));
kidsTab.addEventListener("click", () => handleTabClick("Kids"));
