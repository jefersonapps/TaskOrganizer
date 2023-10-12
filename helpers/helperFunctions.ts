import { File } from "../contexts/AppContext";

export function getIconForFile(file: File) {
  const extension = file.name.split(".").pop();
  switch (extension) {
    case "doc":
    case "docx":
      return "file-word";
    case "ppt":
    case "pptx":
      return "file-powerpoint";
    case "xls":
    case "xlsx":
      return "file-excel";
    case "pdf":
      return "file-pdf-box";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "file-image";
    case "mp3":
    case "wav":
    case "ogg":
    case "opus":
    case "m4a":
      return "file-music";
    default:
      return "file";
  }
}

export function getColorForFile(file: File) {
  const extension = file.name.split(".").pop();
  switch (extension) {
    case "doc":
    case "docx":
      return "#4a86e8"; // Azul para Word
    case "ppt":
    case "pptx":
      return "#ff6f00"; // Laranja para PowerPoint
    case "xls":
    case "xlsx":
      return "#38761d"; // Verde para Excel
    case "pdf":
      return "#cc0000"; // Vermelho para PDF
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "#6aa84f"; // Verde para imagens
    case "mp3":
    case "wav":
    case "ogg":
    case "opus":
    case "m4a":
      return "#674ea7"; // Roxo para arquivos de música
    default:
      return "gray"; // Preto para outros tipos de arquivo
  }
}

export function formatTimeStamp(dataISO: string) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0"); // Os meses são de 0 a 11, então adicionamos 1
  const ano = data.getFullYear();
  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  const segundos = String(data.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
}
