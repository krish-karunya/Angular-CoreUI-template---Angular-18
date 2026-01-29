import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../window-providers';

@Injectable()
export class HelperService {
  private indentSpaces: number = 5;

  constructor(@Inject(WINDOW) private window: Window) {
  }

  getHost(): string {
    return this.window.location.host;
  }

  getHostname(): string {
    return this.window.location.hostname;
  }

  getProtocol(): string {
    return this.window.location.protocol;
  }

  getPort(): string {
    return this.window.location.port;
  }

  getOrigin(): string {
    return this.window.location.origin;
  }

  logArray(label: string, obj: Array<any>) {
    if (label != null) {
      console.log('Property Log for ' + label);
    }

    let index = 0;
    for (const o of obj) {
      this.logObject('Element ' + index + ':', o);
      index = index + 1;
    }
  }

  logObject(label: string, obj: any, expandSubObjects: boolean = false, indent = 0) {
    const padding: string = new Array(indent * this.indentSpaces + 1).join(' ');

    if (label != null) {
      //tslint:disable-next-line: no-shadowed-variable
      let output = 'Property Log for ' + label;
      output = padding + output;
      console.log(output);
    }

    if (obj == null) {
      // tslint:disable-next-line: no-shadowed-variable
      let output = 'Object is Null';
      output = padding + output;
      console.log(output);
    } else {
      for (const prop of Object.getOwnPropertyNames(obj)) {
        const isObject: boolean = this.isThingObject(obj[prop]);

        if (isObject) {
          if (expandSubObjects) {
            this.logObject('SUB ' + prop, obj[prop], expandSubObjects, indent + 1);
          } else {
            // tslint:disable-next-line: no-shadowed-variable
            let output = prop + ' -> [OBJECT]';
            output = padding + output;
            console.log(output);
          }
        } else {
          let output = prop + ' -> ' + obj[prop];
          output = padding + output;
          console.log(output);
        }
      }
    }
  }

  isThingObject(val: any): boolean {
    if (val === null) {
      return false;
    }

    return ((typeof val === 'function') || (typeof val === 'object'));
  }


  getStringArrayDisplayLimit(stringList: string[], limit: number) {

    /*
     Takes an array of strings and returns a count of records to use that are less than the limit if the string records were concatenated together.
    */ 

    var count: number = 0;
    var size: number = 0;

    for (const value of stringList) {
      size = size + value.length;

      if (count === 0 || size <= limit) {
        count++;
      }

      if (size > limit) {
        break;
      }
    }

    return count;
  }

}
