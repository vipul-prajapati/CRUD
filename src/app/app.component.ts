import { Component, OnInit } from '@angular/core';
//import { HttpClientModule } from '@angular/common/http';
//import { HttpClient } from 'selenium-webdriver/http';
import { ReactiveFormsModule } from '@angular/forms';
import { getAllUsers } from './app.services';
import { allUsers } from './app.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: "users list";
  users: allUsers[];  
  errorMessage: string;  
  userId: null;
  statusCode:number;
  requestProcessing = false;
   articleIdToUpdate = null;
   processValidation = false;

  //Create form
  userForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone_number: new FormControl('', Validators.required),   
    status: new FormControl('', Validators.required)
});


  constructor(private getAllUsers: getAllUsers){
    this.users = [];
  }

  ngOnInit(): void {
    this.fetchAllusers();
  }  

  fetchAllusers() {
    this.getAllUsers.getAllUsersList()
    .subscribe(
      data => this.users = data,
    );
  }

  //Handle create and update article
  onUserFormSubmit() {
	  this.processValidation = true;   
	  if (this.userForm.invalid) {
	       return; 
	  }   
	  //Form is valid, now perform create or update
    this.preProcessConfigurations();
    let createTrans = this.userForm.value;
    let createContact = this.userForm.value;
    if (this.articleIdToUpdate === null) {  
	    //Generate Contact id then create Create
            this.getAllUsers.getAllUsersList()
	      .subscribe(allUsers => {
			 
       //Generate article id	 
       
   /*   let maxIndex = createTrans.length - 1;
      console.log(maxIndex);
		   let articleWithMaxIndex = createTrans[maxIndex];
       let articleId = articleWithMaxIndex + 1;
       console.log(articleId);
       createTrans.id = articleId;*/
	  //let  = this.userForm.value;
    	   
		   //Create ContactList
     	  this.getAllUsers.createContact(createContact)
			  .subscribe(successCode => {
				   this.statusCode = successCode;
				   this.fetchAllusers();	
				   this.backToCreateArticle();
				 },
				 errorCode => this.statusCode = errorCode
			   );
		 });		
	   } else {  
   	     //Handle update Contact
          createContact.id = this.articleIdToUpdate; 
        		
	     this.getAllUsers.updateContact(createContact)
	        .subscribe(successCode => {
		   //  this.statusCode = successCode;
		     this.fetchAllusers();	
		     this.backToCreateArticle();
		},
	  	errorCode => this.statusCode = errorCode);	  
	   }
   }

  

  EditContact(id) {
    this.preProcessConfigurations();
      this.getAllUsers.getContactrById(id)
	   .subscribe(allUsers => {
	            this.articleIdToUpdate = allUsers.id;   
	            this.userForm.setValue({first_name: allUsers.first_name, last_name: allUsers.last_name, email: allUsers.email, phone_number: allUsers.phone_number, status: allUsers.status  });
	   	    this.processValidation = true;
		    this.requestProcessing = false;   
	   },
      errorCode =>  this.statusCode = errorCode);  
  }

  deleteContact(deleteid){

    this.preProcessConfigurations();
    this.getAllUsers.deleteContactById(deleteid)
      .subscribe(successCode => {
    //this.statusCode = successCode;
      //Expecting success code 204 from server
    this.statusCode = 204;
    this.fetchAllusers();	
    this.backToCreateArticle();
  },
  errorCode => this.statusCode = errorCode); 

  }

  //Perform preliminary processing configurations
  preProcessConfigurations() {
    this.statusCode = null;
    this.requestProcessing = true;   
 }
 //Go back from update to create
 backToCreateArticle() {
    this.articleIdToUpdate = null;
    this.userForm.reset();	  
    this.processValidation = false;
 }
}
