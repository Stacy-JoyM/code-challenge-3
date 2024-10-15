// Your code here
document.addEventListener('DOMContentLoaded', function() {

  //Get movie to show 
  fetch('http://localhost:3000/films/1')
  .then((response) => response.json())
  .then((data) => {
    let id = data.id
    let title = data.title
    let runtime = data.runtime
    let description = data.description
    let poster = data.poster
    let showtime = data.showtime
    let available_tickets = checkAvailable(data)


    //function that checks availability
    function checkAvailable(data){
        return Math.max(0, data.capacity - data.tickets_sold)
    }

  //  Update the DOM
    document.getElementById("title").textContent = title;
    document.getElementById("runtime").textContent= `${runtime} minutes`
    document.getElementById("film-info").textContent = description
    document.getElementById("showtime").textContent = showtime
    document.getElementById("ticket-num").textContent = available_tickets
    document.getElementById("poster").src = poster
    document.getElementById("poster").alt = title
    document.getElementById("buy-ticket").setAttribute("onclick", `buyTicket(${id})`)

    //function to buy ticket
    window.buyTicket = function(id){
      //Makes update request
      fetch(`http://localhost:3000/films/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
         tickets_sold : data.tickets_sold + 1
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then((response) => response.json())
      .then((json) => console.log(json))
        
    };
      
      //change text content of button if there are 0 tickets
    if(document.getElementById("ticket-num").textContent == 0){
      document.getElementById("buy-ticket").textContent= "Sold Out"
    }

  })
  .catch((error)=>{console.error("Error fetching first film" , error)})


  //Display the list of movies 
  fetch('http://localhost:3000/films')
  .then((response) => response.json())
  .then((data) => {
    //clear content in ul before adding li 
    document.getElementById("films").innerHTML = ""
    
    for (film of data){
      //creating the li elements with title 
      film_name = document.createElement("li") 
      film_name.textContent = film.title
      //Add button 
      delete_button = document.createElement("button")
      delete_button.setAttribute("onclick", `deleteFilm(this)`)
      delete_button.className = "ui red button"
      delete_button.textContent = "X"
      //Append button to li
      film_name.appendChild(delete_button)
      //Add class
      film_name.className = "film item"
      //Apend li elements to ul
      document.getElementById("films").appendChild(film_name)

     //make the movie sold out in li 
      if(document.getElementById("ticket-num").textContent == 0){
        film_name.className = "film item sold-out"
      }   
    }
  })
  .catch((error)=>console.error("Error getting list of movies", error))
  //global function that deletes the items of list
  window.deleteFilm = function(button){
    button.parentElement.remove()

  }
});