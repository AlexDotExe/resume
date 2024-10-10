var EDIT = false;
var clicked = false;

function toggleEdit(){
    let editButton = document.getElementById('edit');
if(!EDIT){
    EDIT = true;
    editButton.style.color = 'lime'; 
    editButton.innerHTML = "EDIT ON"
    disableLinksAndButtons();
}   
else{
    EDIT = false;
        editButton.style.color = 'red'; 
    editButton.innerHTML = "EDIT OFF"
    enableLinksAndButtons();
}
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //HOVER FUNCTIONALITY
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    function disableLinksAndButtons() {


// Function to handle the hover effect (border highlight)
let originalBorderColor = "";
let originalBorderStyle = "";
let originalElement;
document.addEventListener("mousedown", function (event) {
    if (!EDIT) return;  // If EDIT is false, do nothing
    
    if(clicked){
    
    let hoveredElement = event.target;
    originalElement = hoveredElement;

    // Store the original border color and style before changing them
    originalBorderColor = hoveredElement.style.borderColor;
    originalBorderStyle = hoveredElement.style.borderStyle;

    // Highlight the element by changing its border color and style
    hoveredElement.style.borderColor = "red";  // Set border color to yellow
    hoveredElement.style.borderStyle = "solid";   // Ensure a solid border is applied
    hoveredElement.style.borderWidth = "10px";     // Set the border width to 2px for visibility
    }
    else{
        if(originalElement){
        originalElement.style.borderColor = originalBorderColor;
        originalElement.style.borderStyle = originalBorderStyle;
        originalElement.style.borderWidth = originalBorderStyle ? "1px" : "";  // Reset border width if necessary
        }
    }
    clicked = !clicked;
});

// Function to remove the hover effect (restore original border)
// document.addEventListener("mouseout", function (event) {
//     if (!EDIT) return;  // If EDIT is false, do nothing

//     let hoveredElement = event.target;

//     // Restore the original border color and style when the mouse leaves the element
//     hoveredElement.style.borderColor = originalBorderColor;
//     hoveredElement.style.borderStyle = originalBorderStyle;
//     hoveredElement.style.borderWidth = originalBorderStyle ? "1px" : "";  // Reset border width if necessary
// });
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //EDIT FUNCTIONALITY
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    function disableLinksAndButtons() {

let contextMenu;  // Variable to store the context menu
let menuActive = false;  // Variable to track if a menu interaction is active

// Function to create and show the contextual menu
function showContextMenu(clickedElement, event) {
    if (menuActive) return;  // Prevent menu from appearing if a menu interaction is active

    // Remove any existing context menu before creating a new one
    if (contextMenu) {
        document.body.childNodes.forEach( (child) => {
            if(child.isEqualNode(contextMenu)){
                document.body.removeChild(contextMenu);
            }
        })
        
    }

    // Create the menu container
    contextMenu = document.createElement("div");
    contextMenu.style.position = "absolute";
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.background = "white";
    contextMenu.style.border = "1px solid #ccc";
    contextMenu.style.padding = "10px";
    contextMenu.style.zIndex = "1000";

    // Determine options based on the clicked element type
    if (clickedElement.nodeName === "BUTTON") {
        createMenuOption(contextMenu, "Change Button Text", function () {
            let newText = prompt("Enter new button text:", clickedElement.textContent);
            if (newText !== null) {
                clickedElement.textContent = newText;
            }
        });

        createMenuOption(contextMenu, "Change Button Color", function () {
            let colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.style.display = "none";
            colorInput.addEventListener("change", function () {
                clickedElement.style.backgroundColor = colorInput.value;
            });
            document.body.appendChild(colorInput);
            colorInput.click();
            document.body.removeChild(colorInput);
        });

    } else if (clickedElement.nodeName === "IMG") {
        createMenuOption(contextMenu, "Upload New Image", function () {
            let input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = function () {
                let file = input.files[0];
                if (file) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        clickedElement.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });

    } else if (clickedElement.nodeName === "P" || clickedElement.nodeName === "H1" || clickedElement.nodeName.startsWith("H")) {
        createMenuOption(contextMenu, "Edit Text", function () {
            clickedElement.contentEditable = true;
            clickedElement.focus();
            clickedElement.addEventListener("blur", function () {
                clickedElement.contentEditable = false;
            }, { once: true });
        });

        createMenuOption(contextMenu, "Change Text Color", function () {
            let colorInput = document.createElement("input");
            colorInput.type = "color";
            colorInput.style.display = "none";
            colorInput.addEventListener("change", function () {
                clickedElement.style.color = colorInput.value;
            });
            document.body.appendChild(colorInput);
            colorInput.click();
            document.body.removeChild(colorInput);
        });

    } else {
        // For elements like <div>, <span>, etc.
        if (clickedElement.innerText.trim() !== "") {
            createMenuOption(contextMenu, "Edit Text", function () {
                clickedElement.contentEditable = true;
                clickedElement.focus();
                clickedElement.addEventListener("blur", function () {
                    clickedElement.contentEditable = false;
                }, { once: true });
            });

            createMenuOption(contextMenu, "Change Text Color", function () {
                let colorInput = document.createElement("input");
                colorInput.type = "color";
                colorInput.style.display = "none";
                colorInput.addEventListener("change", function () {
                    clickedElement.style.color = colorInput.value;
                });
                document.body.appendChild(colorInput);
                colorInput.click();
                document.body.removeChild(colorInput);
            });
        } else {
            createMenuOption(contextMenu, "Change Background Color", function () {
                let colorInput = document.createElement("input");
                colorInput.type = "color";
                colorInput.style.display = "none";
                colorInput.addEventListener("change", function () {
                    clickedElement.style.backgroundColor = colorInput.value;
                });
                document.body.appendChild(colorInput);
                colorInput.click();
                document.body.removeChild(colorInput);
            });
        }
    }

    // Append the context menu to the body
    document.body.appendChild(contextMenu);

    // Set menuActive to true, indicating that a menu interaction is in progress
    menuActive = true;
}

// Helper function to create an option in the menu
function createMenuOption(menu, text, callback) {
    let option = document.createElement("div");
    option.textContent = text;
    option.style.padding = "5px";
    option.style.cursor = "pointer";
    option.addEventListener("click", function () {
        callback();
        // Remove the menu after selection and prevent reappearing
        document.body.removeChild(menu);
        menuActive = false;  // Set menuActive to false, allowing the menu to be shown again on next click
    });
    option.addEventListener("mouseover", function () {
        option.style.backgroundColor = "#eee";  // Highlight option on hover
    });
    option.addEventListener("mouseout", function () {
        option.style.backgroundColor = "transparent";  // Remove highlight
    });
    menu.appendChild(option);
}

// Remove context menu on click outside of it and reset menuActive
document.addEventListener("click", function (event) {
    if (contextMenu && !contextMenu.contains(event.target)) {
        document.body.removeChild(contextMenu);
          // Reset menuActive when clicked outside
    }
});

// Main function to handle click events for showing the context menu
document.addEventListener("click", function (event) {
    if (!EDIT) return;  // If EDIT is false, do nothing
    if (menuActive) {menuActive = false; return;}  // If a menu interaction is active, prevent the menu from reappearing

    event.preventDefault();  // Prevent default behavior
    event.stopPropagation(); // Stop propagation of the event

    let clickedElement = event.target;

    // Show context menu near the click
    showContextMenu(clickedElement, event);
});

        
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function disableLinksAndButtons() {
                    // Disable all links
        let links = document.querySelectorAll("a");
        links.forEach(function(link) {
            link.addEventListener("click", function(event) {
                event.preventDefault();  // Prevent the link from navigating
            });
            link.style.pointerEvents = "none";  // Disable pointer events
            link.style.opacity = "0.5";  // Optional: visually indicate that the link is disabled
        });
    
        // Disable all buttons
        let buttons = document.querySelectorAll("button");
        buttons.forEach(function(button) {
            button.disabled = true;  // Disable the button
            button.style.opacity = "0.5";  // Optional: visually indicate that the button is disabled
        });
    }

    function enableLinksAndButtons() {
        // Enable all links
        let links = document.querySelectorAll("a");
        links.forEach(function(link) {
            link.style.pointerEvents = "auto";  // Re-enable pointer events
            link.style.opacity = "1";  // Reset the opacity
        });
    
        // Enable all buttons
        let buttons = document.querySelectorAll("button");
        buttons.forEach(function(button) {
            button.disabled = false;  // Enable the button
            button.style.opacity = "1";  // Reset the opacity
        });
    }