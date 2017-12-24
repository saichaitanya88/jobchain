import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  constructor() { }

  getItem(key: string): any{
    var result = localStorage.getItem(key);
    if (result){
      result = JSON.parse(result);
    }
    return result;
  }

  setItem(key: string, value: object){
    localStorage.setItem(key, JSON.stringify(value));
  }

  setPlainStringItem(key: string, value: string){
    localStorage.setItem(key, value);
  }
  getPlainStringItem(key: string){
    return localStorage.getItem(key);
  }

  reset(){
    localStorage.clear();
  }

  removeItem(key: string){
    localStorage.removeItem(key);
  }

}
