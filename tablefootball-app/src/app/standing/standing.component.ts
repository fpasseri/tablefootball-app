import { Component, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { CrudService } from "../app.service";
import { Player } from "../model/player";

@Component({
  selector: "app-standing",
  templateUrl: "./standing.component.html",
  styleUrls: ["./standing.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StandingComponent {
  
  players: Player[];
  matTableDataSource = new MatTableDataSource([]);
  tableData: any[] = [];

  displayedColumns: string[] = [
    'nome',
    'vinte',
    'perse',
    'golFatti',
    'golSubiti',
    'giocate',
    '%'
  ];


  constructor(
    public dialogRef: MatDialogRef<StandingComponent>,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CrudService
  ) {}
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    let s = this.service.getPlayersList(); 
    s.snapshotChanges().subscribe(data => {
      this.players = [];
      data.forEach(item => {
        let a = item.payload.toJSON(); 
        a['$key'] = item.key;
        this.players.push(a as Player);
      })
      this.tableData = this.players;
      this.matTableDataSource.data = this.tableData;
      this.matTableDataSource.sort = this.sort;
      this.matTableDataSource.paginator = this.paginator;
    })
  }

  ngAfterViewInit() {
    this.sort.sort(({ id: '%', start: 'desc'}) as MatSortable);
    this.matTableDataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case "%":
          return item.vinte/item.perse
        default:
          return item[property];
      }
    };
  }


}
