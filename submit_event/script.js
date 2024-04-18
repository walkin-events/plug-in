let logo = ''; // This will hold your Base64 image data
let banner = ''; // This will hold your Base64 image data

document.getElementById('file-input').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = new Image();
            img.src = e.target.result;
            var wrapper = document.querySelector('.upload-btn-wrapper');
            wrapper.innerHTML = ''; // Clear previous contents
            wrapper.appendChild(img); // Add new image
            logo = e.target.result; // Store the Base64 string
        };
        reader.readAsDataURL(file);
    }
});


document.getElementById('file-input-banner').addEventListener('change', function(event) {
    displayImage(event, '.upload-btn-wrapper-banner');
});

function displayImage(event, wrapperSelector) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = document.createElement('img');
            img.src = e.target.result;
            var wrapper = document.querySelector(wrapperSelector);
            wrapper.innerHTML = ''; // Clear previous contents
            wrapper.appendChild(img); // Add new image
            banner = e.target.result; // Store the Base64 string
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('submit-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent the form from submitting traditionally
    var title = document.getElementById('title').value.trim();
    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var company = document.getElementById('company').value.trim();
    var website = document.getElementById('website').value.trim();
    var linkein = document.getElementById('linkein').value.trim();
    var inputField = document.getElementById('inputField').value.trim();
    var description = document.getElementById('description').value.trim();
    var location = document.getElementById('location').value.trim();
    var start = document.getElementById('start-date-time').value.trim();
    var end = document.getElementById('end-date-time').value.trim();
    var capacity = document.getElementById('capacity').value.trim();
    var type =document.getElementById('dropdown1').value.trim();
    if (!title || 
        !name || 
        !email || 
        !company || 
        !website || 
        !linkein || 
        !inputField || 
        !description|| 
        !location|| 
        !start|| 
        !end|| 
        !capacity|| 
        !type) {  // Checks if the job title field is empty or just whitespace
        alert("Fill in all info.");  // Alert or you could use a more user-friendly notification
        return;  // Stop the function if validation fails
    }

    // Convert from Dubai Time to UTC
    var utcStartDate = moment.tz(start, "YYYY-MM-DD HH:mm", "Asia/Dubai").utc().format();
    var utcEndDate = moment.tz(end, "YYYY-MM-DD HH:mm", "Asia/Dubai").utc().format();
    // Hide the form container
    document.getElementById('page-container').style.display = 'none';
    // Show the success message
    document.getElementById('success-container').style.display = 'flex';
    // Manually collect each input's value
    var formData = {
        email: email, // Assuming 'title2' is the ID for the email input
        name: name, // Assuming 'title1' is the ID for the name input
        jobTitle: title,
        companyName: company,
        logo: logo, // This will include the file in the JSON which is not typically supported unless handled specially on the server
        companyWebsite: website,
        LinkedIn: linkein,
        twitter: document.getElementById('twitter').value,
        telegram: document.getElementById('telegram').value,
        eventTitle: inputField,
        banner: banner, // Same issue as logo with file handling
        description:description,
        location: location,
        startDate: utcStartDate,
        endDate: utcEndDate,
        capacity: capacity,
        type: type,
        externalLink: document.getElementById('inputField2').value,
        wallet: document.getElementById('wallet').value,
        partner: "38423137656" 
    };

    // Post the JSON data to your server
    fetch('https://walkin.events/api/1.1/wf/submit-external-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) // Convert the JavaScript object to a JSON string
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#start-date-time", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
    });
    flatpickr("#end-date-time", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
    });
});


document.addEventListener('DOMContentLoaded', function() {
    $('#guest-type').select2({
        placeholder: "Select guest types",
        allowClear: true,
        tags: false, // Allows the creation of new tags
        tokenSeparators: [',', ' '], // Defines separators for tokenizing input into tags
        closeOnSelect: false // Keeps the dropdown open after a selection is made
    });
});

  
  