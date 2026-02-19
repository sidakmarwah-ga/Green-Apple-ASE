const tableBody = document.getElementById("product-table-body");
const categoryList = document.getElementById("category-list");
const filterForm = document.getElementById("filter-form");
const search = document.getElementById("search");
const priceMin = document.getElementById("price-min");
const priceMax = document.getElementById("price-max");
const sortBy = document.getElementById("sortby");
const resetFormButton = document.getElementById("reset-form-button");

let allProducts = [];
let categories = [];
let filteredProducts = [];

const mapFilterFields = () => {
  categories.map(i => {
    const check = `
      <label for="${i}" class="capitalize flex items-center justify-center gap-[8px]">
        <input type="checkbox" name="category" id="${i}" value="${i}"
          class="w-[18px] h-[18px]"> ${i}
      </label>
    `
    categoryList.insertAdjacentHTML("beforeend", check);
  })
}

const fillData = (res) => {
  allProducts = [...res];
  filteredProducts = [...res];
  const catSet = new Set(res.map(i => i.category));
  categories = [...catSet];
  mapFilterFields();
}

const getData = async () => {
  let products = [];
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    products = await res.json();
  } catch (err) {
    console.log(err.message);
  }
  fillData(products);
  return products;
}

const updateTable = (items) => {
  console.log("upt", filteredProducts);
  let html = "";
  items.forEach(i => {
    html += `
      <tr>
        <td>${i.id}</td>
        <td>${i.title}</td>
        <td>${i.price}</td>
        <td>${i.description}</td>
        <td>${i.category}</td>
        <td><img src="${i.image}" alt="product ${i.id} image"></td>
        <td>${i.rating.rate}</td>
        <td>${i.rating.count}</td>
      </tr>
    `;
  })
  tableBody.innerHTML = html;
}

const getFormData = () => {
  const selectedCheckboxes = document.querySelectorAll('input[name="category"]:checked');
  const values = [];

  // Iterate over the NodeList of selected checkboxes
  selectedCheckboxes.forEach((checkbox) => {
    values.push(checkbox.value);
  });

  return {
    search: search.value.toLowerCase(),
    priceMin: Number(priceMin.value),
    priceMax: Number(priceMax.value),
    categories: values
  }
}


const sortFilteredProducts = () => {
  console.log("fdff", filteredProducts);
  const val = sortBy.value;
  if(val === "") {
    return;
  }
  if(val === "pricelth") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }
  if(val === "pricehtl") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  if(val === "ratelth") {
    filteredProducts.sort((a, b) => a.rating.rate - b.rating.rate);
  }
  if(val === "ratehtl") {
    filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
  }
};

const resetForm = () => {
  search.value = "";
  priceMin.value = "";
  priceMax.value = "";

  const selectedCheckboxes = document.querySelectorAll('input[name="category"]:checked');

  // Iterate over the NodeList of selected checkboxes
  selectedCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  filteredProducts = [...allProducts];
  sortFilteredProducts();
  updateTable(filteredProducts);
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  console.log("jdlfndlxcli");
  const data = getFormData();
  filteredProducts = allProducts.filter(v => {
    if(data.search === "" || v.title.toLowerCase().includes(data.search) 
      || v.description.toLowerCase().includes(data.search)) {

        if((priceMin.value === "" || v.price >= data.priceMin)
          && (priceMax.value === "" || v.price <= data.priceMax)) {
             
            if(data.categories.length === 0 || data.categories.includes(v.category)) {
              return true;
            }
        }
    }
  })

  console.log(filteredProducts);

  sortFilteredProducts();
  updateTable(filteredProducts);
}

resetFormButton.addEventListener("click", resetForm);
sortBy.addEventListener("change", () => {
  sortFilteredProducts();
  updateTable(filteredProducts);
});
filterForm.addEventListener('submit', handleFormSubmit);

// ___main___

(async () => {
  await getData();
  updateTable(allProducts);
})();