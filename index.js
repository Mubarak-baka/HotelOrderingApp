// Fetch menu items from the server
fetch('https://hotelorderingapp.onrender.com/menuItems') // Send a GET request to the server to retrieve menu items
  .then((response) => response.json())
  .then((data) => {
    const menu_list = document.getElementById("menu_items");// Get the HTML element with the id"menu_items"
    data.forEach(menu => {
      // Appending the html for each menu item and looping through them 
      menu_list.innerHTML += `       
        <div class="col-md-4 mb-4"> 
          <div class="menu-item-card">
            <img class="menu-item-image" src="${menu.imageUrl}" alt="${menu.name}">
            <div class="menu-item-info">
              <p class="fw-bold">${menu.name}</p>
              <p>Price: $${menu.price}</p>
              <p>${menu.description}</p>
              <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-success" onclick="addToCart('${menu.name}', ${menu.price}, '${menu.description}')">Add to Cart</button> 
                <button type="button" class="btn btn-primary" onclick="showEditForm(${menu.id}, '${menu.name}', ${menu.price}, '${menu.imageUrl}', '${menu.description}')">Edit</button>
              </div>
              <button type="button" class="btn btn-danger mt-2" onclick="deleteMenu(${menu.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(error => console.error('Error fetching menu items:', error)); // handles any error that occur during the fetch request 

// Adding an eventlistener for the add-menu-item-form
  document.getElementById('add-menu-item-form').addEventListener('submit',function(event){
    event.preventDefault();  // prevents the default form submission behaviour

    //getting values from the form  
    const name = document.getElementById('menu-item-name').value;
  const price = document.getElementById('menu-item-price').value;
  const description = document.getElementById('menu-item-description').value;
  const imageUrl = document.getElementById('menu-item-image-url').value;

  //creating a new menu item object  here we are creating a new object to hold a new menu item data 
  const newMenuItem = {
    name: name,
    price: price,
    description: description,
    imageUrl: imageUrl
  };

//sending the new item to the server  using a POST request 
fetch('https://hotelorderingapp.onrender.com/menuItems', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newMenuItem) // Converting the newMenuItem object to a json string 
})
.then(response => {
  if(response.ok){
    return response.json();
  }else{
    console.error('Error adding menu item',response.statusText); // response . statusText logs an error message if the response was not successful
  }
})
.then(data => {
  console.log('Menu item added:', data); //log the response data(new menu item added)
  document.getElementById('add-menu-item-form').reset();// clear the form after submission have been made 
})
.catch(error => console.error('Error adding menu item:',error)) // handles errors in the request 
  })

// this function adss a new item to the cart  including the description of the order the name and the price 
function addToCart(name, price, description) {
  orderNow(name, price, description); // here we are calling the function to add the item to the order
}

// Function to show the edit form  for a menu item the modal
function showEditForm(id, name, price, imageUrl,description) {
  document.getElementById("edit-name").value = name;
  document.getElementById("edit-price").value = price;
  document.getElementById("edit-image-url").value = imageUrl;
  document.getElementById("edit-description").value= description

  // Show the modal for editing an item
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();

  // Handle form submission for editing an item 
  document.getElementById('edit-form').onsubmit = function (event) {
    event.preventDefault(); // prevent default form behavior 

    // here we are getting Updated values from the  edit form
    const updatedName = document.getElementById("edit-name").value;
    const updatedPrice = document.getElementById("edit-price").value;
    const updatedImageUrl = document.getElementById("edit-image-url").value;
    const updatedDescription=document.getElementById("edit-description").value 

    // Send updated data to the server using PUT  request 
    fetch(`https://hotelorderingapp.onrender.com/menuItems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: updatedName,
        price: updatedPrice,
        imageUrl: updatedImageUrl,
        description:updatedDescription
      })
    })
    .then(response => response.json())
    .then(updatedItem => {
      console.log('Item updated:', updatedItem);
    })
    .catch(error => console.error('Error updating item:', error));
  };
}
function deleteMenu(id){
  if(confirm("Are you want to delete this Order")){ // Ask the user for surerity before deletion 
    fetch(`https://hotelorderingapp.onrender.com/menuItems/${id}`,{
      method: 'DELETE'
    })
    .then(response =>{
      if(response.ok){
        console.log("item deleted",id); // displays the item deleted text
      }else {
        console.error('Error deleting item:',response.statusText); // log error if deletion fails
      }
        
    })
    .catch(error => console.error('error deleting item',error)) // handle error in the request
  }
}

// CustomOrders Management 


let customOrders = []; // initialize an array to store custom orders

//function to remove a custom item from the list 
function removeCustomItem(element) {
  const itemElement = element.parentElement;  // Get the parent eleent of the button
  const itemName = itemElement.querySelector("p strong").innerText; // Extract the name of the item 

  //filter out the item  from customOrders array
  customOrders = customOrders.filter(order => order.name !== itemName);

  // Remove from the UI
  itemElement.remove();
}

// Event listener for adding a custom item to the list
document.getElementById("add-custom-item").addEventListener("click", () => {
  // We're getting the values from the unput fields 
  const customItemName = document.getElementById("custom-item-name").value;
  const customItemPrice = document.getElementById("custom-item-price").value;
  const customItemDescription = document.getElementById("custom-item-description").value;

  if (customItemName && customItemPrice && customItemDescription) {
    // Create a new object for  custom item object 
    const customItem = {
      name: customItemName,
      price: customItemPrice,
      description: customItemDescription
    };

    // Add custom item to the array
    customOrders.push(customItem);

    // Update the UI
    const customItemHTML = `
      <li class="list-group-item">
        <p><strong>${customItemName}</strong></p>
        <p>Price: ${customItemPrice}</p>
        <p>Description: ${customItemDescription}</p>
        
        <button class="btn btn-danger btn-sm" onclick="removeCustomItem(this)">Remove</button>
        <button class="btn btn-outline-success" onclick="orderNow('${customItemName}', ${customItemPrice}, '${customItemDescription}')">Order Now</button>
      </li>
    `;
    document.getElementById("custom-items-list").innerHTML += customItemHTML;
 
    // Clear the input fields after adding the item 
    document.getElementById("custom-item-name").value = '';
    document.getElementById("custom-item-price").value = '';
    document.getElementById("custom-item-description").value = '';
  } else {
    alert("Dear Customer Please enter all fields!"); // alerts the user if any fields are missing 
  }
});


// Function to handle "Order Now" button and display in modal
function orderNow(name, price, description) {
  const orderList = document.getElementById('order-list'); // getting the list element where orders will be displayed 
  const orderHTML = `
    <li id="order-${name}" class="list-group-item">
      <p><strong>${name}</strong></p>
      <p>Price: ${price}</p>
      <p>Description: ${description}</p>
      <button class="btn btn-danger btn-sm" onclick="removeOrder('${name}')">Delete</button>
    </li>
  `;
  orderList.innerHTML += orderHTML; //adding the order to the list  
  

  // Trigger the modal to shoow the order 
  const openModalButton = document.querySelector('[data-bs-target="#exampleModal"]');
  openModalButton.click(); // simulate a click on the buton that opens the modal

}




// Function to remove an order from the order summary modal
function removeOrder(orderName) {
  // Remove from the customOrders array
  customOrders = customOrders.filter(order => order.name !== orderName);

  // Remove from the order from the CustomOrders array 
  const orderElement = document.getElementById(`order-${orderName}`);
  if (orderElement) {
    orderElement.remove(); // remove the element from the document 
  }
}

// Event listener to display the order summary modal
document.getElementById("order-summary-button").addEventListener("click", () => {
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = ""; // Clear previous content

  if (customOrders.length === 0) {
    modalBody.innerHTML = "<p>No custom orders added.</p>";
  } else {
    //looping through each order and display it in the modal 
    customOrders.forEach(order => {
      modalBody.innerHTML += `
        <div id="order-summary-${order.name}">
          <p><strong>${order.name}</strong></p>
          <p>Price: ${order.price}</p>
          <p>Description: ${order.description}</p>
          <button class="btn btn-danger btn-sm" onclick="removeOrder('${order.name}')">Delete</button>
        </div>
        <hr>
      `;
      
    });
    
  }
  
  
});

  

