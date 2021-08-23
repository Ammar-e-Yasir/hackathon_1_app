console.log('connected');

let auth = firebase.auth();
let storage = firebase.storage();
let db = firebase.firestore();

let userNameEl = document.getElementById('user-name');
let emailEl = document.getElementById('email');
let passwordEl = document.getElementById('password');
let userRoleEl = document.getElementsByName('user-role');
let userImageEl = document.getElementById('upload-image');
let customImgEl = document.getElementById('custom-image');




function imageSelected() {
    let image = userImageEl.files[0];
    customImgEl.src = `./images/${image.name}`;
}
    
let restaurantName = document.getElementById('restaurant-name');
let countryName = document.getElementById('country-name');
let cityName = document.getElementById('city-name');
let phone = document.getElementById('phone');


// **************** Add Restaurant *********************

async function registerRestaurant(){
    let userCreated = await auth.createUserWithEmailAndPassword(emailEl.value, passwordEl.value);
    let RID = userCreated.user.uid;
    // console.log('Restaurant Register Successfully !')
    

    await db.collection('Restaurants').doc(RID).set({
        restaurantName : restaurantName.value,
        email : emailEl.value,
        countryName :countryName.value,
        cityName : cityName.value,
        uid : RID
    });

    alert('Registraion Successfull !')
        window.location='dashboard.html';
}
async function fetchRestaurantDetail(){

    let restaurantData = await db.collection('Restaurants').get();
    // console.log(restaurantData)
    restaurantData.forEach((res)=>{
        // console.log(res.data())
        document.getElementById('displayRestaurant').innerHTML += `
        <div class='col-4'>
        <div class="card m-4">
        <div class="card-body">
            <h2 class="card-title text-success"> ${res.data().restaurantName}</h2>
            <h4 class="card-text">Country_${res.data().countryName}</p>
            <h4 class="card-text">City_${res.data().cityName}</p>
            <a href="user_home_page.html" class="btn btn-primary">Explore</a>
  </div>
  </div>
         </div>
        `
    })

}













// _____________________________________________________________________//



// ********Add USer **************



async function registerUser(){
    let userCreated = await auth.createUserWithEmailAndPassword(emailEl.value, passwordEl.value);
    let UID = userCreated.user.uid;
    console.log('User Register Successfully !')
    

    await db.collection('Users').doc(UID).set({
        userName : userNameEl.value,
        email : emailEl.value,
        phone : phone.value,
        countryName : countryName.value,
        cityName : cityName.value,
        uid : UID
    });
    alert('Registeration Successfull !')

        window.location='restaurant.html';


    
}

// ______________________________________________________________________________//



// ********SignIn User *********************
   
async function signinUser(){
    await auth.signInWithEmailAndPassword(emailEl.value, passwordEl.value);
    let userRole = checkUserRole();
    if(userRole === 'Restaurant'){
        // window.location = 'restaurant_main_page.html';
        // window.location='addDishes.html';
        window.location = 'dashboard.html';


    }
    else if(userRole === 'Customer'){
        // window.location = 'home.html';
        window.location = 'restaurant.html';
        


    }
}

    function checkUserRole(){
        let checkedProp;
        for(let i = 0; i < userRoleEl.length; i++){
            if(userRoleEl[i].checked){
                checkedProp = userRoleEl[i].value;

            }
        }

        return checkedProp;

    }


//  ______________________________________________________________________________// 


// ***********SignOut**************
    
    
    async function signout(){
        await auth.signOut();
        window.location = 'signin.html';
        let user= auth.currentUser;
        let pageLocArr = window.location.href.split('/');
        let pageName = pageLocArr[pageLocArr.length - 1];
        let authenticatedPages = ['home.html'];
    
        if (!user && authenticatedPages.indexOf(pageName) === -1) {
            window.location = './signin.html';
        }
      
    

    }
    
// _________________________________________________________________________//
 

// *************Add Dishes***************************


let catagoryEl = document.getElementById('catagory');
let itemNameEl = document.getElementById('itemName');
let priceEl = document.getElementById('price');
let deliveryEl = document.getElementById('delivery');

async function addDish(){

        let image = userImageEl.files[0];
        let catagoryEl = document.getElementById('catagory').value;
        let itemNameEl = document.getElementById('itemName').value;
        let priceEl = document.getElementById('price').value;
        let deliveryEl = document.getElementById('delivery').value;
        let imageURL = await uploadImageToStorage();
      


   let addDishItem = {
       food_image : imageURL,
       food_catagory : catagoryEl,
       food_name : itemNameEl,
       food_price : priceEl,
       food_delivery : deliveryEl
   }


let addDish = await db.collection('Dishes').add(addDishItem);
let addDishId = addDish.id;
console.log(addDishId,'Dish Add Successfully !')
alert('Dish Add Successfully !')

}


async function uploadImageToStorage(){
    let image = userImageEl.files[0];
    let storageRef = storage.ref();
    let imageRef = storageRef.child(`images/${image.name}`);
    await imageRef.put(image);
    let url = await imageRef.getDownloadURL();
    return url;
    }
   
//_____________________________________________________________________________//    
    




// ***********Fetch Dish Data ***********


async function fetchDishData(){

    let dishData = await db.collection('Dishes').get();
    // console.log(dishData)
    dishData.forEach((doc)=>{
        // console.log(doc.data())
        document.getElementById('toShow').innerHTML += `
        <div class='col-4'>
        <div class="card m-4">
          <img class="card-img-top" src ='${doc.data().food_image}' alt="Card image cap" height = '300px'>
        <div class="card-body">
            <h2 class="card-title">${doc.data().food_name}</h2>
            <p class="card-text">Rs .${doc.data().food_price}</p>
            <p class="card-text">Delivery : ${doc.data().food_delivery}</p>
            <a href="#" class="btn btn-primary" onclick = 'addToCart()'>Order</a>
  </div>
  </div>
         </div>
        `
    })
        
    
    }
    