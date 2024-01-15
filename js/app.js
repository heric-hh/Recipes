function initApp() {

    const selectCategories = document.querySelector( "#categorias" );
    selectCategories.addEventListener( "change" , selectCategory );
    const results = document.querySelector( "#resultado" );

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

}

document.addEventListener( "DOMContentLoaded" , initApp );