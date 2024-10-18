const apiUrl = 'https://hotelorderingapp-1.onrender.com/menuItems'; // API endpoint for menu items

// Fetch and display menu items
function fetchMenuItems() {
    fetch(apiUrl) // Fetch menu items from API
        .then(response => response.json()) // Parse JSON response
        .then(menuItems => {
            const menuContainer = document.getElementById('menu-items'); // Get the menu container
            menuContainer.innerHTML = ''; // Clear existing items

            // Loop through each menu item and create HTML
            menuItems.forEach(item => {
                menuContainer.innerHTML += `
                    <div class="col-md-4"> <!-- Bootstrap column -->
                        <div class="card menu-item-card"> <!-- Card for each item -->
                            <img src="${item.imageUrl}" class="card-img-top menu-item-image" alt="${item.name}"> <!-- Item image -->
                            <div class="card-body"> <!-- Card body -->
                                <h5 class="card-title">${item.name}</h5> <!-- Item name -->
                                <p class="card-text"><strong>Price:</strong> $${item.price}</p> <!-- Item price -->
                                <div class="rating" data-item-id="${item.id}"> <!-- Rating section -->
                                    <span class="star" onclick="rateItem(${item.id}, 1)">★</span>
                                    <span class="star" onclick="rateItem(${item.id}, 2)">★</span>
                                    <span class="star" onclick="rateItem(${item.id}, 3)">★</span>
                                    <span class="star" onclick="rateItem(${item.id}, 4)">★</span>
                                    <span class="star" onclick="rateItem(${item.id}, 5)">★</span>
                                </div>
                                <!-- Action buttons -->
                                <button class="btn btn-warning" onclick="editMenuItem(${item.id})">Edit</button>
                                <button class="btn btn-danger" onclick="deleteMenuItem(${item.id})">Delete</button>
                                <button class="btn btn-primary" onclick="orderMenuItem(${item.id})">Order</button>
                                <button class="btn btn-secondary" onclick="viewMenuItem(${item.id})">View</button> 
                            </div>
                        </div>
                    </div>
                `;
            });
        });
}

// Add or edit menu item
document.getElementById('menuItemForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect form data
    const id = document.getElementById('menuItemId').value;
    const name = document.getElementById('menuItemName').value;
    const price = document.getElementById('menuItemPrice').value;
    const description = document.getElementById('menuItemDescription').value;
    const imageUrl = document.getElementById('menuItemImageUrl').value;

    const menuItem = { name, price, description, imageUrl }; // Create menu item object

    if (id) {
        // If editing, send a PUT request
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuItem) // Send updated item data
        }).then(() => {
            fetchMenuItems(); // Refresh menu items
            clearForm(); // Clear form fields
        });
    } else {
        // If adding, send a POST request
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuItem) // Send new item data
        }).then(() => {
            fetchMenuItems(); // Refresh menu items
            clearForm(); // Clear form fields
        });
    }
});

// Delete menu item by ID
function deleteMenuItem(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' }) // Send DELETE request
        .then(() => fetchMenuItems()); // Refresh menu items
}

// Edit menu item by ID
function editMenuItem(id) {
    fetch(`${apiUrl}/${id}`) // Fetch item details
        .then(response => response.json()) // Parse JSON response
        .then(menuItem => {
            // Populate form fields with fetched item data
            document.getElementById('menuItemId').value = menuItem.id;
            document.getElementById('menuItemName').value = menuItem.name;
            document.getElementById('menuItemPrice').value = menuItem.price;
            document.getElementById('menuItemDescription').value = menuItem.description;
            document.getElementById('menuItemImageUrl').value = menuItem.imageUrl;

            // Show modal for editing
            const modal = new bootstrap.Modal(document.getElementById('menuItemModal'));
            modal.show();
        });
}

// Clear form fields
function clearForm() {
    document.getElementById('menuItemId').value = '';
    document.getElementById('menuItemName').value = '';
    document.getElementById('menuItemPrice').value = '';
    document.getElementById('menuItemDescription').value = '';
    document.getElementById('menuItemImageUrl').value = '';
}

// Initialize app by fetching menu items
fetchMenuItems();

// Handle order menu item
function orderMenuItem(id) {
    document.getElementById('orderItemId').value = id; // Set hidden field to track the item
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show(); // Show order modal
}

// Handle order form submission
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Collect order data
    const itemId = document.getElementById('orderItemId').value;
    const customerName = document.getElementById('customerName').value;
    const quantity = document.getElementById('orderQuantity').value;

    const orderData = {
        itemId: parseInt(itemId), // Convert ID to integer
        customerName,
        quantity: parseInt(quantity), // Convert quantity to integer
        orderTime: new Date().toISOString() // Record order time
    };

    // Post order to server
    fetch('https://hotelorderingapp-1.onrender.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData) // Send order data
    })
    .then(() => {
        alert('Order submitted successfully!'); // Alert success
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        modal.hide(); // Hide order modal
        document.getElementById('orderForm').reset(); // Clear order form
    })
    .catch(error => console.error('Error submitting order:', error)); // Log errors
});

// View menu item details
function viewMenuItem(id) {
    fetch(`https://hotelorderingapp-1.onrender.com/menuItems/${id}`) // Fetch item details
    .then(response => response.json()) // Parse JSON response
    .then(item => {
        // Populate modal or section with item details
        const detailModalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${item.name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${item.imageUrl}" class="img-fluid" alt="${item.name}">
                <p>${item.description}</p>
                <p>Price: $${item.price}</p>
            </div>`;
        
        const detailModal = document.getElementById('detailModal'); // Get detail modal
        detailModal.querySelector('.modal-content').innerHTML = detailModalContent; // Set content
        const modalInstance = new bootstrap.Modal(detailModal);
        modalInstance.show(); // Show detail modal
    })
    .catch(error => console.error('Error fetching menu item details:', error)); // Log errors
}

// Rate menu item
function rateItem(id, rating) {
    // Fetch item details to update rating
    fetch(`https://hotelorderingapp-1.onrender.com/menuItems/${id}`)
    .then(response => response.json())
    .then(item => {
        // Initialize ratings array if not present
        item.ratings = item.ratings || [];
        item.ratings.push(rating); // Add new rating

        // Calculate average rating
        const averageRating = item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length;

        // Update item with new rating
        fetch(`https://hotelorderingapp-1.onrender.com/menuItems/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item) // Send updated item data
        })
        .then(() => {
            // Update displayed rating
            const ratingElement = document.querySelector(`[data-item-id="${id}"]`);
            ratingElement.innerHTML = '';
            for (let i = 1; i <= Math.round(averageRating); i++) {
                ratingElement.innerHTML += '★'; // Display stars based on average rating
            }
        });
    });
}

// Submit customer feedback
function submitFeedback(event) {
    event.preventDefault(); // Prevent default form submission
    
    const feedback = {
        name: document.getElementById('customerName').value, // Customer name
        comment: document.getElementById('customerFeedback').value, // Feedback comment
    };

    // Send feedback to server
    fetch('https://hotelorderingapp-1.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback) // Send feedback data
    })
    .then(response => response.json())
    .then(data => {
        console.log('Feedback submitted:', data); // Log submitted feedback
        alert("Thank you for your feedback!"); // Alert success
        document.getElementById('feedbackForm').reset(); // Reset feedback form
    })
    .catch(error => console.error('Error submitting feedback:', error)); // Log errors
}
