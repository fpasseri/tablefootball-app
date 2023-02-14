import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tablefootball-app';

  todo = [
    'GIULIA CICATIELLO',
    'IOLANDA FERRI',
    'VALERIO ROMANO',
    'ELENA FAZIO',
  ];

  form = this.fb.group({
    gol1: new FormControl(null,null),
    gol2: new FormControl(null,null)
  })
  
  player1: string[] = [];
  player2: string[] = [];
  player3: string[] = [];
  player4: string[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log(this.todo);
    console.log(this.player1);
  }

  noReturnPredicate(number: Number) {
    if (number > 0) {
      return false;
    } else {
      return true;
    }
  }

  dropListEnterPredicate(list: string[]){
    return function(drag: CdkDrag, drop: CdkDropList) {
        return list.length == 0;
    };
  }

  constructor(private fb: FormBuilder) {}
}
