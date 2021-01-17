const search = (data) => {
  let dataFilter;

  const filter = () => {
    const searchTerm = document.getElementById("search").value;
    const pattern = new RegExp(`\\b.*${searchTerm}.*\\b`, "i");

    if(searchTerm){
      dataFilter = [];
      data.filter( property => {
        if ( !property.name.search(pattern) || !property.property_type.search(pattern) ) dataFilter.push(property)
      });
    }
    dataFilter.map(
      property => {
        cardTemplate(property.name, property.photo, property.property_type, property.price);
      }
    ) 
    pagination(dataFilter)
  }

  const searchBtn = document.getElementById("submit-btn");
  searchBtn.addEventListener("click", filter);
}

const booking = (e) => {
  const main = document.getElementById("main-content");
  const getCardInfo = e.target.parentElement.parentElement.innerText.split("\n");
  const cardInfo = getCardInfo.filter( string => string);
  const cardImg = e.target.parentElement.parentElement.firstElementChild.firstElementChild.src;

  const modal = `
    <div class="booking-modal">
      <div class="booking-card">
        <h2 class="booking-title">${cardInfo[0]}</h2>
        <div class="booking-img-wraper">
          <img src="${cardImg}" class="booking-img">
        </div>
        <div class="booking-info-wraper">
          <div class="booking-info-container">
            <p class="booking-label">Tipo de propriedade: </p>
            <p class="booking-type">${cardInfo[1]}<p/>
          </div>
          <div class="booking-info-container">
            <p class="booking-label">Diária: </p>
            <p class="booking-price">${cardInfo[2]}</p>
          </div>
          <div class="booking-info-container">
            <p class="booking-label">Check-in: </p>
            <div class="booking-input-wraper">
              &#128198;
              <input type="date" name="checkin" id="checkin" autocomplete="off">
            </div>
          </div>
          <div class="booking-info-container">
            <p class="booking-label">Check-out: </p>
            <div class="bookinginput-wraper">
              &#128198;
              <input type="date" name="checkout" id="checkout" autocomplete="off">
            </div>
          </div>
          <div class="booking-info-container">
            <p class="booking-label">Total: </p>
            <p id="booking-total">${cardInfo[2]}</p>
          </div>
          <div class="booking-btn-wraper">
            <button id="booking-cancel" class="booking-btn">Cancelar <p class="booking-btn-icon">&#10006;</p></button>
            <button id="booking-book" class="booking-btn">Continuar <p class="booking-btn-icon">&#10140;</p></button>
          </div>
        </div>
      </div>
    </div>
  `;
  main.insertAdjacentHTML("afterbegin", modal);

  const stay = () => {
    let stay = null;
    let totalPrice = `${cardInfo[2]}`;
    const checkinValue = checkin.value;
    const checkoutValue = checkout.value;

    const checkinDateNum = new Date(checkinValue).getTime();
    const checkoutDateNum = new Date(checkoutValue).getTime();

    if (checkinValue && checkoutValue){
      stay = (checkoutDateNum - checkinDateNum)/1000/60/60/24;
      totalPrice = `R$${Number(cardInfo[2].slice(2))*stay}`;
      const totalTemplate = document.getElementById("booking-total");
      totalTemplate.innerHTML = totalPrice;
    }
  }
  const checkin = document.getElementById("checkin");
  checkin.addEventListener("input", stay);
  const checkout = document.getElementById("checkout");
  checkout.addEventListener("input", stay);
  
  const close = document.getElementById("booking-cancel");
  close.addEventListener("click", () => {
    main.removeChild(main.childNodes[1]);
  });

  const bookForm = () => {
    console.log("Reservado com sucesso!")
  }
  const book = document.getElementById("booking-book");
  book.addEventListener("click", bookForm);
}

const pagination = (data) => {
  const cardList = document.getElementById("card-list");
  let pageSize = 8;
  const totalPages = Math.ceil(data.length/pageSize);
  let currentPage = 1;
 
  const activePage = () => {
    const getPages = document.getElementById("pagination").children;
    const active = getPages[currentPage-1];

    for( page of getPages){
      page.style.background = "#FFF";
      page.style.color = "#333";
    }

    active.style.background = "#888";
    active.style.color = "#FFF";
  }

  const changePage = (e) => {
    if( currentPage === totalPages ){
      currentPage = parseInt(e.target.innerText);
      showItems();
    } else{
      currentPage = parseInt(e.target.innerText);
      showItems();
    }
    activePage();
  };

  const showItems = () => {
    const pageItems = [...data.slice((currentPage*pageSize-pageSize), currentPage*pageSize)]
    cardList.innerHTML = "";
    pageItems.map( item => {
      const card = cardTemplate(item.name, item.photo, item.property_type, item.price)
      cardList.insertAdjacentHTML("afterbegin", card);
    })  
    const bookingBtns = document.querySelectorAll(".card-cta");
    bookingBtns.forEach( btn => {
      btn.addEventListener("click", booking);
    })
  };
  showItems();

  const paginationWraper = document.getElementById("pagination");
  paginationWraper.innerHTML = "";

  for(i = 1; i < totalPages + 1; i++){
    const pageBtn = `
    <div class="pageBtn">
      ${i}
    </div>`;
    paginationWraper.insertAdjacentHTML("beforeend", pageBtn);

    const styleFirstPage = () => {
      paginationWraper.children[0].style.background = "#888";
      paginationWraper.children[0].style.color = "#FFF";
    }
    styleFirstPage()
    
  }
  const pageBtns = document.querySelectorAll(".pageBtn");
  pageBtns.forEach( btn => {
    btn.addEventListener("click", changePage);
  })
}

const cardTemplate = (name, photo, type, price) => {
  return `
  <div class="card">
    <div class="card-header">
      <img class="card-img" src="${photo}">
    </div>
    <div class="card-body">
      <h2 class="card-name">${name}</h2>
      <p class="card-type">${type}</p>
    </div>
    <div class="card-footer">
      <p class="card-price">R$${price}</p>
      <button class="card-cta">Reservar</button>
    </div>
  </div>`
}

async function fetchData(url){
 await fetch(url)
  .then(res => {
    if(res.ok){
      return res.json()
    } 
  })
  .then( data => {
    data.map(
      property => {
        cardTemplate(property.name, property.photo, property.property_type, property.price);
      }
    )
    pagination(data)
    search(data)
  })
}

fetchData("https://dry-cliffs-94979.herokuapp.com/");