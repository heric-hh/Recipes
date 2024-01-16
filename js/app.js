function initApp() {

    const selectCategories = document.querySelector( "#categorias" );
    const results = document.querySelector( "#resultado" );

    if ( selectCategories ) {
        selectCategories.addEventListener( "change" , selectCategory );
        getCategories();
    }

    const favoritesDiv = document.querySelector( ".favoritos" );
    
    if ( favoritesDiv ) {
        getFavorites();
    }

    const modal = new bootstrap.Modal( "#modal" , {});


    function getCategories() {
        const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
        fetch ( url )
            .then( response => {
                return response.json();
            })
            .then ( results => showCategories( results.categories ) );
    }


    function showCategories( categories = [] ) {
        
        categories.forEach( category => {
            
            const { strCategory } = category;
            const option = document.createElement( "OPTION" );
            option.value = category.strCategory;
            option.textContent = strCategory;
            selectCategories.appendChild( option );

        });

    }


    function selectCategory( e ) {
        const selectedCategory = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
        fetch( url )
            .then( response => response.json() )
            .then( results => showRecipes( results.meals ) );
    }


    function showRecipes( meals = [] ) {

        clearHTML( results );

        const heading = document.createElement( "H2" );
        heading.classList.add( "text-center" , "text-black" , "my-5" );
        heading.textContent = meals.length ? "Results:" : "No results";
        results.appendChild( heading );

        meals.forEach( meal => {

            const { idMeal , strMeal , strMealThumb } = meal;

            const mealContainer = document.createElement( "DIV" );
            mealContainer.classList.add( "col-md-4" );

            const mealCard = document.createElement( "DIV" );
            mealCard.classList.add( "card" , "mb-4" );

            const mealImage = document.createElement( "IMG" );
            mealImage.classList.add( "card-img-top" );
            mealImage.alt = `Meal image: ${strMeal} ?? meal.img`;
            mealImage.src = strMealThumb ?? meal.img;

            const mealCardBody = document.createElement( "DIV" );
            mealCardBody.classList.add( "card-body" );

            const mealHeading = document.createElement( "H3" );
            mealHeading.classList.add( "card-title" );
            mealHeading.textContent = strMeal ?? meal.title;

            const mealButton = document.createElement( "BUTTON" );
            mealButton.classList.add( "btn" , "btn-danger" , "w-100" );
            mealButton.textContent = "View Recipe";
            mealButton.onclick = function() {
                selectMeal( idMeal ?? meal.id );
            }

            mealCardBody.appendChild( mealHeading );
            mealCardBody.appendChild( mealButton );

            mealCard.appendChild( mealImage );
            mealCard.appendChild( mealCardBody );

            mealContainer.appendChild( mealCard );
            results.appendChild( mealContainer );

        });
    }


    function clearHTML( tag ) {
        
        while( tag.firstChild ) {
            tag.removeChild( tag.firstChild );
        }
    }


    function selectMeal( idMeal ) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

        fetch( url )
            .then( response => response.json() )
            .then( results => showMealModal( results.meals[0] ) ); 
    }


    function showMealModal( meal ) {

        const { idMeal , strInstructions , strMeal , strMealThumb } = meal;
        const modalTitle = document.querySelector( ".modal .modal-title" );
        const modalBody =  document.querySelector( ".modal .modal-body" );
        
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="${strMeal}" /> 
            <h3 class="my-3">Instructions</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredients and Measures</h3>
        `;

        const listGroup = document.createElement( "UL" );
        listGroup.classList.add( "list-group" ); 

        for( let i = 1; i <= 20; i++ ) {
            if ( meal[`strIngredient${i}`] ) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                const ingredientLI = document.createElement( "LI" );
                ingredientLI.classList.add( "list-group-item" );
                ingredientLI.textContent = `${ingredient} - ${measure}`;
                listGroup.appendChild( ingredientLI );
            }
        }

        modalBody.appendChild( listGroup );

        const modalFooter = document.querySelector( ".modal-footer" );
        clearHTML( modalFooter );

        const btnFavorite = document.createElement( "BUTTON" );
        btnFavorite.classList.add( "btn" , "btn-danger" , "col" );
        btnFavorite.textContent = existsStorage( idMeal ) ? "Delete Favorite" : "Save Favorite";

        btnFavorite.onclick = function() {
            
            if ( existsStorage( idMeal ) ) {
                
                deleteFavorite( idMeal ); 
                btnFavorite.textContent = "Save Favorite";
                showToast( "Deleted Correctly" );
                return;

            }

            addFavorite( {
                id: idMeal,
                title: strMeal,
                img: strMealThumb }
            );
            btnFavorite.textContent = "Delete Favorite";
            showToast( "Added Correctly" );

        }

        const btnCloseModal = document.createElement( "BUTTON" );
        btnCloseModal.classList.add( "btn" , "btn-secondary" , "col" );
        btnCloseModal.textContent = "Close"

        btnCloseModal.onclick = function () {
            modal.hide();
        }

        modalFooter.appendChild( btnFavorite );
        modalFooter.appendChild( btnCloseModal );
        modal.show();

    }


    function addFavorite( meal ) {

        const favorites = JSON.parse( localStorage.getItem( "favorites" ) ) ?? [];
        localStorage.setItem( "favorites" , JSON.stringify( [...favorites , meal ] ) );

    }


    function deleteFavorite( idMeal ) {

        const favorites = JSON.parse( localStorage.getItem( "favorites" ) ) ?? [];
        const newFavorites = favorites.filter( favorite => favorite.id !== idMeal );
        localStorage.setItem( "favorites" , JSON.stringify( newFavorites ) );

    }


    function existsStorage( id ) {
        
        const favorites = JSON.parse( localStorage.getItem( "favorites" ) ) ?? [];
        return favorites.some( favorite => favorite.id === id );
    }


    function showToast( message ) {
        
        const toastDiv = document.querySelector( "#toast" );
        const toastBody = document.querySelector( ".toast-body" );
        const toast = new bootstrap.Toast( toastDiv );
        toastBody.textContent = message;
        toast.show(); 
    
    }


    function getFavorites() {
        
        const favorites = JSON.parse( localStorage.getItem( "favorites" ) ) ?? [];
        
        if ( favorites.length ) {

            showRecipes( favorites );
            return;
        }

        const anyFavorites = document.createElement( "DIV" );
        anyFavorites.textContent = "There is no favorites yet";
        anyFavorites.classList.add( "fs-4" , "text-center" , "font-bold" , "mt-5" );
        favoritesDiv.appendChild( anyFavorites );

    }

}

document.addEventListener( "DOMContentLoaded" , initApp );