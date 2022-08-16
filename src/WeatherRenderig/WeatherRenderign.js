window.addEventListener('load', () => { 

    const simpliTagEnvOuterWrapper = __simpli.runtime().environment.outerWrapper;

    const getParents =  (elem) => {

        // Set up a parent array
        let parentsArray = [];
    
        // Push each parent element to the array
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            parentsArray.push(elem);
        }

        // Return our parent array
        return parentsArray;
    
    };

    const parents = getParents(simpliTagEnvOuterWrapper);

    // Search each parent element that have a hidden overflow and set it as visible.
    parents.forEach(element => {

        if(element.tagName != undefined){
            let currentElement = window.getComputedStyle(element).overflow;

            if(currentElement == 'hidden'){
                element.style.overflow = 'visible';
            }
        }
        
    });

})