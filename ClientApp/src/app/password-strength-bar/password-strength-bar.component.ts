import {Component, OnChanges, Input, SimpleChange, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  styleUrls: ['./password-strength-bar.component.scss']
})
export class PasswordStrengthBarComponent implements OnChanges  {

  @Input() passwordToCheck: string;
  @Input() min: any;
  @Input() barLabel: string;
  @Output() passwordStrength = new EventEmitter<boolean>();
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;
  msg: string;
  msgColor: string;
  private colors = ['darkred', 'orangered', 'orange','green','yellowgreen'];

  checkStrength(p) {
    // 1
    let force = 0;
    console.log(this.min,"this.min")
    // 2
    const regex = /[$-/:-?{#-~!"^_@`\[\]]/g;
    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
    const len=p.length>=this.min ?true:false;
    // 3
    const flags = [lowerLetters, upperLetters, numbers, symbols,len];

    // 4
    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    // 5
    force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
    force += passedMatches * 10;

    // 6


    // 7
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
    force = (passedMatches === 5) ? Math.min(force, 50) : force;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;
    this.setBarColors(4, '#DDD');
    if (password) {
      const c = this.getColor(this.checkStrength(password));
      this.setBarColors(c.index, c.color);
    }
    const pwdStrength = this.checkStrength(password);
    pwdStrength === 50 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);
 //console.log("pwdStrength "+pwdStrength)

  }

  private getColor(s) {
    let index = 0;
    if (s === 10) {
      index = 0;
    } else if (s === 20) {
      index = 1;
    } else if (s === 30) {
      index = 2;
    } else if (s === 40) {
      index = 3;
    } else if (s === 50){
      index = 4;
    }
    this.msgColor = this.colors[index];
    return {
      index: index + 1,
      color: this.colors[index],

    };

  }

  private setBarColors(count, col) {
    for (let n = 0; n <= count; n++) {
      this['bar' + n] = col;
    }
  }

}
