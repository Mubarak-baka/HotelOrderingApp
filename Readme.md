## Hotel Ordering App - Mubarak Nassib
A web-based application designed to allow hotel customers to place food and drink orders from a menu, while hotel staff can manage and update these orders in real-time. Built using HTML, CSS, JavaScript, and JSON server for backend management.


## Features 
 users can Add, edit, and delete menu items.
Each item includes a name, price, description, and image.

## Ordering System

Customers can select items from the menu and place orders.
Orders can be customized by the customer.

## Order Management

Orders are stored and displayed in a summary modal for review.
Hotel staff can manage orders, including deleting orders.

## Custom Item Ordering

Customers can add custom menu items, which can then be ordered.

## Modal-based Interaction

Bootstrap modals are used for editing items and displaying order summaries.
Technologies Used
Frontend: HTML, CSS, JavaScript, Bootstrap
Backend: JSON Server (to simulate a REST API)  

## Setup Instructions

1. Clone the repository. git@github.com:Mubarak-baka/HotelOrderingApp.git

cd hotel-ordering-app

##  Install JSON Server
npm install -g json-server

## Start the JSON server to simulate backend operations 
json-server --watch db.json

## Run the Application
Simply open the index.html file in your browser. Ensure the JSON server is running before interacting with the app.

##  Usage

## Adding a Menu Item

Navigate to the "Add Menu Item" form.

Fill in the name, price, description, and image URL of the item.

Click "Submit" to add the item to the menu.

## Editing a Menu Item

Select the item you want to edit from the menu.

Click "Edit" to open the modal with pre-filled values.

Modify the fields and submit to save changes.

## Placing an Order

Choose the items you want from the menu.

Click "Order Now" to add them to the cart.

View the order summary by clicking "View Order Summary."

## Deleting a Menu Item

Click the "Delete" button associated with the item.

Confirm deletion to remove it from the menu.

## Adding Custom Items

Go to the "Add Custom Item" section.


Fill in the name, price, and description.

Add the custom item to the menu, and it will appear in the order list.

## Live Demo And Source code 
you can view this App uing the deployed link [https://mubarak-baka.github.io/HotelOrderingApp/] on github 
& also  [https://hotelorderingapp.onrender.com]


## Future Enhancements
User Authentication: Add login functionality for hotel staff and guests, with different access levels.

Order Notifications: Implement real-time notifications for hotel staff when a new order is placed.

Payment Gateway: Integrate a simple payment method for learning purposes.

Order Sorting: Add functionality to sort orders based on priority or time.

## licence 
This project is licensed under the MIT License. See the file for more details.[https://github.com/Mubarak-baka/HotelOrderingApp/blob/master/License.md]
