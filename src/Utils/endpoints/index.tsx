import {environment} from '../constant';

class Endpoints {
  baseUrl = environment.baseUrl;
  LOGIN = this.baseUrl + 'login';
  INIT_SIGNUP = this.baseUrl + 'init_register';
  SETUP = this.baseUrl + 'register';
  PROFILE_UPDATE = this.baseUrl + 'register';
  CREATE_PROJECT = this.baseUrl + 'projects';
  GET_ALLPROJECTS = this.baseUrl + 'projects';
  UPDATE_PROJECT = this.baseUrl + 'projects';
  DELETE_PROJECT = (id: string | number) => `${this.baseUrl}projects/${id}/request_type=DELETE`;
  GET_PROJECTS_BY_ID: (id: string | number) => string = (id: string | number): string => `${this.baseUrl}projects/${id}`;

} 

export const API = new Endpoints();
