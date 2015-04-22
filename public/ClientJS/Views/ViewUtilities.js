/**
 * Holds all of the getter and setter methods for the views and page rendering
 */

/**
 * Toggle the visibility of a div by id
 */
function toggle_visibility(id , element) {
       var e = document.getElementById(id);
       if(e.style.display == 'block'){
          e.style.display = 'none';
       }else{
          e.style.display = 'block';
       }
}


/**
 * clears all of div's on the page 
 */
function clearPageElements(){
	 clearHeader();
	 clearNav();
	 clearSideBar();
	 clearContainer();
	 clearSection();
}

/**
 * clearNav clears the navigation bar on the page 
 */
function clearNav(){
	var nav = document.getElementsByTagName("nav")[0];
	nav.innerHTML = '';
}

/**
 * clearSideBar clears the side bar on the page 
 */
function clearSideBar(){
	var sideBar = document.getElementsByTagName("aside")[0];
	sideBar.innerHTML = '';
}

/**
 * clearHeader clears the header on the page 
 */
function clearHeader(){
	var header = document.getElementsByTagName("header")[0];
	header.innerHTML = '';
	
}

/**
 * clearContainer clears the container on the page 
 */
function clearContainer(){
	var container = document.getElementById("content");
	container.innerHTML = '';
	
}

function clearSection(){
	var section = document.getElementsByTagName("section")[0];
	section.innerHTML = '';
}

/**
 * Get Html Elements
 * ----------------------
 */

/**
 * getHeader gets the information within header
 */
function getHeader(){
	var header = document.getElementsByTagName("header")[0];
	return header;
}

/**
 * getSidebar gets the information within the sidebar
 */
function getSideBar(){
	var sideBar = document.getElementsByTagName("aside")[0];
	return sideBar;
}

/**
 * getSection gets the information within section
 */
function getSection(){
	var section = document.getElementsByTagName("section")[0];
	return section;
}

/**
 * getContainer gets the information within the container
 */
function getContainer(){
	var container = document.getElementById("content");
	return container;
}

/** Function to get the great grand parent of the starting node
 * @param, start_point, the starting point node
 */
function getGreatGrandParentElement(start_point){
	return start_point.parentNode.parentNode.parentNode;
	
}

/** function to get the grand parent of a starting node
 * @param, start_point, the starting point node
 */
function getGrandParentElement(start_point){
	return start_point.parentNode.parentNode;
	
}

function removeClass(class_name){
	var list= document.getElementsByClassName(class_name);
	for (var i=0; i<list.length;i++){
		list[i].className='';
	}
}