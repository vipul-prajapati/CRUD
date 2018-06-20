import { Injectable } from '@angular/core';  
import { Http, Headers, RequestOptions, Response } from '@angular/http'; 
import { Observable, Subject } from 'rxjs';  
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { allUsers } from './app.model';

@Injectable()
export class getAllUsers {
    jsonUserURL = "http://localhost:3000/contactlist";
     
    constructor(private http:Http) {};

    getAllUsersList(): Observable < allUsers[] >{
        return this.http.get(this.jsonUserURL)
            .map(this.extractData)
            .catch(this.handleError);
    }
    //Create contact
    createContact(allUsers: allUsers):Observable<number> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: cpHeaders });
            return this.http.post(this.jsonUserURL, allUsers, options)
                   .map(success => success.status)
                   .catch(this.handleError);
    }

    // Update contact by ID
    updateContact(allUsers: allUsers):Observable<allUsers> {

            let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: cpHeaders });
                return this.http.put(this.jsonUserURL +"/"+ allUsers.id, allUsers, options)
                       .map(success => success.status)
                       .catch(this.handleError);
    }
    //Fetch Contact by by id
    getContactrById(transactionid: string): Observable<allUsers> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        console.log(this.jsonUserURL +"/"+ transactionid);
        return this.http.get(this.jsonUserURL +"/"+ transactionid)
           .map(this.extractData)
           .catch(this.handleError);
    }

    //Delete Contact by id
    deleteContactById(deltransid: string): Observable<number> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: cpHeaders });
        return this.http.delete(this.jsonUserURL +"/"+ deltransid)
            .map(success => success.status)
            .catch(this.handleError);
    }	

    private extractData(res: Response) {
        let body = res.json();
        return body;
    }

    private handleError (error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.status);
    }
    
}
