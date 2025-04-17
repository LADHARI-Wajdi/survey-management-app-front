import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  /**
   * Télécharge un fichier à partir d'un Blob
   * @param blob Le Blob à télécharger
   * @param filename Nom du fichier
   */
  downloadFile(blob: Blob, filename: string): void {
    // Créer un URL objet pour le blob
    const url = window.URL.createObjectURL(blob);

    // Créer un élément <a> temporaire
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    // Ajouter l'élément au DOM et déclencher un clic
    document.body.appendChild(a);
    a.click();

    // Nettoyer
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Convertit des données JSON en CSV
   * @param data Tableau d'objets JSON
   * @param headers En-têtes personnalisés (optionnel)
   * @returns CSV formaté en string
   */
  jsonToCsv(data: any[], headers?: { key: string; label: string }[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    // Si les en-têtes ne sont pas fournis, les créer à partir du premier objet
    if (!headers || headers.length === 0) {
      headers = Object.keys(data[0]).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      }));
    }

    // Créer la ligne d'en-tête
    const headerRow = headers.map((h) => `"${h.label}"`).join(',');

    // Créer les lignes de données
    const rows = data.map((item) => {
      return headers!
        .map((header) => {
          const value = item[header.key];
          return value !== null && value !== undefined ? `"${value}"` : '""';
        })
        .join(',');
    });

    // Combiner les en-têtes et les lignes
    return [headerRow, ...rows].join('\n');
  }

  /**
   * Convertit des données en format PDF (utilisation d'une bibliothèque externe requise)
   * @param data Données à convertir
   * @param title Titre du document
   */
  exportToPdf(data: any, title: string): void {
    // Cette méthode nécessite une bibliothèque comme jsPDF ou pdfmake
    console.log(
      'Export PDF non implémenté - nécessite une bibliothèque externe'
    );
    // Exemple d'implémentation avec jsPDF :
    // import jsPDF from 'jspdf';
    // const doc = new jsPDF();
    // doc.text(title, 10, 10);
    // ... ajouter le contenu ...
    // doc.save(`${title}.pdf`);
  }

  /**
   * Convertit des données en format Excel (utilisation de SheetJS ou similaire requise)
   * @param data Données à convertir
   * @param filename Nom du fichier
   */
  exportToExcel(data: any[], filename: string): void {
    // Cette méthode nécessite une bibliothèque comme SheetJS (xlsx)
    console.log(
      'Export Excel non implémenté - nécessite une bibliothèque externe'
    );
    // Exemple d'implémentation avec SheetJS :
    // import * as XLSX from 'xlsx';
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}
