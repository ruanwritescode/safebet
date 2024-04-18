var app = new Vue({
    el: '#app',
    data: {
        team: [
            { name: 'Ruan Abarbanel', image: '', description: 'Software Engineer' },
            { name: 'Rohan Adepu', image: '', description: 'Software Engineer' },
            { name: 'Joshua Gildred', image: '', description: 'Software Engineer' },
            { name: 'Chasen Goren', image: '', description: 'Software Engineer' },
            { name: 'Robiel Kennedy', image: '', description: 'Software Engineer' },
            { name: 'Aaron Van', image: '', description: 'Software Engineer' },
        ]
    }
});

// When the user clicks on <div>, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }