import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pdf-search',
  templateUrl: './pdf-search.component.html',
  styleUrls: ['./pdf-search.component.scss'],
})
export class PdfSearchComponent implements OnInit {
  ngOnInit() {
    //this.loadPdfFiles();
  }
  // openDirectoryDialog(): void {
  //   const dialogRef = this.dialog.open(DirectoryDialogComponent);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       console.log('Diretório selecionado:', result);
  //     }
  //   });
  // }
}
