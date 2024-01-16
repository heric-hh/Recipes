function initApp() {

    const selectCategories = document.querySelector( "#categorias" );
    selectCategories.addEventListener( "change" , selectCategory );
    const results = document.querySelector( "#resultado" );
    const modal = new bootstrap.Modal( "#modal" , {});

    getCategories();

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
            mealImage.alt = `Meal image: ${strMeal}`;
            mealImage.src = strMealThumb;

            const mealCardBody = document.createElement( "DIV" );
            mealCardBody.classList.add( "card-body" );

            const mealHeading = document.createElement( "H3" );
            mealHeading.classList.add( "card-title" );
            mealHeading.textContent = strMeal;

            const mealButton = document.createElement( "BUTTON" );
            mealButton.classList.add( "btn" , "btn-danger" , "w-100" );
            mealButton.textContent = "View Recipe";
            mealButton.onclick = function() {
                selectMeal( idMeal);
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


        modal.show();
    }

}

document.addEventListener( "DOMContentLoaded" , initApp );