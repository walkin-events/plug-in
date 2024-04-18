let apiData = []; // Global variable to store fetched data
let lastClickedDate = null; // Global variable to keep track of the last clicked date
let selectedDate = null;
let selectedEventType = null;
let is_featured;

document.addEventListener("DOMContentLoaded", function() {
    fetch('https://walkin.events/api/1.1/obj/eventview?constraints=[ { "key": "is_display_conference", "constraint_type": "equals", "value": "yes" }, { "key": "partner_id", "constraint_type": "equals", "value": "1713089770450x118443352087524100" }]')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const { response } = data;
            const { results } = response;
            apiData = results.map(item => ({
                title: item.Title,
                banner: "https:" + item.Banner,
                startDate: new Date(item.StartDate),
                endDate: item.EndDate,
                timezone: item.Timezone,
                type: item.EventType,
                is_featured: item.is_special,
                hosts: item.HostCompany,
                dateFormatted: item.StartDateFormatted,
                id: item._id
            }));

            displayParsedItems(apiData);
            displayEventTypes();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Add event listeners to cells in the top section table
    document.querySelectorAll(".top-section td").forEach((cell, index) => {
        cell.addEventListener("click", function() {
            filterTableByDate(index);
        });
    });

    const toggleButtons = document.querySelectorAll('.toggle-buttons button');
    toggleButtons[0].classList.add('selected-toggle');
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleToggleButtonClick(index));
    });

    // Add event listeners to all buttons with class find-sponsors
    const findSponsorsButtons = document.querySelectorAll('.find-sponsors');
    findSponsorsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Open a new tab with the specified URL
            window.open('https://getcohosts.com', '_blank');
        });
    });

    const datePicker = flatpickr("#eventDatePicker", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        locale: { "firstDayOfWeek": 1 },
        onChange: function(selectedDates, dateStr, instance) {
            selectedDate = dateStr;
            applyFilters();
        },
        onOpen: function(selectedDates, dateStr, instance) {
            instance.calendarContainer.style.border = '2px solid var(--lead-color)';
        },
        onReady: function(selectedDates, dateStr, instance) {
            instance.altInput.placeholder = 'Choose date'; // Placeholder text
        }
    });
    fetchEventsData(); // Fetch data from the API
    setUpEventListeners(datePicker); // Set up UI event listeners
});

function setUpEventListeners(datePicker) {
    document.getElementById('clearDatePicker').addEventListener('click', function() {
        datePicker.clear();
        datePicker.input.value = '';  // Explicitly clear the input value
        selectedDate = null;
        applyFilters();
    });
}

function applyFilters() {
    let filteredEvents = apiData.filter(event => {
        return (!selectedDate || formatDateForFiltering(new Date(event.startDate)) === selectedDate)
            && (!selectedEventType || event.type === selectedEventType)
            && (!is_featured || event.is_featured === true);
    });
    displayParsedItems(filteredEvents);
}

function fetchEventsData() {
    fetch('https://walkin.events/api/1.1/obj/eventview?constraints=[ { "key": "is_display_conference", "constraint_type": "equals", "value": "yes" }, { "key": "partner_id", "constraint_type": "equals", "value": "1713089770450x118443352087524100" }]')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            apiData = processEventData(data);
            displayParsedItems(apiData);
            displayEventTypes();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function applyFilters() {
    let filteredEvents = apiData;

    if (selectedDate) {
        filteredEvents = filteredEvents.filter(event => formatDateForFiltering(new Date(event.startDate)) === selectedDate);
    }

    if (selectedEventType) {
        filteredEvents = filteredEvents.filter(event => event.type === selectedEventType);
    }

    if (is_featured) {
        filteredEvents = filteredEvents.filter(event => event.is_featured === true);
    }

    displayParsedItems(filteredEvents);
}


function displayParsedItems(data) {
    const container = document.querySelector("#dataTable tbody");
    container.innerHTML = ''; // Clear existing content

    const grid = document.createElement('div');
    grid.className = 'grid-container';

    // Sort the data by is_featured first, then by startDate
    data.sort((a, b) => {
        // Sort by is_featured (true first)
        if (a.is_featured && !b.is_featured) {
            return -1;
        } else if (!a.is_featured && b.is_featured) {
            return 1;
        } else {
            // If both have the same is_featured value, sort by startDate
            return a.startDate - b.startDate;
        }
    });

    data.forEach((item) => {
        const box = document.createElement('div');
        box.classList.add("box");

        const imageContainer = document.createElement('div');
        imageContainer.classList.add("image-container");

        const img = document.createElement("img");
        img.classList.add("banner");
        img.src = item.banner;
        img.alt = item.title;

        imageContainer.appendChild(img);

        const titleContainer = document.createElement("div");
        titleContainer.classList.add("title-container");

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = truncateTitle(item.title); // Truncate the title
        title.title = item.title; // Set full title as tooltip

        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");

        const column1 = document.createElement("div");
        column1.classList.add("column");

        const hosts = document.createElement("div");
        hosts.classList.add("hosts");
        hosts.textContent = "By " + item.hosts;

        const startDate = document.createElement("div");
        startDate.classList.add("startDate");
        startDate.textContent = item.dateFormatted;

        column1.appendChild(hosts);
        column1.appendChild(startDate);

        const column2 = document.createElement("div");
        column2.classList.add("column-register");

        const registerButton = document.createElement("button");
        registerButton.classList.add("register");
        registerButton.textContent = "REGISTER";

        if (item.is_featured===true) {
            box.classList.add("box-featured");
            title.classList.add("text-featured");
            hosts.classList.add("text-featured");
            startDate.classList.add("text-featured");
            registerButton.classList.add("button-featured");
        }

        column2.appendChild(registerButton);

        infoContainer.appendChild(column1);
        infoContainer.appendChild(column2);

        titleContainer.appendChild(title);

        box.appendChild(imageContainer);
        box.appendChild(titleContainer);
        box.appendChild(infoContainer);

        box.addEventListener("click", function() {
            // Open the link associated with the item in a new tab
            window.open("https://walkin.events/event/"+item.id, '_blank');
        });

        container.appendChild(box);
         grid.appendChild(box); // Append the box to the grid
    });

    container.appendChild(grid);
}

function filterTableByDate(index) {
    const selectedDate = document.querySelector(`.top-section td:nth-child(${index + 1})`).getAttribute("data-date");
    const filteredData = apiData.filter(item => formatDateForFiltering(new Date(item.startDate)) === selectedDate);

    displayParsedItems(filteredData);
}

function formatDateForFiltering(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayEventTypes() {
    const eventTypes = ['All', 'Meetup', 'Brunch', 'Dinner', 'Party', 'Workshop', 'Other'];
    const list = document.querySelector('.dynamic-list');
    list.innerHTML = '';

    eventTypes.forEach(type => {
        const listItem = document.createElement('li');
        listItem.textContent = type;
        listItem.style.cursor = 'pointer';
        listItem.addEventListener('click', () => filterEventsByType(type));
        if (type === 'All') {
            listItem.classList.add('selected');
        }
        list.appendChild(listItem);
    });

    const selectedItem = eventTypes.find(item => item.textContent === "All");
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
}

function filterEventsByType(type) {
    const typeItems = document.querySelectorAll('.dynamic-list li');
    typeItems.forEach(item => item.classList.remove('selected'));

    // Check if 'All' is clicked or another type is selected
    if (type === 'All') {
        selectedEventType = null; // Reset event type filter
        const selectedItem = Array.from(typeItems).find(item => item.textContent === "All");
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
    } else {
        if (selectedEventType !== type) {
            selectedEventType = type;
            const selectedItem = Array.from(typeItems).find(item => item.textContent === type);
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
        } else {
            selectedEventType = null;
            document.querySelector('.dynamic-list li:first-child').classList.add('selected');
        }
    }

    applyFilters();
}

function handleToggleButtonClick(index) {
    const toggleButtons = document.querySelectorAll('.toggle-buttons button');
    toggleButtons.forEach(button => button.classList.remove('selected-toggle'));
    toggleButtons[index].classList.add('selected-toggle');

    if (index === 1) {
        // Show only featured events
        is_featured = true;
    } else {
        // Reset event type filter
        is_featured = null;
    }

    applyFilters();
}

function truncateTitle(title) {
    const maxLength = 20; // Maximum length of the title
    if (title.length > maxLength) {
        return title.substring(0, maxLength - 3) + '..'; // Truncate and add ellipsis
    } else {
        return title;
    }
}

function processEventData(data) {
    const { response } = data;
    const { results } = response;

    // Map through each event and transform it into a more usable object
    return results.map(item => ({
        title: item.Title,
        banner: item.Banner,
        startDate: new Date(item.StartDate),
        endDate: item.EndDate,
        timezone: item.Timezone,
        type: item.EventType,
        is_featured: item.is_special,
        hosts: item.HostCompany,
        dateFormatted: item.StartDateFormatted,
        id: item._id
    }));
}
