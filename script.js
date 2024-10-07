
document.addEventListener('DOMContentLoaded', () => {
    loadCompletedLists();
});

window.addItem = addItem;

function addItem() {
    const newItemInput = document.getElementById('new-item');
    const newItemText = newItemInput.value.trim();
    console.log('Add Item button clicked');
    if (newItemText === '') {
        console.log('No item text provided');
        return;
    }

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

function saveCompletedList() {
    const listItems = document.querySelectorAll('#shopping-list li');
    const completedList = Array.from(listItems).map(item => ({
        text: item.querySelector('span').textContent,
        color: item.querySelector('input[type="color"]').value
    }));
    const completedLists = JSON.parse(localStorage.getItem('completedLists')) || [];
    const totalCost = prompt('Enter total cost for the list (optional):', '');
    completedLists.push({ list: completedList, totalCost: totalCost });
    localStorage.setItem('completedLists', JSON.stringify(completedLists));
    loadCompletedLists();
    document.getElementById('shopping-list').innerHTML = '';
}

function loadCompletedLists() {
    const completedLists = JSON.parse(localStorage.getItem('completedLists')) || [];
    const completedListsContainer = document.getElementById('completed-lists');
    completedListsContainer.innerHTML = '';
    completedLists.forEach((list, index) => {
        const listElement = document.createElement('li');
        listElement.textContent = `List ${index + 1}`;

        const totalCostElement = document.createElement('span');
        totalCostElement.textContent = list.totalCost ? `Total Cost: €${list.totalCost}` : 'Total Cost: N/A';
        totalCostElement.style.marginLeft = '20px';
        listElement.appendChild(totalCostElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '20px';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCompletedList(index);
        });
        listElement.appendChild(deleteButton);

        listElement.addEventListener('click', () => {
            displayCompletedList(list.list);
        });
        completedListsContainer.appendChild(listElement);
    });
}

function deleteCompletedList(index) {
    const completedLists = JSON.parse(localStorage.getItem('completedLists')) || [];
    completedLists.splice(index, 1);
    localStorage.setItem('completedLists', JSON.stringify(completedLists));
    loadCompletedLists();
}

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
