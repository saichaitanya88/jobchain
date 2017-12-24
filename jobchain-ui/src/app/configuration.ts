import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Configuration {
    public ServerWithApiUrl = environment.ServerWithApiUrl;
}