import { Injectable } from '@angular/core';
import { Player } from './model/player';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class CrudService {
  playersRef: AngularFireList<any>;
  playerRef: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase,
    private toastr: ToastrService
    ) {}
  // Create player

  addPlayer(player: Player) {
    this.playersRef.push({
      nome: player.nome,
      cognome: player.cognome,
      vinte: player.vinte,
      perse: player.perse,
      golFatti: player.golFatti,
      golSubiti: player.golSubiti
    });
  }
  // Fetch Single player Object
  getPlayer(id: string) {
    this.playerRef = this.db.object('players-list/' + id);
    return this.playerRef;
  }
  // Fetch players List
  getPlayersList() {
    this.playersRef = this.db.list('players-list');
    return this.playersRef;
  }
  // Update player Object
  updatePlayer(player: Player) {
    this.playerRef.update({
        nome: player.nome,
        cognome: player.cognome,
        vinte: player.vinte,
        perse: player.perse,
        golFatti: player.golFatti,
        golSubiti: player.golSubiti
    });

    this.toastr.success(
      'Player' + player.nome + ' '+ player.cognome + ' stats updated successfully'
     );
  }
  // Delete player Object
  Deleteplayer(id: string) {
    this.playerRef = this.db.object('players-list/' + id);
    this.playerRef.remove();
  }
}