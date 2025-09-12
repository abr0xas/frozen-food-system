import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  transform(_value: unknown, ..._args: unknown[]): unknown {
    return null;
  }

}
