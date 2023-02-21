import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-add-dialog",
  templateUrl: "./add-dialog.component.html",
  styleUrls: ["./add-dialog.component.scss"],
})
export class AddDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  form = this.fb.group({
    nome: new FormControl(null, null),
    cognome: new FormControl(null, null)
  });

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  onApply(): void {
    let nome = this.form.get('nome');
    let cognome = this.form.get('cognome');
    let obj = {
      nome: nome,
      cognome:cognome
    }
    this.dialogRef.close(obj);
  }
}
