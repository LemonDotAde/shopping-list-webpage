
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnqVp-tdMmviYRK61MgOVTgh5KPv3YrE8",
  authDomain: "lemondotade.firebaseapp.com",
  projectId: "lemondotade",
  storageBucket: "lemondotade.appspot.com",
  messagingSenderId: "831552704186",
  appId: "1:831552704186:web:a0bbb1a77445bf53bbfc83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase initialized');
    loadCompletedLists();
});

window.addItem = addItem;

window.addItem = addItem;

async function addItem() {
    console.log('Add Item button clicked');
    const newItemInput = document.getElementById('new-item');
    console.log('New item input:', newItemInput);
    const newItemText = newItemInput.value.trim();
    if (newItemText === '') return;

    const listItem = createListItem(newItemText);
    document.getElementById('shopping-list').appendChild(listItem);
    newItemInput.value = '';
}

function createListItem(text) {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', handleCheckboxChange);

    const span = document.createElement('span');
    span.textContent = text;
    span.contentEditable = true;

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.addEventListener('input', (e) => {
        listItem.style.backgroundColor = e.target.value;
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    listItem.appendChild(colorPicker);
    return listItem;
}

function handleCheckboxChange(e) {
    const listItem = e.target.parentElement;
    if (e.target.checked) {
        listItem.style.textDecoration = 'line-through';
    } else {
        listItem.style.textDecoration = 'none';
    }
    checkIfListCompleted();
}

function checkIfListCompleted() {
    const listItems = document.querySelectorAll('#shopping-list li');
    const allChecked = Array.from(listItems).every(item => item.querySelector('input[type="checkbox"]').checked);
    if (allChecked && listItems.length > 0) {
        saveCompletedList();
    }
}

async function saveCompletedList() {
    const listItems = document.querySelectorAll('#shopping-list li');
    const completedList = Array.from(listItems).map(item => ({
        text: item.querySelector('span').textContent,
        color: item.querySelector('input[type="color"]').value
    }));
    const totalCost = prompt('Enter total cost for the list (optional):', '');
    await addDoc(collection(db, "completedLists"), { list: completedList, totalCost: totalCost });
    loadCompletedLists();
    document.getElementById('shopping-list').innerHTML = '';
}

async function loadCompletedLists() {
    const querySnapshot = await getDocs(collection(db, "completedLists"));
    const completedListsContainer = document.getElementById('completed-lists');
    completedListsContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const listElement = document.createElement('li');
        listElement.textContent = `List ${doc.id}`;

        const totalCostElement = document.createElement('span');
        totalCostElement.textContent = data.totalCost ? `Total Cost: €${data.totalCost}` : 'Total Cost: N/A';
        totalCostElement.style.marginLeft = '20px';
        listElement.appendChild(totalCostElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '20px';
        deleteButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            await deleteDoc(doc(db, "completedLists", doc.id));
            loadCompletedLists();
        });
        listElement.appendChild(deleteButton);

        listElement.addEventListener('click', () => {
            displayCompletedList(data.list);
        });
        completedListsContainer.appendChild(listElement);
    });
}

function displayCompletedList(list) {
    const shoppingListContainer = document.getElementById('shopping-list');
    shoppingListContainer.innerHTML = '';
    list.forEach(item => {
        const listItem = createListItem(item.text);
        listItem.style.backgroundColor = item.color;
        listItem.querySelector('input[type="checkbox"]').checked = true;
        listItem.style.textDecoration = 'line-through';
        listItem.querySelector('span').style.color = '#000'; // Ensure text color is readable
        shoppingListContainer.appendChild(listItem);
    });
}
