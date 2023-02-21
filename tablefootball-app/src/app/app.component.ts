import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { environment } from 'src/environments/environments';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { concatMap, of, Subscription } from 'rxjs';
import { CrudService } from './app.service';
import { ToastrService } from 'ngx-toastr';
import { Player } from './model/player';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { StandingComponent } from './standing/standing.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tablefootball-app';
  pageSubscription= new Subscription();
  players = [];
  hideWhenNoStudent:boolean;
  noData:boolean;
  player1: Player[] = [];
  player2: Player[] = [];
  player3: Player[] = [];
  player4: Player[] = [];

  constructor(private fb: FormBuilder,
    private service: CrudService,
    private dialog: MatDialog,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    // Initialize Firebase
    const app = initializeApp(environment.firebaseConfig);
    const analytics = getAnalytics(app);
    this.dataState();
    let s = this.service.getPlayersList(); 
    s.snapshotChanges().subscribe(data => {
      this.players = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.players.push(a as Player);
      })
    })
  }

  get player1Value() {
    return this.form.get('player1').value;
  }

  get player2Value() {
    return this.form.get('player2').value;
  }

  get player3Value() {
    return this.form.get('player3').value;
  }

  get player4Value() {
    return this.form.get('player4').value;
  }


  dataState() {     
    this.service.getPlayersList().valueChanges().subscribe(data => {
      if(data.length <= 0){
        this.hideWhenNoStudent = false;
        this.noData = true;
      } else {
        this.hideWhenNoStudent = true;
        this.noData = false;
      }
    })
  }

  form = this.fb.group({
    player1: [null, [Validators.required]],
    player2: [null, [Validators.required]],
    player3: [null, [Validators.required]],
    player4: [null, [Validators.required]],
    gol1: [null, [Validators.required]],
    gol2: [null, [Validators.required]]
  });



  drop(event: CdkDragDrop<Player[]>) {
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
  }

  noReturnPredicate(number: number) {
    if (number > 0) {
      return false;
    } else {
      return true;
    }
  }

  dropListEnterPredicate(list: Player[]) {
    return function (drag: CdkDrag, drop: CdkDropList) {
      return list.length == 0;
    };
  }

  addPlayer() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      disableClose: true,
      minWidth: '300px',

      data: {
        title: 'Add new player',
        body: '',
      },
    });
    this.pageSubscription.add(dialogRef.afterClosed().subscribe(obj => {
      if (obj) {
            const player = {
              nome: obj.nome.value,
              cognome: obj.cognome.value,
              vinte: 0,
              perse: 0,
              golFatti: 0,
              golSubiti: 0
            };

            // this.service.addPlayer(player).subscribe(obj => {
            //   this.toastr.success(
            //     obj + ' successfully added!'
            //   );  
            // })
            this.service.addPlayer(player);
            this.toastr.success(
              obj.nome.value + ' ' +  + obj.cognome.value + ' successfully added!'
            );
      }
    }))
  }

  showStanding() {
    const dialogRef = this.dialog.open(StandingComponent, {
      disableClose: false,
      minWidth: '300px',

      data: {
        title: 'Standing',
        body: '',
      },
    });
  }

  saveMatch() {
    console.log(this.player1);
    let gol1 = Number(this.form.get('gol1').value);
    let gol2 = Number(this.form.get('gol2').value);

    this.updateResults(this.player1[0].$key,1,gol1,gol2);
    this.updateResults(this.player2[0].$key,1,gol1,gol2);
    this.updateResults(this.player3[0].$key,2,gol1,gol2);;
    this.updateResults(this.player4[0].$key,2,gol1,gol2);
  }

  saveMatchXs() {

    let player1Id = this.form.get('player1').value;
    let player2Id = this.form.get('player2').value;
    let player3Id = this.form.get('player3').value;
    let player4Id = this.form.get('player4').value;

    let gol1 = Number(this.form.get('gol1').value);
    let gol2 = Number(this.form.get('gol2').value);


    this.updateResults(player1Id,1,gol1,gol2);
    this.updateResults(player2Id,1,gol1,gol2);
    this.updateResults(player3Id,2,gol1,gol2);
    this.updateResults(player4Id,2,gol1,gol2);
  }

  updateResults(player:string,team:any,gol1:number,gol2:number) {

    let playerToUpdate: Player;
    let win = ((team == 1 && gol1 == 10) || (team == 2 && gol2 == 10)) ? 1 : 0;
    let lost = win == 0 ? 1 : 0;
    let playerGoalsScored = team == 1 ? gol1 : gol2;
    let playerGoalsAgainst = team == 1 ? gol2 : gol1;

    for (var i = 0; i < this.players.length;i++) {
      if (player == this.players[i].$key) {
        this.service.getPlayer(player);
        playerToUpdate = this.players[i];
      }
    }

    if (playerToUpdate) {
      playerToUpdate.vinte = playerToUpdate.vinte + win;
      playerToUpdate.perse =  playerToUpdate.perse + lost;
      playerToUpdate.golFatti = playerToUpdate.golFatti + playerGoalsScored;
      playerToUpdate.golSubiti = playerToUpdate.golSubiti + playerGoalsAgainst;
    }

   this.service.updatePlayer(playerToUpdate);
  }
}
