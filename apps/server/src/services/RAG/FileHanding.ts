import { createWorker } from "tesseract.js";
import * as fs from "fs";
import * as XLSX from "xlsx";
const PDFParser = require("pdf-parse");

export async function convertFileToText(file: Express.Multer.File) {
  const fileExtension: string = file.mimetype.split("/")[1];
  console.log("file type : ", fileExtension);

  if (fileExtension === "pdf") {
    return await convertPdfToText(file);
  } else if (["csv", "plain"].includes(fileExtension)) {
    return await readTextFile(file);
  } else if (
    [
      "xls",
      "xlsx",
      "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ].includes(fileExtension)
  ) {
    return await extractTextFromExcel(file);
  } else if (["jpg", "jpeg", "png"].includes(fileExtension)) {
    return await extractTextFromImage(file);
  } else {
    throw Error("Unsupported File Type");
  }
}

const convertPdfToText = async (file: Express.Multer.File) => {
  const pdfBuffer = fs.readFileSync(file.path);
  const pdfText = await PDFParser(pdfBuffer);

  return pdfText.text;
};
const readTextFile = async (file: Express.Multer.File) => {
  return fs.readFileSync(file.path, "utf8");
};
const extractTextFromExcel = async (file: Express.Multer.File) => {
  XLSX.set_fs(fs);
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(file.path);

    let text = "";

    // Process each sheet in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      // Convert each sheet to text
      const worksheet = workbook.Sheets[sheetName];
      const sheetText = XLSX.utils.sheet_to_csv(worksheet);
      text += sheetText + "\n";
    });

    return text;
  } catch (err) {
    console.error("Error converting Excel to text:", err);
    throw err;
  }
};
const extractTextFromImage = async (file: Express.Multer.File) => {
  const worker = await createWorker("eng");
  const ret = await worker.recognize(file.path);
  await worker.terminate();

  const output = ret.data.text;
  console.log(output);
  return output;
};
